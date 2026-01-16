import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PaginatedData, Recipient } from '@/types';
import { router } from '@inertiajs/react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

interface Props {
    recipients: PaginatedData<Recipient>;
    onEdit: (recipient: Recipient) => void;
    onDelete: (id: number) => void;
}

export default function RecipientTable({ recipients, onEdit, onDelete }: Props) {
    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Dibuat Pada</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recipients.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-8 text-center">
                                    Tidak ada penerima ditemukan
                                </TableCell>
                            </TableRow>
                        ) : (
                            recipients.data.map((recipient) => (
                                <TableRow key={recipient.id}>
                                    <TableCell className="font-medium">{recipient.email}</TableCell>
                                    <TableCell>{recipient.name || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={recipient.is_subscribed ? 'default' : 'secondary'}>
                                            {recipient.is_subscribed ? 'Berlangganan' : 'Berhenti Langganan'}
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
                                                <DropdownMenuItem onClick={() => onEdit(recipient)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onDelete(recipient.id)} className="text-destructive">
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
        </>
    );
}
