import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Campaign } from '../types';
import { statusColors, statusLabels } from '../utils/constants';

interface Props {
    recentCampaigns: Campaign[];
}

export default function RecentCampaigns({ recentCampaigns }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Kampanye Terbaru</CardTitle>
                <CardDescription>Kampanye terakhir dibuat atau dimodifikasi</CardDescription>
            </CardHeader>
            <CardContent>
                {recentCampaigns.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground">Belum ada kampanye</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Dibuat</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentCampaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell>
                                        <Link href={`/campaigns/${campaign.id}`} className="hover:underline">
                                            {campaign.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={statusColors[campaign.status as keyof typeof statusColors]}>
                                            {statusLabels[campaign.status as keyof typeof statusLabels]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {format(new Date(campaign.created_at), 'dd MMM yyyy')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
