<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CampaignRecipient extends Model
{
    protected $fillable = [
        'campaign_id',
        'recipient_id',
        'sent_at',
        'opened_at',
        'clicked_at',
        'status',
        'error_message',
        'tracking_token',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'opened_at' => 'datetime',
        'clicked_at' => 'datetime',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(Recipient::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(FormSubmission::class);
    }

    // Check if email was sent
    public function isSent(): bool
    {
        return $this->status === 'sent';
    }

    // Check if email was opened
    public function wasOpened(): bool
    {
        return ! is_null($this->opened_at);
    }

    // Check if email was clicked
    public function wasClicked(): bool
    {
        return ! is_null($this->clicked_at);
    }
}
