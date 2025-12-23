import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Mail, MailOpen, MousePointerClick, Users } from 'lucide-react';

interface Stats {
    total_recipients: number;
    sent_count: number;
    pending_count: number;
    failed_count: number;
    opened_count: number;
    clicked_count: number;
    submitted_count?: number;
    open_rate: number;
    click_rate: number;
    submission_rate?: number;
}

export default function StatsCards({ stats }: { stats: Stats }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_recipients}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sent</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.sent_count}</div>
                    <p className="text-xs text-muted-foreground">
                        {stats.total_recipients > 0 ? `${Math.round((stats.sent_count / stats.total_recipients) * 100)}%` : '0%'} of total
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Opened</CardTitle>
                    <MailOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.opened_count}</div>
                    <p className="text-xs text-muted-foreground">{stats.open_rate}% open rate</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clicked</CardTitle>
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.clicked_count}</div>
                    <p className="text-xs text-muted-foreground">{stats.click_rate}% click rate</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Captured</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{stats.submitted_count || 0}</div>
                    <p className="text-xs text-muted-foreground">{stats.submission_rate || 0}% capture rate</p>
                </CardContent>
            </Card>
        </div>
    );
}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clicked</CardTitle>
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.clicked_count}</div>
                    <p className="text-xs text-muted-foreground">{stats.click_rate}% click rate</p>
                </CardContent>
            </Card>
        </div>
    );
}
