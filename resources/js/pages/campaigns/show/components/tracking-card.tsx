import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TrackingCard({ campaign }: { campaign: any }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm">Open Tracking</span>
                    <Badge variant={campaign.track_open ? 'default' : 'secondary'}>{campaign.track_open ? 'Enabled' : 'Disabled'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm">Click Tracking</span>
                    <Badge variant={campaign.track_click ? 'default' : 'secondary'}>{campaign.track_click ? 'Enabled' : 'Disabled'}</Badge>
                </div>
            </CardContent>
        </Card>
    );
}
