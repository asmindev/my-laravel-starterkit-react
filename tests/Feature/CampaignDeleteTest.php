<?php

use App\Models\Campaign;
use App\Models\EmailTemplate;
use App\Models\User;

it('allows deleting campaigns in any status', function (string $status) {
    $user = User::factory()->create();
    $template = EmailTemplate::factory()->create();
    $campaign = Campaign::factory()->create([
        'template_id' => $template->id,
        'status' => $status,
    ]);

    $response = $this->actingAs($user)->delete(route('campaigns.destroy', $campaign));

    $response->assertRedirect(route('campaigns.index'));
    $response->assertSessionHas('success', 'Campaign deleted successfully!');

    $this->assertDatabaseMissing('campaigns', [
        'id' => $campaign->id,
    ]);
})->with([
    'draft' => 'draft',
    'scheduled' => 'scheduled',
    'sending' => 'sending',
    'sent' => 'sent',
    'cancelled' => 'cancelled',
]);
