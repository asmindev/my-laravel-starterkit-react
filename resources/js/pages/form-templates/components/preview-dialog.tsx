import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

export default function PreviewDialog({ open, onOpenChange, template }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-6xl">
                <DialogHeader>
                    <DialogTitle>Pratinjau Template</DialogTitle>
                    <DialogDescription>Pratinjau bagaimana template ini akan muncul untuk penerima.</DialogDescription>
                </DialogHeader>
                {template && (
                    <div className="overflow-hidden rounded-lg border">
                        <iframe src={route('form-templates.preview', template.id)} className="h-150 w-full" title="Template Preview" />
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Tutup</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
