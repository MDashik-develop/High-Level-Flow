<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Contact;
use App\Models\ContactTag;
use App\Models\Funnel;
use App\Models\IntegrationSetting;
use App\Models\Message;
use App\Models\Opportunity;
use App\Models\Pipeline;
use App\Models\User;
use App\Models\WebsiteAudit;
use App\Models\Workflow;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin User
        $user = User::firstOrCreate(
            ['email' => 'admin@agency.io'],
            [
                'name' => 'Agency Founder',
                'password' => Hash::make('password123'),
            ]
        );

        // 2. Contact Tags
        $tagVip = ContactTag::create(['name' => 'VIP Client', 'color' => '#10b981']);
        $tagCold = ContactTag::create(['name' => 'Cold Audit Lead', 'color' => '#f59e0b']);
        $tagDental = ContactTag::create(['name' => 'Healthcare / Dental', 'color' => '#3b82f6']);
        $tagEcom = ContactTag::create(['name' => 'Shopify Brand', 'color' => '#8b5cf6']);

        // 3. Contacts
        $c1 = Contact::create([
            'first_name' => 'Marcus',
            'last_name' => 'Vance',
            'email' => 'marcus@apexsmiles.com',
            'phone' => '+1 (415) 890-1234',
            'company' => 'Apex Dental Care',
            'status' => 'hot_prospect',
            'lead_score' => 85,
            'notes' => 'Audited website. Missing instant booking system. Highly receptive to automated patient reminders.',
        ]);
        $c1->tags()->sync([$tagCold->id, $tagDental->id]);

        $c2 = Contact::create([
            'first_name' => 'Sarah',
            'last_name' => 'Jenkins',
            'email' => 'sarah@luxeinterior.co',
            'phone' => '+1 (312) 555-8822',
            'company' => 'Luxe Interior Design',
            'status' => 'customer',
            'lead_score' => 92,
            'notes' => 'Onboarding complete. Funnel live with $4.5k monthly retainer.',
        ]);
        $c2->tags()->sync([$tagVip->id]);

        $c3 = Contact::create([
            'first_name' => 'David',
            'last_name' => 'Ross',
            'email' => 'david@urbanfitgear.com',
            'phone' => '+1 (646) 300-4491',
            'company' => 'Urban Fit Gear',
            'status' => 'lead',
            'lead_score' => 60,
            'notes' => 'Website crawler detected missing abandoned-cart SMS follow-up.',
        ]);
        $c3->tags()->sync([$tagEcom->id]);

        $c4 = Contact::create([
            'first_name' => 'Elena',
            'last_name' => 'Rostova',
            'email' => 'elena@novatech-consulting.io',
            'phone' => '+1 (206) 482-9910',
            'company' => 'NovaTech Consulting',
            'status' => 'lead',
            'lead_score' => 45,
            'notes' => 'Downloaded Free Growth Blueprint.',
        ]);

        // 4. Sales Pipeline & Stages
        $pipeline = Pipeline::create([
            'name' => 'Agency Client Acquisition & Funnel Pipeline',
            'is_default' => true,
        ]);

        $stage1 = $pipeline->stages()->create(['name' => 'Audited Leads', 'position' => 1, 'color' => '#64748b']);
        $stage2 = $pipeline->stages()->create(['name' => 'Cold Pitch Sent', 'position' => 2, 'color' => '#3b82f6']);
        $stage3 = $pipeline->stages()->create(['name' => 'Discovery Call Booked', 'position' => 3, 'color' => '#f59e0b']);
        $stage4 = $pipeline->stages()->create(['name' => 'Proposal & Funnel Demo', 'position' => 4, 'color' => '#8b5cf6']);
        $stage5 = $pipeline->stages()->create(['name' => 'Closed Won (Active Retainer)', 'position' => 5, 'color' => '#10b981']);

        // Opportunities
        Opportunity::create([
            'pipeline_id' => $pipeline->id,
            'pipeline_stage_id' => $stage1->id,
            'contact_id' => $c3->id,
            'title' => 'Ecom Abandoned Cart SMS Funnel',
            'monetary_value' => 2200.00,
            'status' => 'open',
            'priority' => 'medium',
        ]);

        Opportunity::create([
            'pipeline_id' => $pipeline->id,
            'pipeline_stage_id' => $stage2->id,
            'contact_id' => $c1->id,
            'title' => 'Dental Patient Booking & SMS Automation',
            'monetary_value' => 3500.00,
            'status' => 'open',
            'priority' => 'high',
        ]);

        Opportunity::create([
            'pipeline_id' => $pipeline->id,
            'pipeline_stage_id' => $stage5->id,
            'contact_id' => $c2->id,
            'title' => 'Luxe Design Lead Funnel + HighLevel CRM',
            'monetary_value' => 4500.00,
            'status' => 'won',
            'priority' => 'high',
        ]);

        // 5. High-Converting Sales Funnel
        $funnel = Funnel::create([
            'name' => 'Local Business Client Acquisition Funnel',
            'slug' => 'local-business-acquisition',
            'description' => 'Automated funnel capturing local business leads with a free website audit offer.',
            'status' => 'active',
            'custom_domain' => 'growth.highlevelflow.io',
            'total_visitors' => 1240,
            'total_optins' => 318,
            'total_revenue' => 12500.00,
        ]);

        $funnel->steps()->createMany([
            [
                'step_number' => 1,
                'name' => 'Landing Page - Free Website & Funnel Audit',
                'step_type' => 'optin',
                'path' => '/audit-request',
                'page_elements' => [
                    'headline' => 'Double Your Local Client Consultations in 30 Days',
                    'subheadline' => 'Get a complete breakdown of why your visitors are leaving without booking.',
                    'badge' => 'Exclusive Free Agency Audit',
                    'cta' => 'Request My 5-Minute Site Audit',
                ],
                'visitors' => 1240,
                'conversions' => 318,
            ],
            [
                'step_number' => 2,
                'name' => 'Video Sales Letter (VSL) & Booking Calendar',
                'step_type' => 'sales',
                'path' => '/vsl-schedule',
                'page_elements' => [
                    'headline' => 'How We Build 24/7 Automated Lead Engines For Service Businesses',
                    'subheadline' => 'Select a time below for your 1-on-1 strategy walkthrough.',
                    'cta' => 'Confirm My Strategy Session',
                ],
                'visitors' => 318,
                'conversions' => 84,
            ],
            [
                'step_number' => 3,
                'name' => 'Retainer Contract & Deposit Checkout',
                'step_type' => 'checkout',
                'path' => '/checkout',
                'page_elements' => [
                    'headline' => 'Lock In Your Agency Growth System',
                    'subheadline' => 'Includes Funnel Setup, Twilio SMS Pipeline & Full CRM Onboarding.',
                    'price' => '$2,500 Setup + $297/mo Retainer',
                ],
                'visitors' => 84,
                'conversions' => 18,
            ],
            [
                'step_number' => 4,
                'name' => 'Onboarding Confirmation & Client Portal',
                'step_type' => 'thankyou',
                'path' => '/thank-you',
                'page_elements' => [
                    'headline' => "You're Officially In!",
                    'subheadline' => 'Check your phone for your SMS onboarding link and calendar invite.',
                ],
                'visitors' => 18,
                'conversions' => 18,
            ],
        ]);

        // 6. Automation Workflows (Graph Canvas Data)
        $wf = Workflow::create([
            'name' => 'New Lead Instant Speed-to-Lead Follow Up',
            'description' => 'Triggers instant SMS within 60 seconds, followed by email nurturing and deal creation.',
            'trigger_type' => 'form_submitted',
            'status' => 'active',
            'total_enrolled' => 318,
            'total_completed' => 294,
        ]);

        $wf->nodes()->createMany([
            [
                'node_key' => 'node_trigger',
                'node_type' => 'trigger',
                'title' => 'Trigger: Form Submitted (Free Audit)',
                'position_x' => 260,
                'position_y' => 40,
                'config' => ['form_name' => 'Free Website Audit Opt-in'],
            ],
            [
                'node_key' => 'node_sms_1',
                'node_type' => 'action_sms',
                'title' => 'Action: Instant 2-Way SMS',
                'position_x' => 260,
                'position_y' => 190,
                'config' => [
                    'body' => "Hi {{contact.first_name}}, thanks for requesting your site audit! Our system is scanning your pages right now. What's the main service you want more inquiries for?",
                ],
            ],
            [
                'node_key' => 'node_wait',
                'node_type' => 'action_wait',
                'title' => 'Delay: Wait 15 Minutes',
                'position_x' => 260,
                'position_y' => 340,
                'config' => ['duration' => '15 minutes'],
            ],
            [
                'node_key' => 'node_email_1',
                'node_type' => 'action_email',
                'title' => 'Action: Send Detailed Audit Report',
                'position_x' => 260,
                'position_y' => 490,
                'config' => [
                    'subject' => "Your Custom Website Audit & Optimization Blueprint is ready",
                    'body' => "<p>Hi {{contact.first_name}},</p><p>We analyzed your digital footprint and found 3 major leaks. Click here to book your walkthrough.</p>",
                ],
            ],
            [
                'node_key' => 'node_deal',
                'node_type' => 'action_deal_move',
                'title' => 'Action: Create Opportunity in Pipeline',
                'position_x' => 260,
                'position_y' => 640,
                'config' => ['stage' => 'Audited Leads', 'value' => 2500],
            ],
        ]);

        $wf->edges()->createMany([
            ['edge_key' => 'e1', 'source_node_key' => 'node_trigger', 'target_node_key' => 'node_sms_1'],
            ['edge_key' => 'e2', 'source_node_key' => 'node_sms_1', 'target_node_key' => 'node_wait'],
            ['edge_key' => 'e3', 'source_node_key' => 'node_wait', 'target_node_key' => 'node_email_1'],
            ['edge_key' => 'e4', 'source_node_key' => 'node_email_1', 'target_node_key' => 'node_deal'],
        ]);

        // 7. Website Audits (Sample Scraped Sites)
        WebsiteAudit::create([
            'url' => 'https://apexsmiles.com',
            'domain' => 'apexsmiles.com',
            'company_name' => 'Apex Smiles Family Dentistry',
            'status' => 'completed',
            'title' => 'Apex Dental - Compassionate Dental Care in San Francisco',
            'meta_description' => 'Comprehensive family and cosmetic dentistry in SF. Teeth whitening, implants and cleanings.',
            'services' => ['Cosmetic Dentistry', 'Dental Implants', 'Teeth Whitening', 'Invisalign Orthodontics', 'Emergency Dental Services'],
            'contact_info' => [
                'emails' => ['contact@apexsmiles.com', 'dr.vance@apexsmiles.com'],
                'phones' => ['+1 (415) 890-1234'],
                'socials' => [
                    'facebook.com' => 'https://facebook.com/apexsmiles',
                    'instagram.com' => 'https://instagram.com/apexsmiles_sf',
                ],
            ],
            'tech_stack' => [
                'CMS' => 'WordPress 6.4',
                'Analytics' => 'Google Analytics 4',
                'Booking' => 'None (Phone calls only)',
            ],
            'missing_tools' => [
                [
                    'tool' => 'Instant Online Appointment Booking Missing',
                    'impact' => 'High',
                    'description' => 'Patients cannot book appointments online after hours, losing 45% of potential night visitors.',
                ],
                [
                    'tool' => 'Speed-to-Lead SMS Automation Missing',
                    'impact' => 'High',
                    'description' => 'Inquiries submit a contact form and wait 24-48 hours for an email reply.',
                ],
                [
                    'tool' => 'Meta Retargeting Pixel Missing',
                    'impact' => 'Medium',
                    'description' => 'Site has visitors from local search but does not build a retargeting audience for cosmetic dentistry.',
                ],
            ],
            'audit_score' => 58,
            'audit_summary' => 'High potential local dental client. Excellent services and reputation, but suffers from severe lead leaks due to no instant booking or SMS responder.',
            'generated_pitch' => "Subject: Quick question about Apex Smiles's after-hours appointment requests\n\nHi Dr. Vance and Apex Smiles team,\n\nI was reviewing your website (apexsmiles.com) and loved your cosmetic dentistry portfolio.\n\nHowever, I ran a technical patient-acquisition scan and noticed two critical bottlenecks:\n1. There is no automated instant online booking widget for new patients.\n2. When patients fill out your contact form after 6 PM, they do not receive an instant SMS confirmation.\n\nOur dental clients typically recover 15-25 additional booked appointments every month simply by plugging in an automated SMS responder and live booking calendar.\n\nI put together a 3-minute video showing what this would look like for Apex Smiles. Can I send the link over?\n\nBest regards,\nAgency Specialist",
            'converted_contact_id' => $c1->id,
        ]);

        WebsiteAudit::create([
            'url' => 'https://bayarearoofpros.com',
            'domain' => 'bayarearoofpros.com',
            'company_name' => 'Bay Area Roofing Pros',
            'status' => 'completed',
            'title' => 'Commercial & Residential Roofing Contractors in Bay Area',
            'meta_description' => '25 years of licensed roofing repair, replacements and gutter installation.',
            'services' => ['Roof Leak Repairs', 'Full Roof Replacements', 'Commercial Flat Roofing', 'Free Roof Inspections'],
            'contact_info' => [
                'emails' => ['estimates@bayarearoofpros.com'],
                'phones' => ['+1 (510) 777-9090'],
                'socials' => ['facebook.com' => 'https://facebook.com/bayarearoofpros'],
            ],
            'tech_stack' => [
                'CMS' => 'Squarespace',
                'Status' => 'Active',
            ],
            'missing_tools' => [
                [
                    'tool' => 'Instant Quote Calculator Missing',
                    'impact' => 'High',
                    'description' => 'Homeowners leave the site to compare prices because they cannot get an instant estimate.',
                ],
                [
                    'tool' => 'Google Tag Manager / Meta Pixel Missing',
                    'impact' => 'High',
                    'description' => 'No tracking setup for paid ad campaigns.',
                ],
            ],
            'audit_score' => 52,
            'audit_summary' => 'Great roofing prospect for high-ticket lead generation funnels.',
            'generated_pitch' => "Subject: Free Roof Inspection Funnel idea for Bay Area Roofing Pros\n\nHi team,\n\nI noticed on bayarearoofpros.com that visitors currently have to fill out a static form with no instant estimate.\n\nWe build interactive Roof Estimate Calculators that capture verified homeowner cell phone numbers and schedule estimate visits on autopilot.\n\nWould you be open to seeing a quick demo?",
        ]);

        // 8. Integration Settings
        $providers = [
            [
                'provider' => 'twilio',
                'name' => 'Twilio SMS & Voice',
                'category' => 'sms',
                'is_active' => true,
                'is_sandbox' => true,
                'credentials' => [
                    'account_sid' => 'AC_demo_sid_sandbox_123456789',
                    'auth_token' => 'auth_token_demo_sandbox_secret',
                    'from_number' => '+18005550199',
                ],
            ],
            [
                'provider' => 'resend',
                'name' => 'Resend / SendGrid Email',
                'category' => 'marketing',
                'is_active' => true,
                'is_sandbox' => true,
                'credentials' => [
                    'api_key' => 're_demo_sandbox_key_987654321',
                    'from_email' => 'outreach@agencyflow.io',
                ],
            ],
            [
                'provider' => 'stripe',
                'name' => 'Stripe Payments & Subscriptions',
                'category' => 'payment',
                'is_active' => true,
                'is_sandbox' => true,
                'credentials' => [
                    'publishable_key' => 'pk_test_demo_sandbox_publishable',
                    'secret_key' => 'sk_test_demo_sandbox_secret',
                ],
            ],
            [
                'provider' => 'openai',
                'name' => 'OpenAI AI Copywriter & Assistant',
                'category' => 'ai',
                'is_active' => true,
                'is_sandbox' => true,
                'credentials' => [
                    'api_key' => 'sk-proj-demo_sandbox_ai_copilot_key',
                    'model' => 'gpt-4o',
                ],
            ],
        ];

        foreach ($providers as $p) {
            IntegrationSetting::create($p);
        }

        // 9. Unified Inbox Sample Messages
        Message::create([
            'contact_id' => $c1->id,
            'type' => 'email',
            'direction' => 'outbound',
            'sender' => 'alex@agency.io',
            'recipient' => $c1->email,
            'subject' => "Quick idea regarding Apex Smiles's website lead conversion",
            'body' => "Hi Dr. Vance,\n\nI ran a complimentary patient acquisition audit on apexsmiles.com and noticed you don't have an instant after-hours booking calendar.\n\nWould you be open to a 3-minute video breakdown of how we automate this?",
            'status' => 'delivered',
            'created_at' => now()->subHours(5),
        ]);

        Message::create([
            'contact_id' => $c1->id,
            'type' => 'email',
            'direction' => 'inbound',
            'sender' => $c1->email,
            'recipient' => 'alex@agency.io',
            'subject' => "Re: Quick idea regarding Apex Smiles's website lead conversion",
            'body' => "Hi Alex,\n\nThanks for reaching out! Yes, we actually lose a lot of weekend inquiries because our receptionist is only in Mon-Fri 8am-4pm. Please send over the video!",
            'status' => 'delivered',
            'created_at' => now()->subHours(3),
        ]);

        Message::create([
            'contact_id' => $c1->id,
            'type' => 'sms',
            'direction' => 'outbound',
            'sender' => 'GHL-SMS',
            'recipient' => $c1->phone,
            'body' => "Awesome Dr. Vance! Just sent the 3-minute video to your inbox. Let me know if tomorrow at 2 PM works for a quick screen share.",
            'status' => 'delivered',
            'created_at' => now()->subMinutes(45),
        ]);

        // 10. Campaigns
        Campaign::create([
            'name' => 'Q4 Local Business Funnel Audit Outreach',
            'type' => 'email',
            'status' => 'completed',
            'subject' => 'Is your website leaking local client appointments?',
            'content' => 'Hello! We analyzed over 50 local service websites and found that 62% lack automated SMS speed-to-lead. Read our free audit report.',
            'total_recipients' => 140,
            'sent_count' => 140,
            'delivered_count' => 138,
            'opened_count' => 84,
            'clicked_count' => 39,
        ]);

        Campaign::create([
            'name' => 'VIP Client Retainer Expansion SMS',
            'type' => 'sms',
            'status' => 'draft',
            'content' => 'Hey {{contact.first_name}}! We just launched AI Voice Agents for phone call handling. Reply YES to preview a test call on your number.',
            'total_recipients' => 45,
            'sent_count' => 0,
        ]);
    }
}
