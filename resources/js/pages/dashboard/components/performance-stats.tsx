import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from 'recharts';
import { CampaignStats } from '../types';

interface Props {
    campaignStats: CampaignStats;
}

const chartConfig = {
    sent: {
        label: 'Terkirim',
        color: 'var(--color-chart-1)',
    },
    opened: {
        label: 'Dibuka',
        color: 'var(--color-chart-2)',
    },
    clicked: {
        label: 'Diklik',
        color: 'var(--color-chart-3)',
    },
    captured: {
        label: 'Data Ditangkap',
        color: 'var(--color-chart-5)',
    },
} satisfies ChartConfig;

export default function PerformanceStats({ campaignStats }: Props) {
    const engagementData = [
        { metric: 'Terkirim', value: campaignStats.total_sent, fill: 'var(--color-sent)' },
        { metric: 'Dibuka', value: campaignStats.total_opened, fill: 'var(--color-opened)' },
        { metric: 'Diklik', value: campaignStats.total_clicked, fill: 'var(--color-clicked)' },
        { metric: 'Ditangkap', value: campaignStats.total_captured, fill: 'var(--color-captured)' },
    ];

    const rateData = [
        { name: 'Open Rate', value: campaignStats.open_rate, fill: 'var(--color-opened)' },
        { name: 'Click Rate', value: campaignStats.click_rate, fill: 'var(--color-clicked)' },
        { name: 'Capture Rate', value: campaignStats.capture_rate, fill: 'var(--color-captured)' },
    ];

    return (
        <div className="mb-6 grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Funnel Aktivitas Email</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-65 w-full">
                        <BarChart data={engagementData} accessibilityLayer>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="metric" tickLine={false} axisLine={false} tickMargin={10} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="metric" />} />
                            <Bar dataKey="value" radius={8}>
                                {engagementData.map((entry) => (
                                    <Cell key={entry.metric} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Rasio Konversi</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-65 w-full">
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        formatter={(value, name) => {
                                            return (
                                                <div className="flex items-center justify-between gap-2">
                                                    <span>{name}</span>
                                                    <span className="font-mono font-medium">{value}%</span>
                                                </div>
                                            );
                                        }}
                                    />
                                }
                            />
                            <Pie data={rateData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={84} strokeWidth={4}>
                                {rateData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
