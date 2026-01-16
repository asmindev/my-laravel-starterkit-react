import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { Campaign } from '../types';

interface Props {
    topCampaigns: Campaign[];
}

export default function TopCampaigns({ topCampaigns }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Kampanye Terbaik</CardTitle>
                <CardDescription>Kampanye dengan tingkat klik tertinggi</CardDescription>
            </CardHeader>
            <CardContent>
                {topCampaigns.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground">Belum ada kampanye yang dikirim</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Tingkat Buka</TableHead>
                                <TableHead>Tingkat Klik</TableHead>
                                <TableHead>Ditangkap</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topCampaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell>
                                        <Link href={`/campaigns/${campaign.id}`} className="hover:underline">
                                            {campaign.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">{campaign.open_rate}%</span>
                                        <span className="text-xs text-muted-foreground">
                                            {' '}
                                            ({campaign.opened_count}/{campaign.sent_count})
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">{campaign.click_rate}%</span>
                                        <span className="text-xs text-muted-foreground">
                                            {' '}
                                            ({campaign.clicked_count}/{campaign.sent_count})
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-medium text-destructive">
                                        {campaign.captured_count}
                                        <span className="text-xs text-muted-foreground"> ({campaign.capture_rate}%)</span>
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
