<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class FormTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'html_content',
        'target_url',
        'capture_route',
        'metadata',
        'is_active',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_active' => 'boolean',
    ];

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(FormSubmission::class);
    }

    /**
     * Process HTML content and replace form actions
     */
    public function getProcessedHtmlAttribute(): string
    {
        $html = $this->html_content;

        // Add base tag for external assets if target_url exists
        if ($this->target_url) {
            $baseTag = '<base href="' . $this->target_url . '" target="_blank">';
            $html = preg_replace('/(<head[^>]*>)/i', '$1' . $baseTag, $html);
        }

        // Get tracking token from session (set by controller)
        $trackingToken = session('tracking_token', '');

        // Replace form action with our capture route
        $captureUrl = route('public.capture-submission', ['template' => $this->id]);
        $html = preg_replace(
            '/<form([^>]*?)action=["\']([^"\']*)["\']([^>]*?)>/i',
            '<form$1action="' . $captureUrl . '"$3 method="POST">',
            $html
        );

        // Also handle forms without action attribute
        $html = preg_replace(
            '/<form(?![^>]*action=)([^>]*?)>/i',
            '<form$1 action="' . $captureUrl . '" method="POST">',
            $html
        );

        // Add hidden tracking token field
        $tokenField = '<input type="hidden" name="_tracking_token" value="' . $trackingToken . '">';
        $html = preg_replace('/(<form[^>]*>)/i', '$1' . $tokenField, $html);

        // Add warning banner at the top
        $warningBanner = $this->getWarningBanner();
        $html = preg_replace('/(<body[^>]*>)/i', '$1' . $warningBanner, $html);

        return $html;
    }

    /**
     * Get warning banner HTML (for educational purposes)
     */
    protected function getWarningBanner(): string
    {
        return '
        <div style="position: fixed; top: 0; left: 0; right: 0; background: #fff3cd; border-bottom: 2px solid #ffc107; padding: 10px; text-align: center; z-index: 9999; font-family: Arial, sans-serif;">
            <strong>⚠️ SIMULASI EDUKASI PHISHING</strong> - Ini adalah halaman simulasi untuk tujuan edukasi keamanan.
        </div>
        <div style="height: 50px;"></div>
        ';
    }

    /**
     * Generate unique tracking link for campaign recipient
     */
    public function generateTrackingLink(CampaignRecipient $recipient): string
    {
        $token = Str::random(32);

        // Store token in campaign_recipients table
        $recipient->update(['tracking_token' => $token]);

        return route('public.phishing-page', [
            'template' => $this->id,
            'token' => $token,
        ]);
    }
}
