<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Website Crawler & Audit Tool (Client Hunting Weapon)
        Schema::create('website_audits', function (Blueprint $table) {
            $table->id();
            $table->string('url');
            $table->string('domain');
            $table->string('company_name')->nullable();
            $table->string('status')->default('completed'); // pending, scanning, completed, failed
            $table->string('title')->nullable();
            $table->text('meta_description')->nullable();
            $table->json('services')->nullable();       // Extracted business services
            $table->json('contact_info')->nullable();   // Emails, phones, address, social links
            $table->json('tech_stack')->nullable();     // CMS, analytics, pixel detection
            $table->json('missing_tools')->nullable();  // Missing pixels, booking widgets, forms
            $table->integer('audit_score')->default(65);// Health / Lead readiness score
            $table->text('audit_summary')->nullable();
            $table->text('generated_pitch')->nullable();// AI/Custom tailored cold outreach pitch
            $table->foreignId('converted_contact_id')->nullable()->constrained('contacts')->nullOnDelete();
            $table->timestamps();
        });

        // Integration Settings (Twilio, SendGrid/Resend, Stripe, OpenAI, Calendly)
        Schema::create('integration_settings', function (Blueprint $table) {
            $table->id();
            $table->string('provider')->unique(); // twilio, resend, stripe, openai, calendly
            $table->string('name');
            $table->string('category')->default('marketing'); // marketing, sms, payment, ai, calendar
            $table->boolean('is_active')->default(false);
            $table->boolean('is_sandbox')->default(true);
            $table->json('credentials')->nullable(); // encrypted/hidden API keys
            $table->string('webhook_secret')->nullable();
            $table->timestamp('last_tested_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('integration_settings');
        Schema::dropIfExists('website_audits');
    }
};
