import AppLayout from '@/layouts/app-layout';
import type { EmailTemplate, Recipient } from '@/types';
import { Head } from '@inertiajs/react';
import CampaignDetails from './components/campaign-details';
import RecipientsCard from './components/recipients-card';
import useCampaignForm from './hooks/use-campaign-form';

interface FormTemplate {
    id: number;
    name: string;
    description: string | null;
}

interface Props {
    templates: EmailTemplate[];
    formTemplates?: FormTemplate[];
    recipients: Recipient[];
}

export default function CampaignCreatePage({ templates, formTemplates, recipients }: Props) {
    const hook = useCampaignForm({ templates, recipients });

    return (
        <AppLayout>
            <Head title="Create Campaign" />

            <div className="container mx-auto py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Create New Campaign</h1>
                    <p className="text-muted-foreground">Set up your email campaign</p>
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
