import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuillEditor } from '@/components/ui/quill-editor';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateDialog({ open, onOpenChange }: Props) {
    const form = useForm({
        name: '',
        subject: '',
        html_body: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('email-templates.store'), {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-3xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Buat Template Email</DialogTitle>
                        <DialogDescription>Buat template email baru yang dapat digunakan ulang</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="create-name">Nama Template *</Label>
                            <Input
                                id="create-name"
                                type="text"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                required
                            />
                            {form.errors.name && <p className="text-sm text-destructive">{form.errors.name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-subject">Subjek Email *</Label>
                            <Input
                                id="create-subject"
                                type="text"
                                value={form.data.subject}
                                onChange={(e) => form.setData('subject', e.target.value)}
                                required
                            />
                            {form.errors.subject && <p className="text-sm text-destructive">{form.errors.subject}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-body">Body HTML *</Label>
                            <QuillEditor
                                id="create-body"
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
                            {form.processing ? 'Membuat...' : 'Buat Template'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
