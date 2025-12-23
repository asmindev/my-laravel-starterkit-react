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
            <Head title={`Campaign: ${campaign.name}`} />

            <div className="container mx-auto py-8">
                <div className="mb-4 flex items-start justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <h1 className="text-3xl font-bold">{campaign.name}</h1>
                            {/* status badge rendered inside CampaignInfo */}
                        </div>
                        <p className="text-muted-foreground">Campaign details and statistics</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setSendDialogOpen(true)}>Send Now</Button>
                        {campaign.status === 'scheduled' && (
                            <Button variant="destructive" onClick={() => setCancelDialogOpen(true)}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>

                <StatsCards stats={stats} />

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <div>
                            <h3 className="mb-4 text-lg font-medium">Recipients</h3>
                            <RecipientsTable campaign={campaign} />
                        </div>

                        {submissions && submissions.length > 0 && (
                            <div>
                                <h3 className="mb-4 text-lg font-medium">Captured Data (Phishing Submissions)</h3>
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
                        <AlertDialogTitle>Send Campaign</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to send this campaign? This action will start sending emails to all recipients.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSend}>Send Now</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cancel Dialog */}
            <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Campaign</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel this scheduled campaign? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>No, Keep It</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel}>Yes, Cancel Campaign</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
