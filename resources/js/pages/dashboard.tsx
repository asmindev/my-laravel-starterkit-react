import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { AlertTriangle, FileText, Mail, MousePointerClick, TrendingUp, Users } from 'lucide-react';

interface DashboardStats {
    total_recipients: number;
    subscribed_recipients: number;
    email_templates: number;
    total_campaigns: number;
    active_campaigns: number;
    sent_campaigns: number;
}

interface CampaignStats {
    total_sent: number;
    total_clicked: number;
    total_captured: number;
    click_rate: number;
    capture_rate: number;
}

interface Campaign {
    id: number;
    name: string;
    status: string;
    template_name: string;
    created_at: string;
    scheduled_at?: string;
    sent_at?: string;
    sent_count?: number;
    clicked_count?: number;
    captured_count?: number;
    click_rate?: number;
    capture_rate?: number;
}

interface Props {
    stats: DashboardStats;
    campaignStats: CampaignStats;
    recentCampaigns: Campaign[];
    topCampaigns: Campaign[];
}

const statusColors = {
    draft: 'bg-gray-500',
    scheduled: 'bg-blue-500',
    sending: 'bg-yellow-500',
    sent: 'bg-green-500',
    cancelled: 'bg-red-500',
};

const statusLabels = {
    draft: 'Draft',
    scheduled: 'Terjadwal',
    sending: 'Mengirim',
    sent: 'Dikirim',
    cancelled: 'Dibatalkan',
};

export default function Page({ stats, campaignStats, recentCampaigns, topCampaigns }: Props) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="container mx-auto py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Ringkasan sistem simulasi phishing Anda</p>
                </div>

                {/* Main Stats */}
                <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Penerima</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_recipients}</div>
                            <p className="text-xs text-muted-foreground">{stats.subscribed_recipients} berlangganan</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Template Email</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.email_templates}</div>
                            <p className="text-xs text-muted-foreground">Template yang dapat digunakan ulang</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Kampanye</CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_campaigns}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.active_campaigns} aktif, {stats.sent_campaigns} dikirim
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tingkat Klik</CardTitle>
                            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{campaignStats.click_rate}%</div>
                            <p className="text-xs text-muted-foreground">
                                {campaignStats.total_clicked} / {campaignStats.total_sent} diklik
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Campaign Performance Stats */}
                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Email Dikirim</CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{campaignStats.total_sent}</div>
                            <p className="text-xs text-muted-foreground">Di seluruh kampanye</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Link Diklik</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{campaignStats.total_clicked}</div>
                            <p className="text-xs text-muted-foreground">{campaignStats.click_rate}% tingkat klik</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Data Ditangkap</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">{campaignStats.total_captured}</div>
                            <p className="text-xs text-muted-foreground">{campaignStats.capture_rate}% tingkat penangkapan</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent and Top Campaigns */}
                <div className="grid gap-4 md:grid-cols-2">
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
                </div>
            </div>
        </AppLayout>
    );
}
