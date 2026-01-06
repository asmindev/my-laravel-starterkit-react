import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TrackingCard({ campaign }: { campaign: any }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pelacakan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm">Pelacakan Pembukaan</span>
                    <Badge variant={campaign.track_open ? 'default' : 'secondary'}>{campaign.track_open ? 'Diaktifkan' : 'Dinonaktifkan'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm">Pelacakan Klik</span>
                    <Badge variant={campaign.track_click ? 'default' : 'secondary'}>{campaign.track_click ? 'Diaktifkan' : 'Dinonaktifkan'}</Badge>
                </div>
            </CardContent>
        </Card>
    );
}
