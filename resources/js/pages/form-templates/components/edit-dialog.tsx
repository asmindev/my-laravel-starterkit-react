import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { route } from 'ziggy-js';

interface FormTemplate {
    id: number;
    name: string;
    description: string | null;
    html_content: string;
    target_url: string | null;
    metadata: Record<string, any> | null;
    is_active: boolean;
    submissions_count?: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template: FormTemplate | null;
}

export default function EditDialog({ open, onOpenChange, template }: Props) {
    const form = useForm({
        name: '',
        description: '',
        html_content: '',
        target_url: '',
        is_active: true,
    });

    useEffect(() => {
        if (template) {
            form.setData({
                name: template.name,
                description: template.description || '',
                html_content: template.html_content,
                target_url: template.target_url || '',
                is_active: template.is_active,
            });
        }
    }, [template]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!template) return;

        form.put(route('form-templates.update', template.id), {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Template Form</DialogTitle>
                    <DialogDescription>Perbarui detail template form dan konten HTML.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit_name">Nama Template *</Label>
                            <Input id="edit_name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} required />
                            {form.errors.name && <p className="mt-1 text-sm text-destructive">{form.errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="edit_description">Deskripsi</Label>
                            <Textarea
                                id="edit_description"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit_target_url">URL Target</Label>
                            <Input
                                id="edit_target_url"
                                type="url"
                                value={form.data.target_url}
                                onChange={(e) => form.setData('target_url', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit_html_content">Konten HTML *</Label>
                            <Textarea
                                id="edit_html_content"
                                value={form.data.html_content}
                                onChange={(e) => form.setData('html_content', e.target.value)}
                                rows={12}
                                className="font-mono text-xs"
                                required
                            />
                            {form.errors.html_content && <p className="mt-1 text-sm text-destructive">{form.errors.html_content}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="edit_is_active"
                                checked={form.data.is_active}
                                onChange={(e) => form.setData('is_active', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="edit_is_active" className="font-normal">
                                Aktif
                            </Label>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Memperbarui...' : 'Perbarui Template'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
