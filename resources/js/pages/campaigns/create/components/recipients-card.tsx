import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { Recipient } from '@/types';
import type { UseFormReturn } from '@inertiajs/react';
import { Send } from 'lucide-react';

interface Props {
    form: UseFormReturn<any>;
    recipients: Recipient[];
    selectedRecipients: number[];
    selectAll: boolean;
    toggleRecipient: (id: number) => void;
    toggleSelectAll: () => void;
    handleSubmit: (e: React.FormEvent, sendNow?: boolean) => void;
}

export default function RecipientsCard({
    form,
    recipients,
    selectedRecipients,
    selectAll,
    toggleRecipient,
    toggleSelectAll,
    handleSubmit,
}: Props) {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Recipients ({selectedRecipients.length})</CardTitle>
                    <CardDescription>Select who will receive this campaign</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="select_all" checked={selectAll} onCheckedChange={toggleSelectAll} />
                        <label htmlFor="select_all" className="cursor-pointer font-medium">
                            Select All ({recipients.length})
                        </label>
                    </div>
                    <div className="max-h-96 space-y-2 overflow-y-auto border-t pt-3">
                        {recipients.map((recipient) => (
                            <div key={recipient.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`recipient-${recipient.id}`}
                                    checked={selectedRecipients.includes(recipient.id)}
                                    onCheckedChange={() => toggleRecipient(recipient.id)}
                                />
                                <label htmlFor={`recipient-${recipient.id}`} className="cursor-pointer font-normal">
                                    <div className="text-sm">{recipient.name}</div>
                                    <div className="text-xs text-muted-foreground">{recipient.email}</div>
                                </label>
                            </div>
                        ))}
                    </div>
                    {form.errors.recipient_ids && <p className="text-sm text-destructive">{form.errors.recipient_ids}</p>}
                </CardContent>
            </Card>

            <div className="mt-4 space-y-2">
                <Button onClick={(e) => handleSubmit(e, true)} className="w-full" disabled={form.processing || selectedRecipients.length === 0}>
                    <Send className="mr-2 h-4 w-4" />
                    {form.processing ? 'Sending...' : 'Send Now'}
                </Button>
                <Button onClick={(e) => handleSubmit(e, false)} variant="outline" className="w-full" disabled={form.processing || selectedRecipients.length === 0}>
                    Save as Draft
                </Button>
            </div>
        </>
    );
}
