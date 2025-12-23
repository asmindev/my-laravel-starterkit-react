export type CampaignPayload = {
    name: string;
    template_id: string | number;
    recipient_ids: number[];
    track_open: boolean;
    track_click: boolean;
    scheduled_at?: string;
    send_now?: boolean;
};

export function validateCampaign(payload: CampaignPayload) {
    const errors: Record<string, string> = {};

    if (!payload.name || payload.name.trim().length < 3) {
        errors.name = 'Campaign name must be at least 3 characters';
    }

    if (!payload.template_id) {
        errors.template_id = 'Please select a template';
    }

    if (!payload.recipient_ids || payload.recipient_ids.length === 0) {
        errors.recipient_ids = 'Please select at least one recipient';
    }

    return errors;
}
