<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Message;
use App\Services\IntegrationManagerService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConversationController extends Controller
{
    public function index(Request $request): Response
    {
        $contacts = Contact::withCount('messages')
            ->has('messages')
            ->latest('updated_at')
            ->take(30)
            ->get();

        if ($contacts->isEmpty()) {
            $contacts = Contact::latest()->take(10)->get();
        }

        $activeContactId = $request->input('contact_id') ?? ($contacts->first()->id ?? null);
        $activeContact = null;
        $messages = [];

        if ($activeContactId) {
            $activeContact = Contact::with('tags')->find($activeContactId);
            if ($activeContact) {
                $messages = Message::where('contact_id', $activeContact->id)
                    ->orderBy('created_at', 'asc')
                    ->get();
            }
        }

        return Inertia::render('Conversations/Index', [
            'contacts' => $contacts,
            'activeContact' => $activeContact,
            'messages' => $messages,
        ]);
    }

    public function sendMessage(Request $request, Contact $contact, IntegrationManagerService $integrations)
    {
        $validated = $request->validate([
            'type' => 'required|in:sms,email,internal_note',
            'body' => 'required|string',
            'subject' => 'nullable|string|max:150',
        ]);

        $status = 'delivered';
        $providerMsgId = null;

        if ($validated['type'] === 'sms') {
            $phone = $contact->phone ?? '+15551234567';
            $res = $integrations->sendSms($phone, $validated['body']);
            $status = $res['status'] ?? 'sent';
            $providerMsgId = $res['message_id'] ?? null;
        } elseif ($validated['type'] === 'email') {
            $email = $contact->email ?? 'lead@example.com';
            $res = $integrations->sendEmail($email, $validated['subject'] ?? 'Message from your team', $validated['body']);
            $status = $res['status'] ?? 'sent';
            $providerMsgId = $res['message_id'] ?? null;
        }

        Message::create([
            'contact_id' => $contact->id,
            'type' => $validated['type'],
            'direction' => 'outbound',
            'sender' => auth()->user()->name ?? 'Agency Specialist',
            'recipient' => $validated['type'] === 'sms' ? $contact->phone : $contact->email,
            'subject' => $validated['subject'] ?? null,
            'body' => $validated['body'],
            'status' => $status,
            'provider_message_id' => $providerMsgId,
        ]);

        $contact->touch();

        return redirect()->route('conversations.index', ['contact_id' => $contact->id])
            ->with('success', 'Message dispatched.');
    }
}
