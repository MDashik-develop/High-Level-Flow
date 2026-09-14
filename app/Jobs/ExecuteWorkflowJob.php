<?php

namespace App\Jobs;

use App\Models\Contact;
use App\Models\Message;
use App\Models\Workflow;
use App\Models\WorkflowExecution;
use App\Services\IntegrationManagerService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ExecuteWorkflowJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Workflow $workflow,
        public Contact $contact
    ) {}

    public function handle(IntegrationManagerService $integrations): void
    {
        $execution = WorkflowExecution::create([
            'workflow_id' => $this->workflow->id,
            'contact_id' => $this->contact->id,
            'status' => 'running',
            'logs' => [],
        ]);

        $nodes = $this->workflow->nodes()->get();
        $logs = [];

        foreach ($nodes as $node) {
            $logs[] = [
                'time' => now()->toDateTimeString(),
                'node_key' => $node->node_key,
                'title' => $node->title,
                'action' => $node->node_type,
            ];

            if ($node->node_type === 'action_sms') {
                $phone = $this->contact->phone ?? '+15551234567';
                $messageBody = $node->config['body'] ?? "Hi {$this->contact->first_name}, thanks for reaching out! When can we chat?";
                $res = $integrations->sendSms($phone, $messageBody);
                Message::create([
                    'contact_id' => $this->contact->id,
                    'type' => 'sms',
                    'direction' => 'outbound',
                    'sender' => 'GHL-Workflow',
                    'recipient' => $phone,
                    'body' => $messageBody,
                    'status' => $res['status'] ?? 'delivered',
                ]);
            } elseif ($node->node_type === 'action_email') {
                $email = $this->contact->email ?? 'lead@example.com';
                $subject = $node->config['subject'] ?? 'Welcome to our platform';
                $body = $node->config['body'] ?? "<p>Hi {$this->contact->first_name}, welcome aboard!</p>";
                $res = $integrations->sendEmail($email, $subject, $body);
                Message::create([
                    'contact_id' => $this->contact->id,
                    'type' => 'email',
                    'direction' => 'outbound',
                    'sender' => 'automation@highlevelflow.io',
                    'recipient' => $email,
                    'subject' => $subject,
                    'body' => $body,
                    'status' => $res['status'] ?? 'delivered',
                ]);
            } elseif ($node->node_type === 'action_tag') {
                $this->contact->update([
                    'lead_score' => $this->contact->lead_score + 15,
                ]);
            }
        }

        $execution->update([
            'status' => 'completed',
            'logs' => $logs,
            'completed_at' => now(),
        ]);

        $this->workflow->increment('total_completed');
    }
}
