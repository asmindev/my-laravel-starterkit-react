import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Code } from 'lucide-react';
import { route } from 'ziggy-js';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateDialog({ open, onOpenChange }: Props) {
    const form = useForm({
        name: '',
        description: '',
        html_content: '',
        target_url: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('form-templates.store'), {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-4xl min-w-1/2 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Buat Template Form</DialogTitle>
                    <DialogDescription>Buat template form simulasi phishing baru. Tempel kode sumber HTML dari situs target.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nama Template *</Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="contoh: Klon Login Facebook"
                                required
                            />
                            {form.errors.name && <p className="mt-1 text-sm text-destructive">{form.errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                placeholder="Deskripsi singkat template ini"
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label htmlFor="target_url">URL Target (Opsional)</Label>
                            <Input
                                id="target_url"
                                type="url"
                                value={form.data.target_url}
                                onChange={(e) => form.setData('target_url', e.target.value)}
                                placeholder="https://contoh.com (untuk memuat aset eksternal)"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                                Jika disediakan, tag &lt;base&gt; akan ditambahkan untuk memuat CSS/gambar dari situs asli.
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="html_content">Konten HTML *</Label>
                            <Textarea
                                id="html_content"
                                value={form.data.html_content}
                                onChange={(e) => form.setData('html_content', e.target.value)}
                                placeholder="Tempel kode sumber HTML lengkap di sini..."
                                rows={12}
                                className="font-mono text-xs"
                                required
                            />
                            {form.errors.html_content && <p className="mt-1 text-sm text-destructive">{form.errors.html_content}</p>}
                            <p className="mt-1 text-xs text-muted-foreground">
                                <Code className="mr-1 inline h-3 w-3" />
                                Aksi form akan otomatis diganti untuk menangkap submissions.
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={form.data.is_active}
                                onChange={(e) => form.setData('is_active', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="is_active" className="font-normal">
                                Aktif (dapat digunakan dalam kampanye)
                            </Label>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
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
