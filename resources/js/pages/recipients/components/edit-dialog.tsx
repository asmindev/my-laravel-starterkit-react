import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Recipient } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { route } from 'ziggy-js';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    recipient: Recipient | null;
}

export default function EditDialog({ open, onOpenChange, recipient }: Props) {
    const form = useForm({
        email: '',
        name: '',
        is_subscribed: true,
    });

    useEffect(() => {
        if (recipient) {
            form.setData({
                email: recipient.email,
                name: recipient.name || '',
                is_subscribed: recipient.is_subscribed,
            });
        }
    }, [recipient]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipient) return;

        form.put(route('recipients.update', recipient.id), {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Penerima</DialogTitle>
                        <DialogDescription>Perbarui informasi penerima</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-email">Email *</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                required
                            />
                            {form.errors.email && <p className="text-sm text-destructive">{form.errors.email}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nama</Label>
                            <Input id="edit-name" type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="edit-subscribed"
                                checked={form.data.is_subscribed}
                                onCheckedChange={(checked) => form.setData('is_subscribed', checked as boolean)}
                            />
                            <Label htmlFor="edit-subscribed">Berlangganan</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Memperbarui...' : 'Perbarui Penerima'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
