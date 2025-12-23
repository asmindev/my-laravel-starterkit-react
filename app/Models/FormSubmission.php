<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class FormSubmission extends Model
{
    protected $fillable = [
        'campaign_recipient_id',
        'form_template_id',
        'submitted_data',
        'ip_address',
        'user_agent',
        'referer',
        'is_aware',
        'awareness_acknowledged_at',
    ];

    protected $casts = [
        'is_aware' => 'boolean',
        'awareness_acknowledged_at' => 'datetime',
    ];

    public function campaignRecipient(): BelongsTo
    {
        return $this->belongsTo(CampaignRecipient::class);
    }

    public function formTemplate(): BelongsTo
    {
        return $this->belongsTo(FormTemplate::class);
    }

    /**
     * Encrypt and decrypt submitted data automatically
     */
    protected function submittedData(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? json_decode(Crypt::decryptString($value), true) : [],
            set: fn ($value) => Crypt::encryptString(json_encode($value)),
        );
    }

    /**
     * Mark user as aware of the phishing simulation
     */
    public function markAsAware(): void
    {
        $this->update([
            'is_aware' => true,
            'awareness_acknowledged_at' => now(),
        ]);
    }
}
