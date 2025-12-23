import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Code, Copy, Eye, MoreHorizontal, Pencil, Plus, Power, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface FormTemplate {
    id: number;
    name: string;
    description: string | null;
    html_content: string;
    target_url: string | null;
    metadata: Record<string, any> | null;
    is_active: boolean;
    submissions_count?: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    templates: PaginatedData<FormTemplate>;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function FormTemplateIndex({ templates, filters }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<FormTemplate | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<FormTemplate | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const createForm = useForm({
        name: '',
        description: '',
        html_content: '',
        target_url: '',
        is_active: true,
    });

    const editForm = useForm({
        name: '',
        description: '',
        html_content: '',
        target_url: '',
        is_active: true,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('form-templates.store'), {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleEdit = (template: FormTemplate) => {
        setEditingTemplate(template);
        editForm.setData({
            name: template.name,
            description: template.description || '',
            html_content: template.html_content,
            target_url: template.target_url || '',
            is_active: template.is_active,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTemplate) return;

        editForm.put(route('form-templates.update', editingTemplate.id), {
            onSuccess: () => {
                editForm.reset();
                setIsEditOpen(false);
                setEditingTemplate(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
            router.delete(route('form-templates.destroy', id));
        }
    };

    const handleToggleStatus = (id: number) => {
        router.post(route('form-templates.toggle-status', id));
    };

    const handleDuplicate = (id: number) => {
        router.post(route('form-templates.duplicate', id));
    };

    const handlePreview = (template: FormTemplate) => {
        setPreviewTemplate(template);
        setIsPreviewOpen(true);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('form-templates.index'), { search: searchQuery }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Form Templates" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Form Templates</h1>
                        <p className="mt-1 text-muted-foreground">Manage phishing simulation form templates</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Template
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </form>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Status: {filters.status || 'All'}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => router.get(route('form-templates.index'))}>All</DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    router.get(route('form-templates.index'), {
                                        status: 'active',
                                    })
                                }
                            >
                                Active
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    router.get(route('form-templates.index'), {
                                        status: 'inactive',
                                    })
                                }
                            >
                                Inactive
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Templates Table */}
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submissions</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="w-[70px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {templates.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No templates found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                templates.data.map((template) => (
                                    <TableRow key={template.id}>
                                        <TableCell className="font-medium">{template.name}</TableCell>
                                        <TableCell className="max-w-xs truncate">{template.description || '-'}</TableCell>
                                        <TableCell>{template.metadata?.type && <Badge variant="outline">{template.metadata.type}</Badge>}</TableCell>
                                        <TableCell>
                                            {template.is_active ? (
                                                <Badge variant="default" className="bg-green-500">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{template.submissions_count || 0}</TableCell>
                                        <TableCell>{new Date(template.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handlePreview(template)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Preview
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEdit(template)}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleStatus(template.id)}>
                                                        <Power className="mr-2 h-4 w-4" />
                                                        {template.is_active ? 'Deactivate' : 'Activate'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDuplicate(template.id)}>
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        Duplicate
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(template.id)} className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {templates.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {templates.from} to {templates.to} of {templates.total} templates
                        </p>
                        <div className="flex gap-2">
                            {templates.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Form Template</DialogTitle>
                        <DialogDescription>
                            Create a new phishing simulation form template. Paste the HTML source code from the target website.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Template Name *</Label>
                                <Input
                                    id="name"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    placeholder="e.g., Facebook Login Clone"
                                    required
                                />
                                {createForm.errors.name && <p className="mt-1 text-sm text-destructive">{createForm.errors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                    placeholder="Brief description of this template"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label htmlFor="target_url">Target URL (Optional)</Label>
                                <Input
                                    id="target_url"
                                    type="url"
                                    value={createForm.data.target_url}
                                    onChange={(e) => createForm.setData('target_url', e.target.value)}
                                    placeholder="https://example.com (for loading external assets)"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    If provided, a &lt;base&gt; tag will be added to load CSS/images from the original site.
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="html_content">HTML Content *</Label>
                                <Textarea
                                    id="html_content"
                                    value={createForm.data.html_content}
                                    onChange={(e) => createForm.setData('html_content', e.target.value)}
                                    placeholder="Paste the full HTML source code here..."
                                    rows={12}
                                    className="font-mono text-xs"
                                    required
                                />
                                {createForm.errors.html_content && <p className="mt-1 text-sm text-destructive">{createForm.errors.html_content}</p>}
                                <p className="mt-1 text-xs text-muted-foreground">
                                    <Code className="mr-1 inline h-3 w-3" />
                                    Form actions will be automatically replaced to capture submissions.
                                </p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={createForm.data.is_active}
                                    onChange={(e) => createForm.setData('is_active', e.target.checked)}
                                    className="rounded"
                                />
                                <Label htmlFor="is_active" className="font-normal">
                                    Active (can be used in campaigns)
                                </Label>
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Creating...' : 'Create Template'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Form Template</DialogTitle>
                        <DialogDescription>Update the form template details and HTML content.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="edit_name">Template Name *</Label>
                                <Input
                                    id="edit_name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    required
                                />
                                {editForm.errors.name && <p className="mt-1 text-sm text-destructive">{editForm.errors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="edit_description">Description</Label>
                                <Textarea
                                    id="edit_description"
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit_target_url">Target URL</Label>
                                <Input
                                    id="edit_target_url"
                                    type="url"
                                    value={editForm.data.target_url}
                                    onChange={(e) => editForm.setData('target_url', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit_html_content">HTML Content *</Label>
                                <Textarea
                                    id="edit_html_content"
                                    value={editForm.data.html_content}
                                    onChange={(e) => editForm.setData('html_content', e.target.value)}
                                    rows={12}
                                    className="font-mono text-xs"
                                    required
                                />
                                {editForm.errors.html_content && <p className="mt-1 text-sm text-destructive">{editForm.errors.html_content}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="edit_is_active"
                                    checked={editForm.data.is_active}
                                    onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                    className="rounded"
                                />
                                <Label htmlFor="edit_is_active" className="font-normal">
                                    Active
                                </Label>
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? 'Updating...' : 'Update Template'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-h-[90vh] max-w-6xl">
                    <DialogHeader>
                        <DialogTitle>Template Preview</DialogTitle>
                        <DialogDescription>Preview how this template will appear to recipients.</DialogDescription>
                    </DialogHeader>
                    {previewTemplate && (
                        <div className="overflow-hidden rounded-lg border">
                            <iframe src={route('form-templates.preview', previewTemplate.id)} className="h-[600px] w-full" title="Template Preview" />
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
