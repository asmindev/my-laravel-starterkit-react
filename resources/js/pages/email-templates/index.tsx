import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { EmailTemplate, PaginatedData } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Eye, MoreHorizontal, Pencil, Plus, Search, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

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

    const createForm = useForm({
        name: '',
        subject: '',
        html_body: '',
    });

    const editForm = useForm({
        name: '',
        subject: '',
        html_body: '',
    });

    const testSendForm = useForm({
        email: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('email-templates.store'), {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleEdit = (template: EmailTemplate) => {
        setEditingTemplate(template);
        editForm.setData({
            name: template.name,
            subject: template.subject,
            html_body: template.html_body,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTemplate) return;

        editForm.put(route('email-templates.update', editingTemplate.id), {
            onSuccess: () => {
                editForm.reset();
                setIsEditOpen(false);
                setEditingTemplate(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus template ini?')) {
            router.delete(route('email-templates.destroy', id));
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

    const handleSendTest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!testSendTemplate) return;

        testSendForm.post(route('email-templates.send-test', testSendTemplate.id), {
            onSuccess: () => {
                testSendForm.reset();
                setIsTestSendOpen(false);
                setTestSendTemplate(null);
            },
        });
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

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Subjek</TableHead>
                            <TableHead>Dibuat Pada</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {templates.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="py-8 text-center">
                                    Tidak ada template ditemukan
                                </TableCell>
                            </TableRow>
                        ) : (
                            templates.data.map((template) => (
                                <TableRow key={template.id}>
                                    <TableCell className="font-medium">{template.name}</TableCell>
                                    <TableCell>{template.subject}</TableCell>
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
                                                    Pratinjau
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleTestSend(template)}>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Kirim Tes
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEdit(template)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(template.id)} className="text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Hapus
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
                <div className="mt-4 flex items-center justify-center gap-2">
                    {templates.links.map((link, index) => (
                        <Button
                            key={index}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="min-w-3xl">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Buat Template Email</DialogTitle>
                            <DialogDescription>Buat template email baru yang dapat digunakan ulang</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-name">Nama Template *</Label>
                                <Input
                                    id="create-name"
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    required
                                />
                                {createForm.errors.name && <p className="text-sm text-destructive">{createForm.errors.name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-subject">Subjek Email *</Label>
                                <Input
                                    id="create-subject"
                                    type="text"
                                    value={createForm.data.subject}
                                    onChange={(e) => createForm.setData('subject', e.target.value)}
                                    required
                                />
                                {createForm.errors.subject && <p className="text-sm text-destructive">{createForm.errors.subject}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-body">Body HTML *</Label>
                                <Textarea
                                    id="create-body"
                                    value={createForm.data.html_body}
                                    onChange={(e) => createForm.setData('html_body', e.target.value)}
                                    rows={12}
                                    className="font-mono text-sm"
                                    required
                                />
                                {createForm.errors.html_body && <p className="text-sm text-destructive">{createForm.errors.html_body}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Membuat...' : 'Buat Template'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-3xl">
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Template Email</DialogTitle>
                            <DialogDescription>Perbarui informasi template</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Nama Template *</Label>
                                <Input
                                    id="edit-name"
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    required
                                />
                                {editForm.errors.name && <p className="text-sm text-destructive">{editForm.errors.name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-subject">Subjek Email *</Label>
                                <Input
                                    id="edit-subject"
                                    type="text"
                                    value={editForm.data.subject}
                                    onChange={(e) => editForm.setData('subject', e.target.value)}
                                    required
                                />
                                {editForm.errors.subject && <p className="text-sm text-destructive">{editForm.errors.subject}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-body">Body HTML *</Label>
                                <Textarea
                                    id="edit-body"
                                    value={editForm.data.html_body}
                                    onChange={(e) => editForm.setData('html_body', e.target.value)}
                                    rows={12}
                                    className="font-mono text-sm"
                                    required
                                />
                                {editForm.errors.html_body && <p className="text-sm text-destructive">{editForm.errors.html_body}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? 'Memperbarui...' : 'Perbarui Template'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Pratinjau: {previewTemplate?.name}</DialogTitle>
                        <DialogDescription>Subjek: {previewTemplate?.subject}</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[500px] overflow-y-auto rounded-lg border p-4">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: previewTemplate?.html_body || '',
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsPreviewOpen(false)}>Tutup</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Test Send Dialog */}
            <Dialog open={isTestSendOpen} onOpenChange={setIsTestSendOpen}>
                <DialogContent>
                    <form onSubmit={handleSendTest}>
                        <DialogHeader>
                            <DialogTitle>Kirim Email Tes</DialogTitle>
                            <DialogDescription>Kirim email tes untuk memverifikasi template</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="test-email">Email Anda *</Label>
                                <Input
                                    id="test-email"
                                    type="email"
                                    value={testSendForm.data.email}
                                    onChange={(e) => testSendForm.setData('email', e.target.value)}
                                    placeholder="emailanda@domain.com"
                                    required
                                />
                                {testSendForm.errors.email && <p className="text-sm text-destructive">{testSendForm.errors.email}</p>}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <p>Template: {testSendTemplate?.name}</p>
                                <p>Subjek: [TES] {testSendTemplate?.subject}</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsTestSendOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={testSendForm.processing}>
                                {testSendForm.processing ? 'Mengirim...' : 'Kirim Tes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
