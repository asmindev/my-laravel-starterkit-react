<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\EmailTemplate;
use App\Models\Recipient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class CampaignController extends Controller
{
    public function index(Request $request)
    {
        $query = Campaign::with(['template', 'campaignRecipients']);

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $campaigns = $query->latest()->paginate(15)->withQueryString();

        // Add statistics to each campaign
        $campaigns->getCollection()->transform(function ($campaign) {
            $campaign->total_recipients = $campaign->campaignRecipients->count();
            $campaign->sent_count = $campaign->campaignRecipients->where('status', 'sent')->count();
            $campaign->failed_count = $campaign->campaignRecipients->where('status', 'failed')->count();
            $campaign->opened_count = $campaign->campaignRecipients->whereNotNull('opened_at')->count();
            $campaign->clicked_count = $campaign->campaignRecipients->whereNotNull('clicked_at')->count();

            return $campaign;
        });

        return Inertia::render('campaigns/index/index', [
            'campaigns' => $campaigns,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
        ]);
    }

    public function create()
    {
        $templates = EmailTemplate::select('id', 'name', 'subject')->get();
        $formTemplates = \App\Models\FormTemplate::where('is_active', true)
            ->select('id', 'name', 'description')
            ->get();
        $recipients = Recipient::where('is_subscribed', true)->select('id', 'email', 'name')->get();

        return Inertia::render('campaigns/create/index', [
            'templates' => $templates,
            'formTemplates' => $formTemplates,
            'recipients' => $recipients,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'template_id' => 'required|exists:email_templates,id',
            'form_template_id' => 'nullable|exists:form_templates,id',
            'recipient_ids' => 'required|array|min:1',
            'recipient_ids.*' => 'exists:recipients,id',
            'track_open' => 'boolean',
            'track_click' => 'boolean',
            'redirect_url' => 'nullable|url|max:500',
            'scheduled_at' => 'nullable|date|after:now',
            'send_now' => 'boolean',
        ]);

        $campaign = Campaign::create([
            'name' => $validated['name'],
            'template_id' => $validated['template_id'],
            'form_template_id' => $validated['form_template_id'] ?? null,
            'track_open' => $validated['track_open'] ?? false,
            'track_click' => $validated['track_click'] ?? false,
            'redirect_url' => $validated['redirect_url'] ?? null,
            'scheduled_at' => $validated['scheduled_at'] ?? null,
            'status' => $validated['scheduled_at'] ? 'scheduled' : 'draft',
        ]);

        // Attach recipients
        foreach ($validated['recipient_ids'] as $recipientId) {
            $campaign->campaignRecipients()->create([
                'recipient_id' => $recipientId,
                'status' => 'pending',
            ]);
        }

        // If send_now is true, send immediately
        if ($validated['send_now'] ?? false) {
            $campaign->update(['status' => 'sending']);
            $campaign->load(['template', 'formTemplate', 'campaignRecipients.recipient']);

            $sentCount = 0;
            $failedCount = 0;

            foreach ($campaign->campaignRecipients as $campaignRecipient) {
                $recipient = $campaignRecipient->recipient;

                if (! $recipient || ! $recipient->is_subscribed) {
                    continue;
                }

                // Generate tracking token if not exists
                if (! $campaignRecipient->tracking_token) {
                    $campaignRecipient->update([
                        'tracking_token' => \Str::random(32),
                    ]);
                    $campaignRecipient->refresh();
                }

                try {
                    Mail::to($recipient->email)->send(
                        new \App\Mail\CampaignEmail($campaign, $recipient, $campaignRecipient)
                    );

                    $campaignRecipient->update([
                        'status' => 'sent',
                        'sent_at' => now(),
                    ]);

                    $sentCount++;
                } catch (\Exception $e) {
                    $campaignRecipient->update([
                        'status' => 'failed',
                    ]);

                    $failedCount++;
                }
            }

            $campaign->update(['status' => 'sent']);

            return redirect()->route('campaigns.index')
                ->with('success', "Campaign created and sent! {$sentCount} emails sent, {$failedCount} failed.");
        }

        return redirect()->route('campaigns.index')
            ->with('success', 'Campaign created successfully!');
    }

    public function show(Campaign $campaign)
    {
        $campaign->load(['template', 'campaignRecipients.recipient', 'campaignRecipients.submissions']);

        // Calculate statistics
        $stats = [
            'total_recipients' => $campaign->campaignRecipients->count(),
            'sent_count' => $campaign->campaignRecipients->where('status', 'sent')->count(),
            'failed_count' => $campaign->campaignRecipients->where('status', 'failed')->count(),
            'pending_count' => $campaign->campaignRecipients->where('status', 'pending')->count(),
            'opened_count' => $campaign->campaignRecipients->whereNotNull('opened_at')->count(),
            'clicked_count' => $campaign->campaignRecipients->whereNotNull('clicked_at')->count(),
            'submitted_count' => $campaign->campaignRecipients->sum(fn($cr) => $cr->submissions->count()),
        ];

        // Calculate rates
        $stats['open_rate'] = $stats['sent_count'] > 0
            ? round(($stats['opened_count'] / $stats['sent_count']) * 100, 2)
            : 0;
        $stats['click_rate'] = $stats['sent_count'] > 0
            ? round(($stats['clicked_count'] / $stats['sent_count']) * 100, 2)
            : 0;
        $stats['submission_rate'] = $stats['sent_count'] > 0
            ? round(($stats['submitted_count'] / $stats['sent_count']) * 100, 2)
            : 0;

        // Flatten submissions for easier display
        $submissions = $campaign->campaignRecipients->flatMap(function ($cr) {
            return $cr->submissions->map(function ($submission) use ($cr) {
                return [
                    'id' => $submission->id,
                    'recipient_email' => $cr->recipient->email,
                    'recipient_name' => $cr->recipient->name,
                    'submitted_at' => $submission->created_at,
                    'ip_address' => $submission->ip_address,
                    'submitted_data' => $submission->submitted_data,
                ];
            });
        });

        return Inertia::render('campaigns/show/index', [
            'campaign' => $campaign,
            'stats' => $stats,
            'submissions' => $submissions,
        ]);
    }

    public function edit(Campaign $campaign)
    {
        // Only allow editing draft or scheduled campaigns
        if (! in_array($campaign->status, ['draft', 'scheduled'])) {
            return back()->with('error', 'Cannot edit campaign that is already sent or sending.');
        }

        $campaign->load(['template', 'campaignRecipients.recipient']);

        $templates = EmailTemplate::select('id', 'name', 'subject')->get();
        $formTemplates = \App\Models\FormTemplate::where('is_active', true)
            ->select('id', 'name', 'description')
            ->get();
        $recipients = Recipient::where('is_subscribed', true)->select('id', 'email', 'name')->get();

        return Inertia::render('campaigns/edit/index', [
            'campaign' => $campaign,
            'templates' => $templates,
            'formTemplates' => $formTemplates,
            'recipients' => $recipients,
        ]);
    }

    public function update(Request $request, Campaign $campaign)
    {
        // Only allow updating draft or scheduled campaigns
        if (! in_array($campaign->status, ['draft', 'scheduled'])) {
            return back()->with('error', 'Cannot update campaign that is already sent or sending.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'template_id' => 'required|exists:email_templates,id',
            'form_template_id' => 'nullable|exists:form_templates,id',
            'recipient_ids' => 'required|array|min:1',
            'recipient_ids.*' => 'exists:recipients,id',
            'track_open' => 'boolean',
            'track_click' => 'boolean',
            'redirect_url' => 'nullable|url|max:500',
            'scheduled_at' => 'nullable|date|after:now',
            'send_now' => 'boolean',
        ]);

        $campaign->update([
            'name' => $validated['name'],
            'template_id' => $validated['template_id'],
            'form_template_id' => $validated['form_template_id'] ?? null,
            'track_open' => $validated['track_open'] ?? false,
            'track_click' => $validated['track_click'] ?? false,
            'redirect_url' => $validated['redirect_url'] ?? null,
            'scheduled_at' => $validated['scheduled_at'] ?? null,
            'status' => $validated['scheduled_at'] ? 'scheduled' : 'draft',
        ]);

        // Sync recipients - remove old ones and add new ones
        $campaign->campaignRecipients()->delete(); // Remove existing

        foreach ($validated['recipient_ids'] as $recipientId) {
            $campaign->campaignRecipients()->create([
                'recipient_id' => $recipientId,
                'status' => 'pending',
            ]);
        }

        // If send_now is true, send immediately
        if ($validated['send_now'] ?? false) {
            $campaign->update(['status' => 'sending']);
            $campaign->load(['template', 'formTemplate', 'campaignRecipients.recipient']);

            $sentCount = 0;
            $failedCount = 0;

            foreach ($campaign->campaignRecipients as $campaignRecipient) {
                $recipient = $campaignRecipient->recipient;

                if (! $recipient || ! $recipient->is_subscribed) {
                    continue;
                }

                // Generate tracking token if not exists
                if (! $campaignRecipient->tracking_token) {
                    $campaignRecipient->update([
                        'tracking_token' => \Str::random(32),
                    ]);
                    $campaignRecipient->refresh();
                }

                try {
                    Mail::to($recipient->email)->send(
                        new \App\Mail\CampaignEmail($campaign, $recipient, $campaignRecipient)
                    );

                    $campaignRecipient->update([
                        'status' => 'sent',
                        'sent_at' => now(),
                    ]);

                    $sentCount++;
                } catch (\Exception $e) {
                    $campaignRecipient->update([
                        'status' => 'failed',
                    ]);

                    $failedCount++;
                }
            }

            $campaign->update(['status' => 'sent']);

            return back()->with('success', "Campaign updated and sent! {$sentCount} emails sent, {$failedCount} failed.");
        }

        return back()->with('success', 'Campaign updated successfully!');
    }

    public function destroy(Campaign $campaign)
    {
        // Only allow deleting draft campaigns
        if ($campaign->status !== 'draft') {
            return back()->with('error', 'Cannot delete campaign that is scheduled or sent.');
        }

        $campaign->delete();

        return redirect()->route('campaigns.index')
            ->with('success', 'Campaign deleted successfully!');
    }

    public function send(Campaign $campaign)
    {
        // if (!$campaign->canBeSent()) {
        //     return back()->with('error', 'Campaign cannot be sent in its current status.');
        // }

        $campaign->update(['status' => 'sending']);
        $campaign->load(['template', 'formTemplate']); // ✅ Load formTemplate!

        // Get all recipients for this campaign
        $campaignRecipients = $campaign->campaignRecipients()
            ->with('recipient')
            // ->where('status', 'pending')
            ->get();

        $sentCount = 0;
        $failedCount = 0;

        foreach ($campaignRecipients as $campaignRecipient) {
            $recipient = $campaignRecipient->recipient;
            Log::info('Sending campaign email to recipient', [
                'campaign_id' => $campaign->id,
                'recipient_id' => $recipient->id,
                'email' => $recipient->email,
            ]);

            // Skip if recipient unsubscribed
            if (! $recipient->is_subscribed) {
                continue;
            }

            // Generate tracking token if not exists
            if (! $campaignRecipient->tracking_token) {
                $campaignRecipient->update([
                    'tracking_token' => \Str::random(32),
                ]);
                $campaignRecipient->refresh();
            }

            try {
                // Send email
                Mail::to($recipient->email)->send(
                    new \App\Mail\CampaignEmail($campaign, $recipient, $campaignRecipient)
                );

                // Update status and sent_at timestamp
                $campaignRecipient->update([
                    'status' => 'sent',
                    'sent_at' => now(),
                ]);

                $sentCount++;
            } catch (\Exception $e) {
                // Update status to failed
                $campaignRecipient->update([
                    'status' => 'failed',
                ]);

                $failedCount++;

                // Log error but continue with other recipients
                Log::error('Failed to send campaign email', [
                    'campaign_id' => $campaign->id,
                    'recipient_id' => $recipient->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // Update campaign status
        $campaign->update(['status' => 'sent']);

        return back()->with('success', "Campaign sent! {$sentCount} emails sent, {$failedCount} failed.");
    }

    public function cancel(Campaign $campaign)
    {
        if ($campaign->status !== 'scheduled') {
            return back()->with('error', 'Only scheduled campaigns can be cancelled.');
        }

        $campaign->update(['status' => 'cancelled']);

        return back()->with('success', 'Campaign cancelled successfully!');
    }
}
