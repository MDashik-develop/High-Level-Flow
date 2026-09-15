<?php

use App\Http\Controllers\CampaignController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FunnelController;
use App\Http\Controllers\IntegrationController;
use App\Http\Controllers\PipelineController;
use App\Http\Controllers\WebsiteAuditController;
use App\Http\Controllers\WorkflowController;
use Illuminate\Support\Facades\Route;

// Main Dashboard
Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

// CRM / Contacts
Route::resource('contacts', ContactController::class)->except(['create', 'edit']);

// Pipelines & Opportunities (Kanban)
Route::get('pipelines', [PipelineController::class, 'index'])->name('pipelines.index');
Route::post('pipelines/{pipeline}/stages', [PipelineController::class, 'storeStage'])->name('pipelines.stages.store');
Route::post('opportunities', [PipelineController::class, 'storeOpportunity'])->name('opportunities.store');
Route::patch('opportunities/{opportunity}/move', [PipelineController::class, 'moveOpportunity'])->name('opportunities.move');
Route::delete('opportunities/{opportunity}', [PipelineController::class, 'destroyOpportunity'])->name('opportunities.destroy');

// Funnels & GrapesJS Visual Page Builder
Route::resource('funnels', FunnelController::class)->except(['create', 'edit']);
Route::post('funnels/{funnel}/steps', [FunnelController::class, 'addStep'])->name('funnels.steps.store');
Route::patch('funnel-steps/{step}', [FunnelController::class, 'updateStep'])->name('funnels.steps.update');
Route::get('funnels/{funnel}/steps/{step}/builder', [FunnelController::class, 'grapesBuilder'])->name('funnels.steps.grapes');
Route::post('funnels/{funnel}/steps/{step}/builder', [FunnelController::class, 'saveGrapesContent'])->name('funnels.steps.grapes.save');

// Workflows (Visual Graph Automations)
Route::resource('workflows', WorkflowController::class)->except(['create', 'edit']);
Route::post('workflows/{workflow}/graph', [WorkflowController::class, 'saveGraph'])->name('workflows.graph.save');
Route::post('workflows/{workflow}/test-execute', [WorkflowController::class, 'testExecute'])->name('workflows.test-execute');

// Smart Website Crawler / Agency Audit Tool (Client Hunting Weapon)
Route::get('crawler', [WebsiteAuditController::class, 'index'])->name('crawler.index');
Route::post('crawler/scan', [WebsiteAuditController::class, 'crawl'])->name('crawler.scan');
Route::post('crawler/bulk-delete', [WebsiteAuditController::class, 'bulkDestroy'])->name('crawler.bulk-destroy');
Route::delete('crawler/{audit}', [WebsiteAuditController::class, 'destroy'])->name('crawler.destroy');
Route::get('crawler/{audit}', [WebsiteAuditController::class, 'show'])->name('crawler.show');
Route::post('crawler/{audit}/convert-to-lead', [WebsiteAuditController::class, 'convertToLead'])->name('crawler.convert-lead');
Route::post('crawler/{audit}/ai-pitch', [WebsiteAuditController::class, 'generateAiPitch'])->name('crawler.ai-pitch');
Route::post('crawler/{audit}/ai-audit', [WebsiteAuditController::class, 'runAiAudit'])->name('crawler.ai-audit');

// Marketing Campaigns
Route::resource('campaigns', CampaignController::class)->only(['index', 'store']);
Route::post('campaigns/{campaign}/dispatch', [CampaignController::class, 'dispatchNow'])->name('campaigns.dispatch');

// Unified 2-Way Inbox Conversations
Route::get('conversations', [ConversationController::class, 'index'])->name('conversations.index');
Route::post('contacts/{contact}/messages', [ConversationController::class, 'sendMessage'])->name('contacts.messages.store');

// Third-Party Paid API Settings & Integrations
Route::get('settings/integrations', [IntegrationController::class, 'index'])->name('integrations.index');
Route::patch('settings/integrations/{setting}', [IntegrationController::class, 'update'])->name('integrations.update');
Route::patch('settings/integrations/{setting}/toggle', [IntegrationController::class, 'toggleActive'])->name('integrations.toggle');
Route::post('settings/integrations/{setting}/test', [IntegrationController::class, 'testConnection'])->name('integrations.test');

// Direct HTTP 200 OK JSON API endpoints for AI (Zero 302/303 Redirects)
Route::post('api/ai/test-connection', [\App\Http\Controllers\Api\AiApiController::class, 'testConnection'])->name('api.ai.test');
Route::post('api/ai/generate-pitch', [\App\Http\Controllers\Api\AiApiController::class, 'generatePitch'])->name('api.ai.pitch');

