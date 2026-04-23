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
            <div className="container mx-auto">
                <div className="my-4 rounded-lg bg-black/20 bg-[url(https://kendariinfo.com/wp-content/uploads/2023/02/WhatsApp-Image-2023-02-09-at-18.12.36.jpeg)] bg-cover bg-center p-6 bg-blend-multiply md:p-10">
                    <div className="mb-3 flex justify-between rounded-lg bg-black/20 p-4 backdrop-blur-md">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Dasbor Kominfo</h1>
                            <p className="text-gray-400">Ringkasan sistem simulasi phishing Anda</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* logo kominfo */}
                            <img
                                src="https://iconlogovector.com/uploads/images/2024/04/lg-66110283154da-KOMINFO.webp"
                                alt="Kominfo"
                                className="h-18"
                            />
                        </div>
                    </div>

                    <MainStats stats={stats} campaignStats={campaignStats} />
                </div>
                <PerformanceStats campaignStats={campaignStats} />
                <div className="grid gap-4 md:grid-cols-2">
                    <RecentCampaigns recentCampaigns={recentCampaigns} />
                    <TopCampaigns topCampaigns={topCampaigns} />
                </div>
            </div>
        </AppLayout>
    );
}
