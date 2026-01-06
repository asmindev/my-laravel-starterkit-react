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

export default function CampaignDetailsEdit({ templates, formTemplates, form }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Detail Kampanye</CardTitle>
                <CardDescription>Perbarui informasi kampanye Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Kampanye *</Label>
                    <Input
                        id="name"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="Nama kampanye"
                        required
                    />
                    {form.errors.name && <p className="text-sm text-destructive">{form.errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="template">Template Email *</Label>
                    <Select value={form.data.template_id} onValueChange={(value) => form.setData('template_id', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih template" />
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
                        <Label htmlFor="form_template">Template Form Phishing (Opsional)</Label>
                        <Select value={form.data.form_template_id || ''} onValueChange={(value) => form.setData('form_template_id', value || null)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih template form (opsional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Tidak ada</SelectItem>
                                {formTemplates.map((template) => (
                                    <SelectItem key={template.id} value={template.id.toString()}>
                                        {template.name}
                                        {template.description && ` - ${template.description}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Pilih template form untuk membuat halaman landing simulasi phishing untuk kampanye ini.
                        </p>
                        {form.errors.form_template_id && <p className="text-sm text-destructive">{form.errors.form_template_id}</p>}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="scheduled_at">Jadwalkan Pengiriman (Opsional)</Label>
                    <Input
                        id="scheduled_at"
                        type="datetime-local"
                        value={form.data.scheduled_at}
                        onChange={(e) => form.setData('scheduled_at', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Biarkan kosong untuk mempertahankan jadwal saat ini atau simpan sebagai draf</p>
                    {form.errors.scheduled_at && <p className="text-sm text-destructive">{form.errors.scheduled_at}</p>}
                </div>

                <div className="space-y-3 rounded-lg border p-4">
                    <Label>Opsi Pelacakan</Label>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="track_open"
                            checked={form.data.track_open}
                            onCheckedChange={(checked) => form.setData('track_open', checked as boolean)}
                        />
                        <Label htmlFor="track_open" className="cursor-pointer font-normal">
                            Lacak pembukaan email
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="track_click"
                            checked={form.data.track_click}
                            onCheckedChange={(checked) => form.setData('track_click', checked as boolean)}
                        />
                        <Label htmlFor="track_click" className="cursor-pointer font-normal">
                            Lacak klik tautan
                        </Label>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="redirect_url">URL Redirect Default (Opsional)</Label>
                    <Input
                        id="redirect_url"
                        type="url"
                        value={form.data.redirect_url || ''}
                        onChange={(e) => form.setData('redirect_url', e.target.value)}
                        placeholder="https://contoh.com/halaman-landing"
                    />
                    <p className="text-xs text-muted-foreground">
                        URL untuk redirect saat melacak klik tautan. Biarkan kosong untuk menggunakan tautan dari template.
                    </p>
                    {form.errors.redirect_url && <p className="text-sm text-destructive">{form.errors.redirect_url}</p>}
                </div>
            </CardContent>
        </Card>
    );
}
