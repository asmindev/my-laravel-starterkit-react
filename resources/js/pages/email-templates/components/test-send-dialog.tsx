import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EmailTemplate } from '@/types';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template: EmailTemplate | null;
}

export default function TestSendDialog({ open, onOpenChange, template }: Props) {
    const form = useForm({
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!template) return;

        form.post(route('email-templates.send-test', template.id), {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    };

    if (!template) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Kirim Email Tes</DialogTitle>
                        <DialogDescription>Kirim email tes untuk memverifikasi template</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="test-email">Email Anda *</Label>
                            <Input
                                id="test-email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                placeholder="emailanda@domain.com"
                                required
                            />
                            {form.errors.email && <p className="text-sm text-destructive">{form.errors.email}</p>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <p>Template: {template.name}</p>
                            <p>Subjek: [TES] {template.subject}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Mengirim...' : 'Kirim Tes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
