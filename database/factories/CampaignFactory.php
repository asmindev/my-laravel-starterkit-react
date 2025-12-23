<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Campaign>
 */
class CampaignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'template_id' => \App\Models\EmailTemplate::factory(),
            'form_template_id' => null,
            'redirect_url' => null,
            'track_open' => true,
            'track_click' => true,
            'status' => 'draft',
            'scheduled_at' => null,
            'sent_at' => null,
        ];
    }
}
