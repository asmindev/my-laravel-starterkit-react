export interface DashboardStats {
    total_recipients: number;
    subscribed_recipients: number;
    email_templates: number;
    total_campaigns: number;
    active_campaigns: number;
    sent_campaigns: number;
}

export interface CampaignStats {
    total_sent: number;
    total_opened: number;
    total_clicked: number;
    total_captured: number;
    open_rate: number;
    click_rate: number;
    capture_rate: number;
}

export interface Campaign {
    id: number;
    name: string;
    status: string;
    template_name: string;
    created_at: string;
    scheduled_at?: string;
    sent_at?: string;
    sent_count?: number;
    opened_count?: number;
    clicked_count?: number;
    captured_count?: number;
    open_rate?: number;
    click_rate?: number;
    capture_rate?: number;
}

export interface Props {
    stats: DashboardStats;
    campaignStats: CampaignStats;
    recentCampaigns: Campaign[];
    topCampaigns: Campaign[];
}
