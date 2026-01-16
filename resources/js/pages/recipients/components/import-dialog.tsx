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

export default function ImportDialog({ open, onOpenChange }: Props) {
    const form = useForm({
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('recipients.import'), {
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
                        <DialogTitle>Impor Penerima dari CSV</DialogTitle>
                        <DialogDescription>Unggah file CSV dengan kolom email dan nama</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="import-file">File CSV *</Label>
                            <Input
                                id="import-file"
                                type="file"
                                accept=".csv,.txt"
                                onChange={(e) => form.setData('file', e.target.files?.[0] || null)}
                                required
                            />
                            <p className="text-sm text-muted-foreground">Format yang diharapkan: email, nama (baris header akan dilewati)</p>
                            {form.errors.file && <p className="text-sm text-destructive">{form.errors.file}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Mengimpor...' : 'Impor'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
