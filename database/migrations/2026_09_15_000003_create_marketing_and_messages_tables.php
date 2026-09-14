<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Broadcast Campaigns
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('email'); // email, sms
            $table->string('status')->default('draft'); // draft, scheduled, running, completed, cancelled
            $table->string('subject')->nullable();
            $table->text('content');
            $table->json('recipient_filter')->nullable();
            $table->integer('total_recipients')->default(0);
            $table->integer('sent_count')->default(0);
            $table->integer('delivered_count')->default(0);
            $table->integer('opened_count')->default(0);
            $table->integer('clicked_count')->default(0);
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamps();
        });

        // Unified 2-Way Inbox Messages
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained('contacts')->cascadeOnDelete();
            $table->string('type')->default('email'); // email, sms, internal_note, webchat
            $table->string('direction')->default('outbound'); // outbound, inbound
            $table->string('sender')->nullable();
            $table->string('recipient')->nullable();
            $table->string('subject')->nullable();
            $table->text('body');
            $table->string('status')->default('sent'); // queued, sent, delivered, read, failed
            $table->string('provider_message_id')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('campaigns');
    }
};
