export interface Auth {
    user: User;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Recipient {
    id: number;
    email: string;
    name: string | null;
    is_subscribed: boolean;
    created_at: string;
    updated_at: string;
}

export interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    html_body: string;
    created_at: string;
    updated_at: string;
}

export interface Campaign {
    id: number;
    name: string;
    template_id: number;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
    track_open: boolean;
    track_click: boolean;
    scheduled_at: string | null;
    created_at: string;
    updated_at: string;
    template?: EmailTemplate;
    total_recipients?: number;
    sent_count?: number;
    failed_count?: number;
    opened_count?: number;
    clicked_count?: number;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}
