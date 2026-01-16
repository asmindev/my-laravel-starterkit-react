import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CreateDialog from './components/create-dialog';
import EditDialog from './components/edit-dialog';
import PreviewDialog from './components/preview-dialog';
import TemplateTable from './components/template-table';

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

    const handleEdit = (template: FormTemplate) => {
        setEditingTemplate(template);
        setIsEditOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus template ini? Tindakan ini tidak dapat dibatalkan.')) {
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
        <AppLayout breadcrumbs={[{ label: 'Dashboard', href: route('home') }, { label: 'Template Form' }]}>
            <Head title="Template Form" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Template Form</h1>
                        <p className="mt-1 text-muted-foreground">Kelola template form simulasi phishing</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Buat Template
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari template..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </form>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Status: {filters.status === 'active' ? 'Aktif' : filters.status === 'inactive' ? 'Tidak Aktif' : 'Semua'}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => router.get(route('form-templates.index'))}>Semua</DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    router.get(route('form-templates.index'), {
                                        status: 'active',
                                    })
                                }
                            >
                                Aktif
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    router.get(route('form-templates.index'), {
                                        status: 'inactive',
                                    })
                                }
                            >
                                Tidak Aktif
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Templates Table */}
                <TemplateTable
                    templates={templates}
                    onPreview={handlePreview}
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                />
            </div>

            {/* Create Dialog */}
            <CreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

            {/* Edit Dialog */}
            <EditDialog open={isEditOpen} onOpenChange={setIsEditOpen} template={editingTemplate} />

            {/* Preview Dialog */}
            <PreviewDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen} template={previewTemplate} />
        </AppLayout>
    );
}
