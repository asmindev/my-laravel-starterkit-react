import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Mail, TrendingUp } from 'lucide-react';
import { CampaignStats } from '../types';

interface Props {
    campaignStats: CampaignStats;
}

export default function PerformanceStats({ campaignStats }: Props) {
    return (
        <div className="mb-6 grid gap-4 md:grid-cols-4">
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
                    <CardTitle className="text-sm font-medium">Tingkat Buka</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{campaignStats.open_rate}%</div>
                    <p className="text-xs text-muted-foreground">
                        {campaignStats.total_opened} / {campaignStats.total_sent} dibuka
                    </p>
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
    );
}
