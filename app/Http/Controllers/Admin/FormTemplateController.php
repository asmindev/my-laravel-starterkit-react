<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FormTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FormTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = FormTemplate::query();

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $isActive = $request->input('status') === 'active';
            $query->where('is_active', $isActive);
        }

        // Sort
        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $templates = $query->withCount('submissions')
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return Inertia::render('form-templates/index', [
            'templates' => $templates,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'html_content' => 'required|string',
            'target_url' => 'nullable|url',
            'metadata' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $template = FormTemplate::create($validated);

        return redirect()->back()->with('success', 'Form template created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(FormTemplate $formTemplate)
    {
        $formTemplate->load(['submissions' => function ($query) {
            $query->latest()->limit(10);
        }]);

        return Inertia::render('form-templates/show', [
            'template' => $formTemplate,
            'stats' => [
                'total_submissions' => $formTemplate->submissions()->count(),
                'aware_count' => $formTemplate->submissions()->where('is_aware', true)->count(),
                'unique_ips' => $formTemplate->submissions()->distinct('ip_address')->count(),
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FormTemplate $formTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'html_content' => 'required|string',
            'target_url' => 'nullable|url',
            'metadata' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $formTemplate->update($validated);

        return redirect()->back()->with('success', 'Form template updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FormTemplate $formTemplate)
    {
        // Check if template is being used in any campaigns
        if ($formTemplate->campaigns()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete template that is being used in campaigns.');
        }

        $formTemplate->delete();

        return redirect()->back()->with('success', 'Form template deleted successfully!');
    }

    /**
     * Preview the processed HTML of a template
     */
    public function preview(FormTemplate $formTemplate)
    {
        // Set a dummy tracking token for preview
        session(['tracking_token' => 'preview-token-12345']);

        return response($formTemplate->processed_html)
            ->header('Content-Type', 'text/html')
            ->header('X-Frame-Options', 'SAMEORIGIN'); // Allow iframe for preview
    }

    /**
     * Toggle template active status
     */
    public function toggleStatus(FormTemplate $formTemplate)
    {
        $formTemplate->update([
            'is_active' => ! $formTemplate->is_active,
        ]);

        return redirect()->back()->with('success', 'Template status updated!');
    }

    /**
     * Duplicate a template
     */
    public function duplicate(FormTemplate $formTemplate)
    {
        $newTemplate = $formTemplate->replicate();
        $newTemplate->name = $formTemplate->name . ' (Copy)';
        $newTemplate->is_active = false;
        $newTemplate->save();

        return redirect()->back()->with('success', 'Template duplicated successfully!');
    }
}
