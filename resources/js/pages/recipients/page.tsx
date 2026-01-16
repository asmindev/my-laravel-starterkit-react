import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Recipient } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CreateDialog from './components/create-dialog';
import EditDialog from './components/edit-dialog';
import ImportDialog from './components/import-dialog';
import RecipientTable from './components/recipient-table';

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

    const handleEdit = (recipient: Recipient) => {
        setEditingRecipient(recipient);
        setIsEditOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus penerima ini?')) {
            router.delete(route('recipients.destroy', id));
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('recipients.index'), { search: searchQuery }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Dashboard', href: route('home') }, { label: 'Penerima' }]}>
            <Head title="Penerima" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Penerima</h1>
                    <p className="text-muted-foreground">Kelola daftar penerima email Anda</p>
                </div>
                <div className="flex gap-2">
                    {/* <Button onClick={() => setIsImportOpen(true)} variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Impor CSV
                    </Button> */}
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Penerima
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Cari berdasarkan email atau nama..."
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
                                router.get(route('recipients.index'));
                            }}
                        >
                            Hapus
                        </Button>
                    )}
                </div>
            </form>

            <RecipientTable recipients={recipients} onEdit={handleEdit} onDelete={handleDelete} />

            <CreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

            <EditDialog open={isEditOpen} onOpenChange={setIsEditOpen} recipient={editingRecipient} />

            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
        </AppLayout>
    );
}
