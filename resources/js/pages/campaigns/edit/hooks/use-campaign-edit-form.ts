import type { Campaign, EmailTemplate, Recipient } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Params {
    campaign: Campaign & { campaignRecipients?: any[] };
    templates: EmailTemplate[];
    recipients: Recipient[];
}

export default function useCampaignEditForm({ campaign, recipients }: Params) {
    const initialRecipientIds = (campaign.campaignRecipients || []).map((cr: any) => cr.recipient?.id).filter(Boolean) as number[];

    const form = useForm({
        name: campaign.name ?? '',
        template_id: campaign.template?.id ?? campaign.template_id ?? '',
        form_template_id: campaign.form_template_id?.toString() ?? null,
        recipient_ids: initialRecipientIds,
        track_open: campaign.track_open ?? true,
        track_click: campaign.track_click ?? true,
        redirect_url: campaign.redirect_url ?? '',
        scheduled_at: campaign.scheduled_at ?? '',
        send_now: false,
    });

    const [selectedRecipients, setSelectedRecipients] = useState<number[]>(initialRecipientIds);
    const [selectAll, setSelectAll] = useState(selectedRecipients.length === recipients.length && recipients.length > 0);

    useEffect(() => {
        form.setData('recipient_ids', selectedRecipients);
    }, [selectedRecipients]);

    const toggleRecipient = (id: number) => {
        setSelectedRecipients((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedRecipients([]);
            form.setData('recipient_ids', []);
        } else {
            const ids = recipients.map((r) => r.id);
            setSelectedRecipients(ids);
            form.setData('recipient_ids', ids);
        }
        setSelectAll(!selectAll);
    };

    const handleSubmit = (e: React.FormEvent, sendNow = false) => {
        e.preventDefault();
        form.setData('recipient_ids', selectedRecipients);
        form.setData('send_now', sendNow);
        form.patch(route('campaigns.update', campaign.id));
    };

    return {
        form,
        selectedRecipients,
        selectAll,
        toggleRecipient,
        toggleSelectAll,
        handleSubmit,
    } as const;
}
