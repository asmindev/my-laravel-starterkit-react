<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'template_id',
        'form_template_id',
        'track_open',
        'track_click',
        'redirect_url',
        'status',
        'scheduled_at',
        'sent_at',
    ];

    protected $casts = [
        'track_open' => 'boolean',
        'track_click' => 'boolean',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(EmailTemplate::class, 'template_id');
    }

    public function formTemplate(): BelongsTo
    {
        return $this->belongsTo(FormTemplate::class, 'form_template_id');
    }

    public function recipients(): BelongsToMany
    {
        return $this->belongsToMany(Recipient::class, 'campaign_recipients')
            ->withPivot(['sent_at', 'opened_at', 'clicked_at', 'status', 'error_message'])
            ->withTimestamps();
    }

    public function campaignRecipients(): HasMany
    {
        return $this->hasMany(CampaignRecipient::class);
    }

    // Scope for filtering campaigns
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // Check if campaign can be sent
    public function canBeSent(): bool
    {
        return in_array($this->status, ['draft', 'scheduled']);
    }

    // Check if campaign is completed
    public function isCompleted(): bool
    {
        return $this->status === 'sent';
    }
}
