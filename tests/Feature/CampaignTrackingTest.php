<?php

use App\Models\Campaign;
use App\Models\EmailTemplate;
use App\Models\FormTemplate;
use App\Models\Recipient;

beforeEach(function () {
    $this->emailTemplate = EmailTemplate::factory()->create([
        'subject' => 'Test Email',
        'html_body' => '<p>Click <a href="{{PHISHING_LINK}}">here</a></p>',
    ]);
});

test('tracks click and redirects to phishing form when form template exists', function () {
    // Arrange: Campaign WITH form template
    $formTemplate = FormTemplate::factory()->create(['is_active' => true]);
    $campaign = Campaign::factory()->create([
        'template_id' => $this->emailTemplate->id,
        'form_template_id' => $formTemplate->id,
        'redirect_url' => null,
        'track_click' => true,
    ]);
    $recipient = Recipient::factory()->create();

    // Attach recipient with tracking token
    $campaign->recipients()->attach($recipient->id, [
        'tracking_token' => 'test-token-123',
    ]);

    // Act: Click tracking link
    $response = $this->get(route('campaigns.track-click', [
        'campaign' => $campaign->id,
        'recipient' => $recipient->id,
    ]));

    // Assert: Redirects to phishing form
    $response->assertRedirect(route('public.phishing-page', [
        'template' => $formTemplate->id,
        'token' => 'test-token-123',
    ]));

    // Assert: Click tracked
    $this->assertDatabaseHas('campaign_recipients', [
        'campaign_id' => $campaign->id,
        'recipient_id' => $recipient->id,
    ]);
    $this->assertNotNull($campaign->recipients()->first()->pivot->clicked_at);
});

test('tracks click and redirects to custom URL when no form template but redirect_url exists', function () {
    // Arrange: Campaign WITHOUT form template, WITH redirect_url
    $campaign = Campaign::factory()->create([
        'template_id' => $this->emailTemplate->id,
        'form_template_id' => null,
        'redirect_url' => 'https://example.com/landing',
        'track_click' => true,
    ]);
    $recipient = Recipient::factory()->create();

    $campaign->recipients()->attach($recipient->id, [
        'tracking_token' => 'test-token-456',
    ]);

    // Act: Click tracking link
    $response = $this->get(route('campaigns.track-click', [
        'campaign' => $campaign->id,
        'recipient' => $recipient->id,
    ]));

    // Assert: Redirects to custom URL
    $response->assertRedirect('https://example.com/landing');

    // Assert: Click tracked
    $this->assertNotNull($campaign->recipients()->first()->pivot->clicked_at);
});

test('tracks click and shows 404 when no form template and no redirect_url', function () {
    // Arrange: Campaign WITHOUT form template AND redirect_url
    $campaign = Campaign::factory()->create([
        'template_id' => $this->emailTemplate->id,
        'form_template_id' => null,
        'redirect_url' => null,
        'track_click' => true,
    ]);
    $recipient = Recipient::factory()->create();

    $campaign->recipients()->attach($recipient->id, [
        'tracking_token' => 'test-token-789',
    ]);

    // Act: Click tracking link
    $response = $this->get(route('campaigns.track-click', [
        'campaign' => $campaign->id,
        'recipient' => $recipient->id,
    ]));

    // Assert: 404 error
    $response->assertNotFound();

    // Assert: Click still tracked (even though destination is invalid)
    $this->assertNotNull($campaign->recipients()->first()->pivot->clicked_at);
});

test('prioritizes form template over redirect_url when both exist', function () {
    // Arrange: Campaign WITH BOTH form template AND redirect_url
    $formTemplate = FormTemplate::factory()->create(['is_active' => true]);
    $campaign = Campaign::factory()->create([
        'template_id' => $this->emailTemplate->id,
        'form_template_id' => $formTemplate->id,
        'redirect_url' => 'https://example.com/fallback',
        'track_click' => true,
    ]);
    $recipient = Recipient::factory()->create();

    $campaign->recipients()->attach($recipient->id, [
        'tracking_token' => 'test-token-999',
    ]);

    // Act: Click tracking link
    $response = $this->get(route('campaigns.track-click', [
        'campaign' => $campaign->id,
        'recipient' => $recipient->id,
    ]));

    // Assert: Prioritizes form template (not redirect_url)
    $response->assertRedirect(route('public.phishing-page', [
        'template' => $formTemplate->id,
        'token' => 'test-token-999',
    ]));
});

test('fails when recipient is not part of campaign', function () {
    // Arrange: Campaign + unrelated recipient
    $campaign = Campaign::factory()->create([
        'template_id' => $this->emailTemplate->id,
        'form_template_id' => null,
        'redirect_url' => 'https://example.com',
    ]);
    $recipient = Recipient::factory()->create();
    // DO NOT attach recipient

    // Act & Assert: Should fail with 404
    $response = $this->get(route('campaigns.track-click', [
        'campaign' => $campaign->id,
        'recipient' => $recipient->id,
    ]));

    $response->assertNotFound();
});
