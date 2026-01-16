import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { EmailTemplate, PaginatedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CreateDialog from './components/create-dialog';
import EditDialog from './components/edit-dialog';
import PreviewDialog from './components/preview-dialog';
import TemplateTable from './components/template-table';
import TestSendDialog from './components/test-send-dialog';

interface Props {
    templates: PaginatedData<EmailTemplate>;
    filters: {
        search?: string;
    };
}

export default function EmailTemplateIndex({ templates, filters }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isTestSendOpen, setIsTestSendOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
    const [testSendTemplate, setTestSendTemplate] = useState<EmailTemplate | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleEdit = (template: EmailTemplate) => {
        setEditingTemplate(template);
        setIsEditOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus template ini?')) {
            router.delete(route('email-templates.destroy', id), { preserveScroll: true });
        }
    };

    const handlePreview = (template: EmailTemplate) => {
        setPreviewTemplate(template);
        setIsPreviewOpen(true);
    };

    const handleTestSend = (template: EmailTemplate) => {
        setTestSendTemplate(template);
        setIsTestSendOpen(true);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('email-templates.index'), { search: searchQuery }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Dashboard', href: route('home') }, { label: 'Template Email' }]}>
            <Head title="Template Email" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Template Email</h1>
                    <p className="text-muted-foreground">Kelola template email yang dapat digunakan ulang</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Template
                </Button>
            </div>

            <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Cari berdasarkan nama atau subjek..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit">Cari</Button>
                    {filters.search && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setSearchQuery('');
                                router.get(route('email-templates.index'));
                            }}
                        >
                            Hapus
                        </Button>
                    )}
                </div>
            </form>

            <TemplateTable templates={templates} onPreview={handlePreview} onTestSend={handleTestSend} onEdit={handleEdit} onDelete={handleDelete} />

            <CreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

            <EditDialog open={isEditOpen} onOpenChange={setIsEditOpen} template={editingTemplate} />

            <PreviewDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen} template={previewTemplate} />

            <TestSendDialog open={isTestSendOpen} onOpenChange={setIsTestSendOpen} template={testSendTemplate} />
        </AppLayout>
    );
}
