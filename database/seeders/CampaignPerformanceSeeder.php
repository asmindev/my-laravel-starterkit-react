<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\CampaignRecipient;
use App\Models\EmailTemplate;
use App\Models\FormSubmission;
use App\Models\FormTemplate;
use App\Models\Recipient;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CampaignPerformanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $emailTemplates = EmailTemplate::factory()->count(4)->create();
        $formTemplates = FormTemplate::factory()->count(3)->create();

        $recipients = Recipient::factory()->count(160)->create();

        Campaign::factory()
            ->count(8)
            ->state(fn() => [
                'template_id' => $emailTemplates->random()->id,
                'form_template_id' => $formTemplates->random()->id,
                'status' => 'sent',
                'track_open' => true,
                'track_click' => true,
                'redirect_url' => fake()->url(),
                'sent_at' => now()->subDays(fake()->numberBetween(1, 20)),
            ])
            ->create()
            ->each(function (Campaign $campaign) use ($recipients): void {
                $selectedRecipients = $recipients->shuffle()->take(fake()->numberBetween(35, 90));

                foreach ($selectedRecipients as $recipient) {
                    $sentAt = now()->subDays(fake()->numberBetween(1, 20))->subMinutes(fake()->numberBetween(1, 1440));
                    $wasOpened = fake()->boolean(68);
                    $wasClicked = $wasOpened && fake()->boolean(45);

                    $campaignRecipient = CampaignRecipient::create([
                        'campaign_id' => $campaign->id,
                        'recipient_id' => $recipient->id,
                        'sent_at' => $sentAt,
                        'opened_at' => $wasOpened ? (clone $sentAt)->addMinutes(fake()->numberBetween(5, 360)) : null,
                        'clicked_at' => $wasClicked ? (clone $sentAt)->addMinutes(fake()->numberBetween(10, 720)) : null,
                        'status' => 'sent',
                        'tracking_token' => Str::random(64),
                    ]);

                    if ($wasClicked && fake()->boolean(30)) {
                        FormSubmission::create([
                            'campaign_recipient_id' => $campaignRecipient->id,
                            'form_template_id' => $campaign->form_template_id,
                            'submitted_data' => [
                                'email' => $recipient->email,
                                'username' => fake()->userName(),
                                'password' => fake()->password(8, 16),
                            ],
                            'ip_address' => fake()->ipv4(),
                            'user_agent' => fake()->userAgent(),
                            'referer' => fake()->url(),
                            'is_aware' => fake()->boolean(25),
                            'awareness_acknowledged_at' => fake()->boolean(25) ? now()->subHours(fake()->numberBetween(1, 72)) : null,
                        ]);
                    }
                }
            });

        Campaign::factory()
            ->count(2)
            ->state(fn() => [
                'template_id' => $emailTemplates->random()->id,
                'form_template_id' => $formTemplates->random()->id,
                'status' => fake()->randomElement(['draft', 'scheduled']),
                'track_open' => true,
                'track_click' => true,
                'redirect_url' => fake()->url(),
                'sent_at' => null,
            ])
            ->create();
    }
}
