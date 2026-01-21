import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuillEditor } from '@/components/ui/quill-editor';
import type { EmailTemplate } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { route } from 'ziggy-js';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template: EmailTemplate | null;
}

export default function EditDialog({ open, onOpenChange, template }: Props) {
    const form = useForm({
        name: '',
        subject: '',
        html_body: '',
    });

    useEffect(() => {
        if (template) {
            form.setData({
                name: template.name,
                subject: template.subject,
                html_body: template.html_body,
            });
        }
    }, [template]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!template) return;

        form.put(route('email-templates.update', template.id), {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Template Email</DialogTitle>
                        <DialogDescription>Perbarui informasi template</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nama Template *</Label>
                            <Input
                                id="edit-name"
                                type="text"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                required
                            />
                            {form.errors.name && <p className="text-sm text-destructive">{form.errors.name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-subject">Subjek Email *</Label>
                            <Input
                                id="edit-subject"
                                type="text"
                                value={form.data.subject}
                                onChange={(e) => form.setData('subject', e.target.value)}
                                required
                            />
                            {form.errors.subject && <p className="text-sm text-destructive">{form.errors.subject}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-body">Body HTML *</Label>
                            <QuillEditor
                                id="edit-body"
                                value={form.data.html_body}
                                onChange={(value) => form.setData('html_body', value)}
                                placeholder="Tulis konten email di sini..."
                            />
                            {form.errors.html_body && <p className="text-sm text-destructive">{form.errors.html_body}</p>}
                        </div>
                    </div>
                    <DialogFooter>
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
