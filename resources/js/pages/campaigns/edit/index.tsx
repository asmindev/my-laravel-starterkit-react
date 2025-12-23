import AppLayout from '@/layouts/app-layout';
import type { Campaign, EmailTemplate, Recipient } from '@/types';
import { Head } from '@inertiajs/react';
import CampaignDetails from './components/campaign-details-edit';
import RecipientsCard from './components/recipients-edit-card';
import useCampaignEditForm from './hooks/use-campaign-edit-form';

interface FormTemplate {
    id: number;
    name: string;
    description: string | null;
}

interface Props {
    campaign: Campaign & { template?: any; campaignRecipients?: any[] };
    templates: EmailTemplate[];
    formTemplates?: FormTemplate[];
    recipients: Recipient[];
}

export default function CampaignEditPage({ campaign, templates, formTemplates, recipients }: Props) {
    const hook = useCampaignEditForm({ campaign, templates, recipients });

    return (
        <AppLayout>
            <Head title={`Edit: ${campaign.name}`} />

            <div className="container mx-auto py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Edit Campaign</h1>
                    <p className="text-muted-foreground">Update campaign details</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <CampaignDetails form={hook.form} templates={templates} formTemplates={formTemplates} />
                    </div>

                    <div>
                        <RecipientsCard
                            form={hook.form}
                            recipients={recipients}
                            selectedRecipients={hook.selectedRecipients}
                            selectAll={hook.selectAll}
                            toggleRecipient={hook.toggleRecipient}
                            toggleSelectAll={hook.toggleSelectAll}
                            handleSubmit={hook.handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
