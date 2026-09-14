<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\ContactTag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Contact::with(['tags', 'opportunities']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%");
            });
        }

        if ($tag = $request->input('tag')) {
            $query->whereHas('tags', fn ($q) => $q->where('name', $tag));
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $contacts = $query->latest()->paginate(15)->withQueryString();
        $tags = ContactTag::all();

        return Inertia::render('Contacts/Index', [
            'contacts' => $contacts,
            'tags' => $tags,
            'filters' => $request->only(['search', 'tag', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:150',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:150',
            'status' => 'nullable|string',
            'lead_score' => 'nullable|integer',
            'notes' => 'nullable|string',
            'tag_ids' => 'nullable|array',
        ]);

        $contact = Contact::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'] ?? null,
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'company' => $validated['company'] ?? null,
            'status' => $validated['status'] ?? 'lead',
            'lead_score' => $validated['lead_score'] ?? 10,
            'notes' => $validated['notes'] ?? null,
        ]);

        if (!empty($validated['tag_ids'])) {
            $contact->tags()->sync($validated['tag_ids']);
        }

        return redirect()->back()->with('success', 'Contact created successfully.');
    }

    public function update(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:150',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:150',
            'status' => 'nullable|string',
            'lead_score' => 'nullable|integer',
            'notes' => 'nullable|string',
            'tag_ids' => 'nullable|array',
        ]);

        $contact->update($validated);

        if (isset($validated['tag_ids'])) {
            $contact->tags()->sync($validated['tag_ids']);
        }

        return redirect()->back()->with('success', 'Contact updated successfully.');
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return redirect()->back()->with('success', 'Contact removed.');
    }
}
