import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { EmailTemplate } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template: EmailTemplate | null;
}

export default function PreviewDialog({ open, onOpenChange, template }: Props) {
    if (!template) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Pratinjau: {template.name}</DialogTitle>
                    <DialogDescription>Subjek: {template.subject}</DialogDescription>
                </DialogHeader>
                <div className="max-h-[500px] overflow-y-auto rounded-lg border p-4">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: template.html_body || '',
                        }}
                    />
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Tutup</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
