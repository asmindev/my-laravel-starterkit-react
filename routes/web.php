<?php

use App\Http\Controllers\Admin\FormTemplateController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\CampaignTrackingController;
use App\Http\Controllers\EmailTemplateController;
use App\Http\Controllers\PhishingSimulationController;
use App\Http\Controllers\RecipientController;
use App\Http\Controllers\RecipientImportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dashboard');
})->name('home');

// Recipients
Route::resource('recipients', RecipientController::class)->except(['create', 'show', 'edit']);
Route::post('recipients/import', [RecipientImportController::class, 'import'])->name('recipients.import');

// Email Templates
Route::resource('email-templates', EmailTemplateController::class)->except(['create', 'show', 'edit']);
Route::post('email-templates/{emailTemplate}/send-test', [EmailTemplateController::class, 'sendTest'])->name('email-templates.send-test');

// Campaigns
Route::resource('campaigns', CampaignController::class)->except(['edit']);
Route::get('campaigns/{campaign}/edit', [CampaignController::class, 'edit'])->name('campaigns.edit');
Route::post('campaigns/{campaign}/send', [CampaignController::class, 'send'])->name('campaigns.send');
Route::post('campaigns/{campaign}/cancel', [CampaignController::class, 'cancel'])->name('campaigns.cancel');

// Campaign Tracking (no auth/middleware - for email tracking)
Route::get('track/open/{campaign}/{recipient}', [CampaignTrackingController::class, 'trackOpen'])->name('campaigns.track-open');
Route::get('track/click/{campaign}/{recipient}', [CampaignTrackingController::class, 'trackClick'])->name('campaigns.track-click');

// Form Templates Management (Admin)
Route::resource('form-templates', FormTemplateController::class)->except(['create', 'edit']);
Route::get('form-templates/{formTemplate}/preview', [FormTemplateController::class, 'preview'])->name('form-templates.preview');
Route::post('form-templates/{formTemplate}/toggle-status', [FormTemplateController::class, 'toggleStatus'])->name('form-templates.toggle-status');
Route::post('form-templates/{formTemplate}/duplicate', [FormTemplateController::class, 'duplicate'])->name('form-templates.duplicate');

// Public Phishing Simulation Routes (no auth - accessible by email recipients)
Route::prefix('phishing')->name('public.')->group(function () {
    Route::get('template/{template}/{token}', [PhishingSimulationController::class, 'show'])
        ->name('phishing-page');
    Route::post('capture/{template}', [PhishingSimulationController::class, 'captureSubmission'])
        ->name('capture-submission');
    Route::post('acknowledge/{submission}', [PhishingSimulationController::class, 'acknowledgeAwareness'])
        ->name('acknowledge-awareness');
});
