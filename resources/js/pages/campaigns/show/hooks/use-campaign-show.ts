import type { Campaign } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function useCampaignShow(campaign: Campaign) {
    const [sendDialogOpen, setSendDialogOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    const handleSend = () => {
        router.post(
            route('campaigns.send', campaign.id),
            {},
            {
                onSuccess: () => setSendDialogOpen(false),
            },
        );
    };

    const handleCancel = () => {
        router.post(
            route('campaigns.cancel', campaign.id),
            {},
            {
                onSuccess: () => setCancelDialogOpen(false),
            },
        );
    };

    return {
        handleSend,
        handleCancel,
        sendDialogOpen,
        setSendDialogOpen,
        cancelDialogOpen,
        setCancelDialogOpen,
    } as const;
}
