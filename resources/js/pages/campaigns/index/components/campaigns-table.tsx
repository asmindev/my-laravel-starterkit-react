import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Campaign, PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal, Send, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface Props {
    campaigns: PaginatedData<Campaign>;
}

const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
        draft: { variant: 'secondary', label: 'Draft' },
        scheduled: { variant: 'default', label: 'Terjadwal' },
        sending: { variant: 'default', label: 'Mengirim' },
        sent: { variant: 'default', label: 'Terkirim' },
        cancelled: { variant: 'destructive', label: 'Dibatalkan' },
    };

    const config = variants[status] || variants.draft;
    return (
        <Badge variant={config.variant as any} className="capitalize">
            {config.label}
        </Badge>
    );
};

export default function CampaignsTable({ campaigns }: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sendDialogOpen, setSendDialogOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

    const handleDelete = () => {
        if (selectedCampaignId) {
            router.delete(route('campaigns.destroy', selectedCampaignId), {
                onSuccess: () => setDeleteDialogOpen(false),
            });
        }
    };

    const handleSend = () => {
        if (selectedCampaignId) {
            router.post(
                route('campaigns.send', selectedCampaignId),
                {},
                {
                    onSuccess: () => setSendDialogOpen(false),
                },
            );
        }
    };

    const handleCancel = () => {
        if (selectedCampaignId) {
            router.post(
                route('campaigns.cancel', selectedCampaignId),
                {},
                {
                    onSuccess: () => setCancelDialogOpen(false),
                },
            );
        }
    };

    const openDeleteDialog = (id: number) => {
        setSelectedCampaignId(id);
        setDeleteDialogOpen(true);
    };

    const openSendDialog = (id: number) => {
        setSelectedCampaignId(id);
        setSendDialogOpen(true);
    };

    const openCancelDialog = (id: number) => {
        setSelectedCampaignId(id);
        setCancelDialogOpen(true);
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Template</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Penerima</TableHead>
                            <TableHead className="text-center">Terkirim</TableHead>
                            <TableHead className="text-center">Dibuka</TableHead>
                            <TableHead className="text-center">Diklik</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {campaigns.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    Tidak ada kampanye ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            campaigns.data.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell className="font-medium">{campaign.name}</TableCell>
                                    <TableCell>{campaign.template?.name}</TableCell>
                                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                                    <TableCell className="text-center">{campaign.total_recipients || 0}</TableCell>
                                    <TableCell className="text-center">{campaign.sent_count || 0}</TableCell>
                                    <TableCell className="text-center">
                                        {campaign.opened_count || 0}
                                        {(campaign.total_recipients || 0) > 0 && (
                                            <span className="ml-1 text-xs text-muted-foreground">
                                                ({Math.round(((campaign.opened_count || 0) / (campaign.total_recipients || 1)) * 100)}%)
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {campaign.clicked_count || 0}
                                        {campaign?.total_recipients > 0 && (
                                            <span className="ml-1 text-xs text-muted-foreground">
                                                ({Math.round(((campaign.clicked_count || 0) / campaign?.total_recipients) * 100)}%)
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('campaigns.show', campaign.id)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Lihat Detail
                                                    </Link>
                                                </DropdownMenuItem>
                                                {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('campaigns.edit', campaign.id)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                )}
                                                {campaign.status === 'draft' && (
                                                    <>
                                                        <DropdownMenuItem onClick={() => openSendDialog(campaign.id)}>
                                                            <Send className="mr-2 h-4 w-4" />
                                                            Kirim Sekarang
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                {campaign.status === 'scheduled' && (
                                                    <DropdownMenuItem onClick={() => openCancelDialog(campaign.id)} className="text-destructive">
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Batalkan
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem onClick={() => openDeleteDialog(campaign.id)} className="text-destructive">
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

            {campaigns.last_page > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                    {campaigns.links.map((link, index) => (
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kampanye</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kampanye ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="text-destructive-foreground bg-destructive hover:bg-destructive/90">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Send Confirmation Dialog */}
            <AlertDialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kirim Kampanye</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin mengirim kampanye ini? Ini akan mulai mengirim email ke semua penerima di latar belakang.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSend}>Kirim Sekarang</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cancel Confirmation Dialog */}
            <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Batalkan Kampanye</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin membatalkan kampanye terjadwal ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Tidak, Tetap Jaga</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel} className="text-destructive-foreground bg-destructive hover:bg-destructive/90">
                            Ya, Batalkan Kampanye
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
