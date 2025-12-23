<?php

namespace App\Http\Controllers;

use App\Models\Recipient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecipientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $recipients = Recipient::query()
            ->when($request->search, function ($query, $search) {
                $query->where('email', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('recipients/index', [
            'recipients' => $recipients,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:recipients,email',
            'name' => 'nullable|string|max:255',
            'is_subscribed' => 'boolean',
        ]);

        Recipient::create($validated);

        return redirect()->back()->with('success', 'Recipient added successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Recipient $recipient)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:recipients,email,'.$recipient->id,
            'name' => 'nullable|string|max:255',
            'is_subscribed' => 'boolean',
        ]);

        $recipient->update($validated);

        return redirect()->back()->with('success', 'Recipient updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recipient $recipient)
    {
        $recipient->delete();

        return redirect()->back()->with('success', 'Recipient deleted successfully!');
    }
}
