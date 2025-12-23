<?php

namespace App\Mail;

use App\Models\Campaign;
use App\Models\CampaignRecipient;
use App\Models\Recipient;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CampaignEmail extends Mailable
{
    use Queueable; // ✅ Keep Queueable, but REMOVE SerializesModels

    public Campaign $campaign;

    public Recipient $recipient;

    public ?CampaignRecipient $campaignRecipient;

    public string $trackingPixel = '';

    public string $processedHtml = '';

    /**
     * Create a new message instance.
     */
    public function __construct(Campaign $campaign, Recipient $recipient, ?CampaignRecipient $campaignRecipient = null)
    {
        $this->campaign = $campaign;
        $this->recipient = $recipient;
        $this->campaignRecipient = $campaignRecipient;

        // Generate tracking pixel URL if tracking is enabled
        if ($campaign->track_open) {
            $this->trackingPixel = route('campaigns.track-open', [
                'campaign' => $campaign->id,
                'recipient' => $recipient->id,
                't' => time(), // Add timestamp to bypass cache
            ]);
        }

        // Process HTML body for click tracking
        $this->processedHtml = $this->processHtmlForTracking();
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject($this->campaign->template->subject)
            ->html($this->processedHtml);
    }

    /**
     * Process HTML body for click tracking
     */
    private function processHtmlForTracking(): string
    {
        $html = $this->campaign->template->html_body;

        // Validate we have required data for tracking URL
        if (! $this->recipient || ! $this->recipient->id) {
            \Log::error('Recipient missing in CampaignEmail', [
                'campaign_id' => $this->campaign->id ?? null,
                'recipient' => $this->recipient ?? null,
            ]);

            return $html; // Return HTML without tracking if recipient is invalid
        }

        // Debug logging before route generation
        \Log::info('Generating tracking URL', [
            'campaign_id' => $this->campaign->id,
            'campaign_type' => get_class($this->campaign),
            'recipient_id' => $this->recipient->id,
            'recipient_type' => get_class($this->recipient),
            'recipient_exists' => $this->recipient->exists,
        ]);

        try {
            // Generate tracking click URL using direct URL (bypass route model binding)
            $trackingUrl = url("track/click/{$this->campaign->id}/{$this->recipient->id}");

            \Log::info('Tracking URL generated successfully', ['url' => $trackingUrl]);
        } catch (\Exception $e) {
            \Log::error('Failed to generate tracking URL', [
                'error' => $e->getMessage(),
                'campaign_id' => $this->campaign->id,
                'recipient_id' => $this->recipient->id,
            ]);

            return $html; // Return without tracking on error
        }

        // Replace placeholders with tracking URL
        $html = str_replace(['{{PHISHING_LINK}}', '{{LINK}}', '{{URL}}'], $trackingUrl, $html);

        // If no placeholder found and form template is set, auto-inject button
        if (
            $this->campaign->formTemplate &&
            ! str_contains($this->campaign->template->html_body, '{{PHISHING_LINK}}') &&
            ! str_contains($this->campaign->template->html_body, '{{LINK}}') &&
            ! str_contains($this->campaign->template->html_body, '{{URL}}')
        ) {
            $html .= '<div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">'
                . '<p style="margin: 0 0 15px; font-size: 16px; color: #333;">Klik tombol di bawah untuk melanjutkan:</p>'
                . '<a href="' . $trackingUrl . '" style="display: inline-block; padding: 12px 30px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Klik Di Sini</a>'
                . '</div>';
        }

        // Add tracking pixel if enabled
        if ($this->campaign->track_open && $this->trackingPixel) {
            // 1. Standard 1x1 pixel (removed display:none to ensure loading)
            $html .= '<img src="' . $this->trackingPixel . '" width="1" height="1" alt="" />';

            // 2. Visible debug pixel (Always shown for debugging)
            $html .= '<div style="margin-top:20px; padding:10px; border:1px dashed #ccc; background:#f9f9f9;">'
                . '<p style="margin:0 0 5px; color:#666; font-size:12px;">Debug: Tracking Pixel (Visible)</p>'
                . '<img src="' . $this->trackingPixel . '" alt="Tracking Pixel" '
                . 'style="border:2px solid red; width:50px; height:50px; display:block;" />'
                . '</div>';
        }

        // Replace ALL <a> links with tracking URLs if enabled
        if ($this->campaign->track_click) {
            $html = preg_replace_callback(
                '/<a\s+(?:[^>]*?\s+)?href=(["\'])(.*?)\1/i',
                function ($matches) use ($trackingUrl) {
                    $originalUrl = $matches[2];

                    // Skip if already a tracking URL or placeholder
                    if (
                        str_starts_with($originalUrl, url('track/click')) ||
                        str_contains($originalUrl, '{{')
                    ) {
                        return '<a href="' . $originalUrl . '"';
                    }

                    return '<a href="' . $trackingUrl . '"';
                },
                $html
            );
        }

        // Wrap in proper HTML structure if not already
        if (stripos($html, '<!DOCTYPE') === false && stripos($html, '<html') === false) {
            $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
' . $html . '
</body>
</html>';
        }

        return $html;
    }
}
