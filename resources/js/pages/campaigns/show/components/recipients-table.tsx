import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Campaign } from '@/types';
import { format } from 'date-fns';

export default function RecipientsTable({ campaign }: { campaign: Campaign & { campaign_recipients?: any[] } }) {
    const recipients = campaign.campaign_recipients || [];

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Dikirim Pada</TableHead>
                        <TableHead>Dibuka</TableHead>
                        <TableHead>Diklik</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recipients.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                Tidak ada penerima ditemukan.
                            </TableCell>
                        </TableRow>
                    ) : (
                        recipients.map((cr: any) => (
                            <TableRow key={cr.id}>
                                <TableCell>{cr.recipient?.email}</TableCell>
                                <TableCell>{cr.recipient?.name}</TableCell>
                                <TableCell>{cr.status}</TableCell>
                                <TableCell>{cr.sent_at ? format(new Date(cr.sent_at), 'MMM dd, yyyy HH:mm') : '-'}</TableCell>
                                <TableCell>{cr.opened_at ? '✓' : '-'}</TableCell>
                                <TableCell>{cr.clicked_at ? '✓' : '-'}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
