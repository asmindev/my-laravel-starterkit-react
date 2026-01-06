<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\CampaignRecipient;
use App\Models\EmailTemplate;
use App\Models\FormSubmission;
use App\Models\Recipient;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get basic counts
        $stats = [
            'total_recipients' => Recipient::count(),
            'subscribed_recipients' => Recipient::where('is_subscribed', true)->count(),
            'email_templates' => EmailTemplate::count(),
            'total_campaigns' => Campaign::count(),
            'active_campaigns' => Campaign::whereIn('status', ['draft', 'scheduled', 'sending'])->count(),
            'sent_campaigns' => Campaign::where('status', 'sent')->count(),
        ];

        // Campaign statistics
        $campaignStats = [
            'total_sent' => CampaignRecipient::where('status', 'sent')->count(),
            'total_clicked' => CampaignRecipient::whereNotNull('clicked_at')->count(),
            'total_captured' => FormSubmission::count(),
        ];

        // Calculate rates
        $campaignStats['click_rate'] = $campaignStats['total_sent'] > 0
            ? round(($campaignStats['total_clicked'] / $campaignStats['total_sent']) * 100, 2)
            : 0;
        $campaignStats['capture_rate'] = $campaignStats['total_sent'] > 0
            ? round(($campaignStats['total_captured'] / $campaignStats['total_sent']) * 100, 2)
            : 0;

        // Recent campaigns
        $recentCampaigns = Campaign::with('template')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($campaign) {
                return [
                    'id' => $campaign->id,
                    'name' => $campaign->name,
                    'status' => $campaign->status,
                    'template_name' => $campaign->template->name ?? 'N/A',
                    'created_at' => $campaign->created_at,
                    'scheduled_at' => $campaign->scheduled_at,
                    'sent_at' => $campaign->sent_at,
                ];
            });

        // Top performing campaigns (by click rate)
        $topCampaigns = Campaign::with(['template', 'campaignRecipients'])
            ->where('status', 'sent')
            ->get()
            ->map(function ($campaign) {
                $sent = $campaign->campaignRecipients->where('status', 'sent')->count();
                $clicked = $campaign->campaignRecipients->whereNotNull('clicked_at')->count();
                $captured = $campaign->campaignRecipients->sum(fn($cr) => $cr->submissions->count());

                return [
                    'id' => $campaign->id,
                    'name' => $campaign->name,
                    'template_name' => $campaign->template->name ?? 'N/A',
                    'sent_count' => $sent,
                    'clicked_count' => $clicked,
                    'captured_count' => $captured,
                    'click_rate' => $sent > 0 ? round(($clicked / $sent) * 100, 2) : 0,
                    'capture_rate' => $sent > 0 ? round(($captured / $sent) * 100, 2) : 0,
                ];
            })
            ->sortByDesc('click_rate')
            ->take(5)
            ->values();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'campaignStats' => $campaignStats,
            'recentCampaigns' => $recentCampaigns,
            'topCampaigns' => $topCampaigns,
        ]);
    }
}
