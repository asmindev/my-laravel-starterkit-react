<?php

namespace App\Jobs;

use App\Mail\CampaignEmail;
use App\Models\Campaign;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendCampaignJob implements ShouldQueue
{
    use Queueable;

    public Campaign $campaign;

    /**
     * The number of times the job may be attempted.
     */
    public $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public $backoff = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(Campaign $campaign)
    {
        $this->campaign = $campaign;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Load campaign with template and form template
        $this->campaign->load(['template', 'formTemplate']);

        // Get all recipients for this campaign
        $campaignRecipients = $this->campaign->campaignRecipients()
            ->with('recipient')
            ->whereNull('sent_at')
            ->get();

        foreach ($campaignRecipients as $campaignRecipient) {
            $recipient = $campaignRecipient->recipient;

            // Generate tracking token if not exists (for phishing form tracking)
            if (! $campaignRecipient->tracking_token) {
                $campaignRecipient->update([
                    'tracking_token' => \Str::random(32),
                ]);
                $campaignRecipient->refresh();
            }

            // Skip if recipient unsubscribed
            if (! $recipient->is_subscribed) {
                continue;
            }

            try {
                // Send email with campaign recipient (includes tracking token)
                Mail::to($recipient->email)->send(
                    new CampaignEmail($this->campaign, $recipient, $campaignRecipient)
                );

                // Update sent_at timestamp
                $campaignRecipient->update([
                    'sent_at' => now(),
                ]);
            } catch (\Exception $e) {
                // Log error but continue with other recipients
                \Log::error('Failed to send campaign email', [
                    'campaign_id' => $this->campaign->id,
                    'recipient_id' => $recipient->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}
