import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Campaign } from '@/types';
import { Head } from '@inertiajs/react';
import CampaignInfo from './components/campaign-info';
import RecipientsTable from './components/recipients-table';
import StatsCards from './components/stats-cards';
import SubmissionsTable from './components/submissions-table';
import TrackingCard from './components/tracking-card';
import useCampaignShow from './hooks/use-campaign-show';

interface Props {
    campaign: Campaign & { template?: any; campaign_recipients?: any[] };
    stats: {
        total_recipients: number;
        sent_count: number;
        pending_count: number;
        failed_count: number;
        opened_count: number;
        clicked_count: number;
        submitted_count: number;
        open_rate: number;
        click_rate: number;
        submission_rate: number;
    };
    submissions: any[];
}

export default function CampaignShowPage({ campaign, stats, submissions }: Props) {
    const { handleSend, handleCancel, sendDialogOpen, setSendDialogOpen, cancelDialogOpen, setCancelDialogOpen } = useCampaignShow(campaign);

    return (
        <AppLayout>
            <Head title={`Kampanye: ${campaign.name}`} />

            <div className="container mx-auto py-8">
                <div className="mb-4 flex items-start justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <h1 className="text-3xl font-bold">{campaign.name}</h1>
                            {/* status badge rendered inside CampaignInfo */}
                        </div>
                        <p className="text-muted-foreground">Detail kampanye dan statistik</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setSendDialogOpen(true)}>Kirim Sekarang</Button>
                        {campaign.status === 'scheduled' && (
                            <Button variant="destructive" onClick={() => setCancelDialogOpen(true)}>
                                Batalkan
                            </Button>
                        )}
                    </div>
                </div>

                <StatsCards stats={stats} />

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <div>
                            <h3 className="mb-4 text-lg font-medium">Penerima</h3>
                            <RecipientsTable campaign={campaign} />
                        </div>

                        {submissions && submissions.length > 0 && (
                            <div>
                                <h3 className="mb-4 text-lg font-medium">Data yang Ditangkap (Pengiriman Phishing)</h3>
                                <SubmissionsTable submissions={submissions} />
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <CampaignInfo campaign={campaign} />
                        <TrackingCard campaign={campaign} />
                    </div>
                </div>
            </div>

            {/* Send Dialog */}
            <AlertDialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kirim Kampanye</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin mengirim kampanye ini? Tindakan ini akan mulai mengirim email ke semua penerima.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSend}>Kirim Sekarang</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cancel Dialog */}
            <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Batalkan Kampanye</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin membatalkan kampanye terjadwal ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Tidak, Tetap Jaga</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel}>Ya, Batalkan Kampanye</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
