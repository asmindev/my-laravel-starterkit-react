import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import MainStats from './components/main-stats';
import PerformanceStats from './components/performance-stats';
import RecentCampaigns from './components/recent-campaigns';
import TopCampaigns from './components/top-campaigns';
import { Props } from './types';

export default function Page({ stats, campaignStats, recentCampaigns, topCampaigns }: Props) {
    return (
        <AppLayout>
            <Head title="Dasbor" />

            <div className="container mx-auto py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Dasbor</h1>
                    <p className="text-muted-foreground">Ringkasan sistem simulasi phishing Anda</p>
                </div>

                <MainStats stats={stats} campaignStats={campaignStats} />

                <PerformanceStats campaignStats={campaignStats} />

                <div className="grid gap-4 md:grid-cols-2">
                    <RecentCampaigns recentCampaigns={recentCampaigns} />
                    <TopCampaigns topCampaigns={topCampaigns} />
                </div>
            </div>
        </AppLayout>
    );
}
