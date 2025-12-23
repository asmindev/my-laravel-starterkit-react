<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Recipient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CampaignTrackingController extends Controller
{
    /**
     * Track email open via 1x1 pixel
     */
    public function trackOpen(Campaign $campaign, Recipient $recipient)
    {
        // Find campaign recipient record
        $campaignRecipient = $campaign->campaignRecipients()
            ->where('recipient_id', $recipient->id)
            ->first();

        if ($campaignRecipient && ! $campaignRecipient->opened_at) {
            $campaignRecipient->update([
                'opened_at' => now(),
            ]);
        } else {
            Log::info('Track open hit', [
                'campaign_id' => $campaign->id,
                'recipient_id' => $recipient->id,
                'already_opened' => $campaignRecipient?->opened_at,
            ]);
        }

        // Return 1x1 transparent pixel
        // return response()->file(public_path('pixel.gif'), [
        //     'Content-Type' => 'image/gif',
        //     'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
        // ]);
        $pixel = base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');

        return response($pixel)
            ->header('Content-Type', 'image/gif')
            ->header('Content-Length', strlen($pixel))
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0')
            ->header('ngrok-skip-browser-warning', 'true'); // Penting untuk Ngrok
    }

    /**
     * Track link click and redirect
     * - If campaign has form template: redirect to phishing form
     * - Otherwise: redirect to campaign redirect_url
     */
    public function trackClick(Request $request, Campaign $campaign, Recipient $recipient)
    {
        Log::info('Track click hit', [
            'campaign_id' => $campaign->id,
            'recipient_id' => $recipient->id,
            'has_form_template' => ! is_null($campaign->form_template_id),
        ]);

        // Find campaign recipient record
        $campaignRecipient = $campaign->campaignRecipients()
            ->where('recipient_id', $recipient->id)
            ->first();

        if (! $campaignRecipient) {
            Log::warning('Campaign recipient not found', [
                'campaign_id' => $campaign->id,
                'recipient_id' => $recipient->id,
            ]);

            return response('Invalid tracking link', 404);
        }

        // Track click (only once)
        if (! $campaignRecipient->clicked_at) {
            $campaignRecipient->update([
                'clicked_at' => now(),
            ]);
        }

        // PRIORITY 1: If campaign has form template, redirect to phishing form
        if ($campaign->form_template_id && $campaignRecipient->tracking_token) {
            $phishingUrl = route('public.phishing-page', [
                'template' => $campaign->form_template_id,
                'token' => $campaignRecipient->tracking_token,
            ]);

            Log::info('Redirecting to phishing form', [
                'url' => $phishingUrl,
            ]);

            return redirect($phishingUrl);
        }

        // PRIORITY 2: Use campaign redirect_url as fallback
        if ($campaign->redirect_url) {
            Log::info('Redirecting to campaign URL', [
                'url' => $campaign->redirect_url,
            ]);

            return redirect()->away($campaign->redirect_url);
        }

        // PRIORITY 3: No redirect configured
        abort(404, 'No destination configured for this campaign.');
    }
}
