import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { Recipient } from '@/types';
import { useForm } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useState } from 'react';

interface Props {
    form: ReturnType<typeof useForm<any>>;
    recipients: Recipient[];
    selectedRecipients: number[];
    selectAll: boolean;
    toggleRecipient: (id: number) => void;
    toggleSelectAll: () => void;
    handleSubmit: (e: React.FormEvent, sendNow?: boolean) => void;
}

export default function RecipientsCard({ form, recipients, selectedRecipients, selectAll, toggleRecipient, toggleSelectAll, handleSubmit }: Props) {
    const [action, setAction] = useState<'send' | 'draft' | null>(null);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Penerima ({selectedRecipients.length})</CardTitle>
                    <CardDescription>Pilih siapa yang akan menerima kampanye ini</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="select_all" checked={selectAll} onCheckedChange={toggleSelectAll} />
                        <label htmlFor="select_all" className="cursor-pointer font-medium">
                            Pilih Semua ({recipients.length})
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
                <Button
                    onClick={(e) => {
                        setAction('send');
                        handleSubmit(e, true);
                    }}
                    className="w-full"
                    disabled={form.processing || selectedRecipients.length === 0}
                >
                    <Send className="mr-2 h-4 w-4" />
                    {form.processing && action === 'send' ? 'Mengirim...' : 'Kirim Sekarang'}
                </Button>
                <Button
                    onClick={(e) => {
                        setAction('draft');
                        handleSubmit(e, false);
                    }}
                    variant="outline"
                    className="w-full"
                    disabled={form.processing || selectedRecipients.length === 0}
                >
                    {form.processing && action === 'draft' ? 'Menyimpan...' : 'Simpan sebagai Draf'}
                </Button>
            </div>
        </>
    );
}
