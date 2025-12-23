import type { EmailTemplate, Recipient } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface UseCampaignFormParams {
    templates: EmailTemplate[];
    recipients: Recipient[];
}

export default function useCampaignForm({ templates, recipients }: UseCampaignFormParams) {
    const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const form = useForm({
        name: '',
        template_id: '',
        form_template_id: null as string | null,
        recipient_ids: [] as number[],
        track_open: true,
        track_click: true,
        redirect_url: '',
        scheduled_at: '',
        send_now: false,
    });

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
        form.post(route('campaigns.store'));
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
