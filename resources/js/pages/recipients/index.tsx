import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Recipient } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { MoreHorizontal, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface Props {
    recipients: PaginatedData<Recipient>;
    filters: {
        search?: string;
    };
}

export default function RecipientIndex({ recipients, filters }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const createForm = useForm({
        email: '',
        name: '',
        is_subscribed: true,
    });

    const editForm = useForm({
        email: '',
        name: '',
        is_subscribed: true,
    });

    const importForm = useForm({
        file: null as File | null,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('recipients.store'), {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleEdit = (recipient: Recipient) => {
        setEditingRecipient(recipient);
        editForm.setData({
            email: recipient.email,
            name: recipient.name || '',
            is_subscribed: recipient.is_subscribed,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRecipient) return;

        editForm.put(route('recipients.update', editingRecipient.id), {
            onSuccess: () => {
                editForm.reset();
                setIsEditOpen(false);
                setEditingRecipient(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this recipient?')) {
            router.delete(route('recipients.destroy', id));
        }
    };

    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();
        importForm.post(route('recipients.import'), {
            onSuccess: () => {
                importForm.reset();
                setIsImportOpen(false);
            },
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('recipients.index'), { search: searchQuery }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Dashboard', href: route('home') }, { label: 'Recipients' }]}>
            <Head title="Recipients" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Recipients</h1>
                    <p className="text-muted-foreground">Manage your email recipients</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsImportOpen(true)} variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Import CSV
                    </Button>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Recipient
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by email or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit">Search</Button>
                    {filters.search && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setSearchQuery('');
                                router.get(route('recipients.index'));
                            }}
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </form>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recipients.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-8 text-center">
                                    No recipients found
                                </TableCell>
                            </TableRow>
                        ) : (
                            recipients.data.map((recipient) => (
                                <TableRow key={recipient.id}>
                                    <TableCell className="font-medium">{recipient.email}</TableCell>
                                    <TableCell>{recipient.name || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={recipient.is_subscribed ? 'default' : 'secondary'}>
                                            {recipient.is_subscribed ? 'Subscribed' : 'Unsubscribed'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(recipient.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(recipient)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(recipient.id)} className="text-destructive">
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
            {recipients.last_page > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                    {recipients.links.map((link, index) => (
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
                <DialogContent>
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Add New Recipient</DialogTitle>
                            <DialogDescription>Add a new email recipient to your list</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-email">Email *</Label>
                                <Input
                                    id="create-email"
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={(e) => createForm.setData('email', e.target.value)}
                                    required
                                />
                                {createForm.errors.email && <p className="text-sm text-destructive">{createForm.errors.email}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-name">Name</Label>
                                <Input
                                    id="create-name"
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="create-subscribed"
                                    checked={createForm.data.is_subscribed}
                                    onCheckedChange={(checked) => createForm.setData('is_subscribed', checked as boolean)}
                                />
                                <Label htmlFor="create-subscribed">Subscribed</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Adding...' : 'Add Recipient'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Recipient</DialogTitle>
                            <DialogDescription>Update recipient information</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-email">Email *</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    required
                                />
                                {editForm.errors.email && <p className="text-sm text-destructive">{editForm.errors.email}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                    id="edit-name"
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="edit-subscribed"
                                    checked={editForm.data.is_subscribed}
                                    onCheckedChange={(checked) => editForm.setData('is_subscribed', checked as boolean)}
                                />
                                <Label htmlFor="edit-subscribed">Subscribed</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? 'Updating...' : 'Update Recipient'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Import Dialog */}
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                <DialogContent>
                    <form onSubmit={handleImport}>
                        <DialogHeader>
                            <DialogTitle>Import Recipients from CSV</DialogTitle>
                            <DialogDescription>Upload a CSV file with email and name columns</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="import-file">CSV File *</Label>
                                <Input
                                    id="import-file"
                                    type="file"
                                    accept=".csv,.txt"
                                    onChange={(e) => importForm.setData('file', e.target.files?.[0] || null)}
                                    required
                                />
                                <p className="text-sm text-muted-foreground">Expected format: email, name (header row will be skipped)</p>
                                {importForm.errors.file && <p className="text-sm text-destructive">{importForm.errors.file}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsImportOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={importForm.processing}>
                                {importForm.processing ? 'Importing...' : 'Import'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
