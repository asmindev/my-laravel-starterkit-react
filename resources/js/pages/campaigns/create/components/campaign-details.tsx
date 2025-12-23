import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { EmailTemplate } from '@/types';
import type { UseFormReturn } from '@inertiajs/react';

interface FormTemplate {
    id: number;
    name: string;
    description: string | null;
}

interface Props {
    templates: EmailTemplate[];
    formTemplates?: FormTemplate[];
    form: UseFormReturn<any>;
}

export default function CampaignDetails({ templates, formTemplates, form }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
                <CardDescription>Basic information about your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name *</Label>
                    <Input
                        id="name"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="e.g., Weekly Newsletter - Jan 2025"
                        required
                    />
                    {form.errors.name && <p className="text-sm text-destructive">{form.errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="template">Email Template *</Label>
                    <Select value={form.data.template_id} onValueChange={(value) => form.setData('template_id', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                            {templates.map((template) => (
                                <SelectItem key={template.id} value={template.id.toString()}>
                                    {template.name} - {template.subject}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.errors.template_id && <p className="text-sm text-destructive">{form.errors.template_id}</p>}
                </div>

                {formTemplates && formTemplates.length > 0 && (
                    <div className="space-y-2">
                        <Label htmlFor="form_template">Phishing Form Template (Optional)</Label>
                        <Select value={form.data.form_template_id || ''} onValueChange={(value) => form.setData('form_template_id', value || null)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a form template (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">None</SelectItem>
                                {formTemplates.map((template) => (
                                    <SelectItem key={template.id} value={template.id.toString()}>
                                        {template.name}
                                        {template.description && ` - ${template.description}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Select a form template to create phishing simulation landing pages for this campaign.
                        </p>
                        {form.errors.form_template_id && <p className="text-sm text-destructive">{form.errors.form_template_id}</p>}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="scheduled_at">Schedule Send (Optional)</Label>
                    <Input
                        id="scheduled_at"
                        type="datetime-local"
                        value={form.data.scheduled_at}
                        onChange={(e) => form.setData('scheduled_at', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Leave empty to save as draft</p>
                    {form.errors.scheduled_at && <p className="text-sm text-destructive">{form.errors.scheduled_at}</p>}
                </div>

                <div className="space-y-3 rounded-lg border p-4">
                    <Label>Tracking Options</Label>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="track_open"
                            checked={form.data.track_open}
                            onCheckedChange={(checked) => form.setData('track_open', checked as boolean)}
                        />
                        <Label htmlFor="track_open" className="cursor-pointer font-normal">
                            Track email opens
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="track_click"
                            checked={form.data.track_click}
                            onCheckedChange={(checked) => form.setData('track_click', checked as boolean)}
                        />
                        <Label htmlFor="track_click" className="cursor-pointer font-normal">
                            Track link clicks
                        </Label>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="redirect_url">Default Redirect URL (Optional)</Label>
                    <Input
                        id="redirect_url"
                        type="url"
                        value={form.data.redirect_url || ''}
                        onChange={(e) => form.setData('redirect_url', e.target.value)}
                        placeholder="https://example.com/landing-page"
                    />
                    <p className="text-xs text-muted-foreground">
                        URL to redirect when tracking link clicks. Leave empty to use links from template.
                    </p>
                    {form.errors.redirect_url && <p className="text-sm text-destructive">{form.errors.redirect_url}</p>}
                </div>
            </CardContent>
        </Card>
    );
}
