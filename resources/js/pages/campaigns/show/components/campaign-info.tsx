import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Campaign } from '@/types';
import { format } from 'date-fns';
import { Calendar, FileText, Mail } from 'lucide-react';

export default function CampaignInfo({ campaign }: { campaign: Campaign & { template?: any } }) {
    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; label: string }> = {
            draft: { variant: 'secondary', label: 'Draf' },
            scheduled: { variant: 'default', label: 'Dijadwalkan' },
            sending: { variant: 'default', label: 'Mengirim' },
            sent: { variant: 'default', label: 'Terkirim' },
            cancelled: { variant: 'destructive', label: 'Dibatalkan' },
        };
        const config = variants[status] || variants.draft;
        return (
            <Badge variant={config.variant as any} className="capitalize">
                {config.label}
            </Badge>
        );
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Info Kampanye</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                        <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Template</p>
                            <p className="text-sm text-muted-foreground">{campaign.template?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Subjek</p>
                            <p className="text-sm text-muted-foreground">{campaign.template?.subject}</p>
                        </div>
                    </div>
                    {campaign.scheduled_at && (
                        <div className="flex items-start gap-3">
                            <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Dijadwalkan</p>
                                <p className="text-sm text-muted-foreground">{format(new Date(campaign.scheduled_at), 'MMM dd, yyyy HH:mm')}</p>
                            </div>
                        </div>
                    )}
                    <div>{getStatusBadge(campaign.status)}</div>
                </CardContent>
            </Card>
        </>
    );
}
