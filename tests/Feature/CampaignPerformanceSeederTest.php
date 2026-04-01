<?php

use App\Models\CampaignRecipient;
use App\Models\FormSubmission;
use Database\Seeders\CampaignPerformanceSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('seeds campaign performance metrics for dashboard', function () {
    $this->seed(CampaignPerformanceSeeder::class);

    expect(CampaignRecipient::where('status', 'sent')->count())->toBeGreaterThan(0)
        ->and(CampaignRecipient::whereNotNull('opened_at')->count())->toBeGreaterThan(0)
        ->and(CampaignRecipient::whereNotNull('clicked_at')->count())->toBeGreaterThan(0)
        ->and(FormSubmission::count())->toBeGreaterThan(0);

    $clickedWithoutOpen = CampaignRecipient::query()
        ->whereNotNull('clicked_at')
        ->whereNull('opened_at')
        ->count();

    expect($clickedWithoutOpen)->toBe(0);
});
