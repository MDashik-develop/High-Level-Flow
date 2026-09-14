<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Funnels
        Schema::create('funnels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('status')->default('active'); // active, draft, archived
            $table->string('custom_domain')->nullable();
            $table->integer('total_visitors')->default(0);
            $table->integer('total_optins')->default(0);
            $table->decimal('total_revenue', 12, 2)->default(0);
            $table->timestamps();
        });

        // Funnel Steps (Opt-in, Sales Page, Checkout, Upsell, Thank You)
        Schema::create('funnel_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('funnel_id')->constrained('funnels')->cascadeOnDelete();
            $table->integer('step_number')->default(1);
            $table->string('name');
            $table->string('step_type')->default('optin'); // optin, sales, checkout, thankyou
            $table->string('path');
            $table->json('page_elements')->nullable();
            $table->integer('visitors')->default(0);
            $table->integer('conversions')->default(0);
            $table->timestamps();
        });

        // Workflows (Automations)
        Schema::create('workflows', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('trigger_type')->default('form_submitted'); // form_submitted, tag_added, deal_stage_changed, site_crawled, webhook
            $table->string('status')->default('active'); // active, draft, paused
            $table->json('trigger_config')->nullable();
            $table->integer('total_enrolled')->default(0);
            $table->integer('total_completed')->default(0);
            $table->timestamps();
        });

        // Workflow Nodes (Graph Canvas)
        Schema::create('workflow_nodes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_id')->constrained('workflows')->cascadeOnDelete();
            $table->string('node_key'); // e.g. "node-1"
            $table->string('node_type'); // trigger, action_email, action_sms, action_wait, action_webhook, action_deal_move, action_tag
            $table->string('title');
            $table->json('config')->nullable();
            $table->double('position_x')->default(250);
            $table->double('position_y')->default(100);
            $table->timestamps();
        });

        // Workflow Edges (Graph Connections)
        Schema::create('workflow_edges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_id')->constrained('workflows')->cascadeOnDelete();
            $table->string('edge_key');
            $table->string('source_node_key');
            $table->string('target_node_key');
            $table->string('source_handle')->nullable();
            $table->string('target_handle')->nullable();
            $table->timestamps();
        });

        // Workflow Executions
        Schema::create('workflow_executions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_id')->constrained('workflows')->cascadeOnDelete();
            $table->foreignId('contact_id')->nullable()->constrained('contacts')->nullOnDelete();
            $table->string('status')->default('running'); // running, completed, failed
            $table->string('current_node_key')->nullable();
            $table->json('logs')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_executions');
        Schema::dropIfExists('workflow_edges');
        Schema::dropIfExists('workflow_nodes');
        Schema::dropIfExists('workflows');
        Schema::dropIfExists('funnel_steps');
        Schema::dropIfExists('funnels');
    }
};
