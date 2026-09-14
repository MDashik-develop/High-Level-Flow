<?php

namespace App\Jobs;

use App\Models\Campaign;
use App\Models\Contact;
use App\Models\Message;
use App\Services\IntegrationManagerService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CampaignDispatchJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Campaign $campaign)
    {
    }

    public function handle(IntegrationManagerService $integrations): void
    {
        $this->campaign->update(['status' => 'running']);

        $contacts = Contact::whereNotNull('email')->take(50)->get();
        $this->campaign->update(['total_recipients' => $contacts->count()]);

        $sent = 0;
        $delivered = 0;

        foreach ($contacts as $contact) {
            if ($this->campaign->type === 'email') {
                $res = $integrations->sendEmail($contact->email, $this->campaign->subject ?? $this->campaign->name, $this->campaign->content);
                Message::create([
                    'contact_id' => $contact->id,
                    'type' => 'email',
                    'direction' => 'outbound',
                    'sender' => 'campaign@highlevelflow.io',
                    'recipient' => $contact->email,
                    'subject' => $this->campaign->subject,
                    'body' => $this->campaign->content,
                    'status' => $res['status'] ?? 'sent',
                    'provider_message_id' => $res['message_id'] ?? null,
                ]);
            } else {
                $phone = $contact->phone ?? '+15551234567';
                $res = $integrations->sendSms($phone, $this->campaign->content);
                Message::create([
                    'contact_id' => $contact->id,
                    'type' => 'sms',
                    'direction' => 'outbound',
                    'sender' => 'GHL-SMS',
                    'recipient' => $phone,
                    'body' => $this->campaign->content,
                    'status' => $res['status'] ?? 'sent',
                    'provider_message_id' => $res['message_id'] ?? null,
                ]);
            }

            $sent++;
            $delivered++;
        }

        $this->campaign->update([
            'status' => 'completed',
            'sent_count' => $sent,
            'delivered_count' => $delivered,
        ]);
    }
}
