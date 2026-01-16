import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateDialog({ open, onOpenChange }: Props) {
    const form = useForm({
        email: '',
        name: '',
        is_subscribed: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('recipients.store'), {
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
                        <DialogTitle>Tambah Penerima Baru</DialogTitle>
                        <DialogDescription>Tambahkan penerima email baru ke daftar Anda</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="create-email">Email *</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                required
                            />
                            {form.errors.email && <p className="text-sm text-destructive">{form.errors.email}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-name">Nama</Label>
                            <Input id="create-name" type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                        </div>
                        {/* <div className="flex items-center space-x-2">
                            <Checkbox
                                id="create-subscribed"
                                checked={form.data.is_subscribed}
                                onCheckedChange={(checked) => form.setData('is_subscribed', checked as boolean)}
                            />
                            <Label htmlFor="create-subscribed">Berlangganan</Label>
                        </div> */}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Menambahkan...' : 'Tambah Penerima'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
