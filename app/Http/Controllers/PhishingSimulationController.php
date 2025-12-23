<?php

namespace App\Http\Controllers;

use App\Models\CampaignRecipient;
use App\Models\FormSubmission;
use App\Models\FormTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PhishingSimulationController extends Controller
{
    /**
     * Display the phishing simulation page (render HTML template)
     */
    public function show(Request $request, FormTemplate $template, string $token)
    {
        // Find campaign recipient by tracking token
        $recipient = CampaignRecipient::where('tracking_token', $token)->firstOrFail();

        // Track that link was clicked
        if (! $recipient->clicked_at) {
            $recipient->update(['clicked_at' => now()]);
        }

        // Store tracking token in session for form submission
        session(['tracking_token' => $token]);

        // Return raw HTML with processed form action
        return response($template->processed_html)
            ->header('Content-Type', 'text/html')
            ->header('X-Frame-Options', 'DENY')
            ->header('X-Content-Type-Options', 'nosniff');
    }

    /**
     * Capture form submission data
     */
    public function captureSubmission(Request $request, FormTemplate $template)
    {
        try {
            // Get token from referer or session
            $token = $request->input('_tracking_token') ??
                session('tracking_token') ??
                $this->extractTokenFromReferer($request);

            if (! $token) {
                Log::warning('Form submission without tracking token', [
                    'template_id' => $template->id,
                    'ip' => $request->ip(),
                ]);

                return $this->showAwarenessPage(null, 'unknown');
            }

            $recipient = CampaignRecipient::where('tracking_token', $token)->first();

            if (! $recipient) {
                Log::warning('Invalid tracking token', ['token' => $token]);

                return $this->showAwarenessPage(null, 'unknown');
            }

            // Prepare submitted data (remove sensitive Laravel tokens)
            $submittedData = $request->except(['_token', '_method', '_tracking_token']);

            // Create submission record with encrypted data
            $submission = FormSubmission::create([
                'campaign_recipient_id' => $recipient->id,
                'form_template_id' => $template->id,
                'submitted_data' => $submittedData,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'referer' => $request->header('referer'),
            ]);

            Log::info('Form submission captured', [
                'submission_id' => $submission->id,
                'recipient_id' => $recipient->id,
                'template_id' => $template->id,
            ]);

            // Redirect to awareness/educational page
            return $this->showAwarenessPage($submission, $recipient->recipient->email);
        } catch (\Exception $e) {
            Log::error('Error capturing form submission', [
                'error' => $e->getMessage(),
                'template_id' => $template->id,
            ]);

            return $this->showAwarenessPage(null, 'error');
        }
    }

    /**
     * Show educational awareness page after submission
     */
    protected function showAwarenessPage(?FormSubmission $submission, string $identifier)
    {
        return response()->view('phishing.awareness', [
            'submission' => $submission,
            'identifier' => $identifier,
        ])->header('X-Frame-Options', 'DENY');
    }

    /**
     * Extract tracking token from referer URL
     */
    protected function extractTokenFromReferer(Request $request): ?string
    {
        $referer = $request->header('referer');
        if (! $referer) {
            return null;
        }

        // Extract token from URL like: /phishing/template/1/abc123token
        if (preg_match('/\/phishing\/template\/\d+\/([a-zA-Z0-9]+)/', $referer, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Mark user as aware (acknowledge they learned from the simulation)
     */
    public function acknowledgeAwareness(Request $request, FormSubmission $submission)
    {
        $submission->markAsAware();

        return response()->json([
            'success' => true,
            'message' => 'Terima kasih telah memahami risiko phishing!',
        ]);
    }
}
