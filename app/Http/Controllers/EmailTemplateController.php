<?php

namespace App\Http\Controllers;

use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class EmailTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $templates = EmailTemplate::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('email-templates/page', [
            'templates' => $templates,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'from_name' => 'nullable|string|max:255',
            'html_body' => 'required|string',
        ]);

        EmailTemplate::create($validated);

        return redirect()->back()->with('success', 'Template created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EmailTemplate $emailTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'from_name' => 'nullable|string|max:255',
            'html_body' => 'required|string',
        ]);

        $emailTemplate->update($validated);

        return redirect()->back()->with('success', 'Template updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmailTemplate $emailTemplate)
    {
        $emailTemplate->delete();

        return redirect()->back()->with('success', 'Template deleted successfully!');
    }

    /**
     * Send test email
     */
    public function sendTest(Request $request, EmailTemplate $emailTemplate)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);
        Log::info('Preparing to send test email', [
            'template_id' => $emailTemplate->id,
            'to_email' => $validated['email'],
            'from_name' => $emailTemplate->from_name,
        ]);

        $fromName = $emailTemplate->from_name ?: config('mail.from.name');
        Log::info('Sending test email from template', [
            'template_id' => $emailTemplate->id,
            'to_email' => $validated['email'],
            'from_name' => $fromName,
        ]);

        Mail::send([], [], function ($message) use ($emailTemplate, $validated, $fromName) {
            $message->to($validated['email'])
                ->from(config('mail.from.address'), $fromName)
                ->subject('[TEST] ' . $emailTemplate->subject)
                ->html($emailTemplate->html_body);
        });

        return redirect()->back()->with('success', 'Test email sent successfully!');
    }
}
