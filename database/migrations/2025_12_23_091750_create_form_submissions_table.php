<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('form_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_recipient_id')->constrained()->onDelete('cascade');
            $table->foreignId('form_template_id')->constrained()->onDelete('cascade');
            $table->text('submitted_data'); // Encrypted JSON data
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('referer')->nullable();
            $table->boolean('is_aware')->default(false); // Did they realize it's phishing?
            $table->timestamp('awareness_acknowledged_at')->nullable();
            $table->timestamps();

            $table->index(['campaign_recipient_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_submissions');
    }
};
