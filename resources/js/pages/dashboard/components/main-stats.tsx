import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Mail, MousePointerClick, Users } from 'lucide-react';
import { CampaignStats, DashboardStats } from '../types';

interface Props {
    stats: DashboardStats;
    campaignStats: CampaignStats;
}

export default function MainStats({ stats, campaignStats }: Props) {
    return (
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Penerima</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_recipients}</div>
                    <p className="text-xs text-muted-foreground">{stats.subscribed_recipients} penerima</p>
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
    );
}
