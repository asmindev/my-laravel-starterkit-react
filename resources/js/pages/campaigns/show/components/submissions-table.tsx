import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface Submission {
    id: number;
    recipient_email: string;
    recipient_name: string;
    submitted_at: string;
    ip_address: string;
    submitted_data: Record<string, any>;
}

export default function SubmissionsTable({ submissions }: { submissions: Submission[] }) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Submitted At</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Data</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No submissions captured yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        submissions.map((submission) => (
                            <TableRow key={submission.id}>
                                <TableCell>
                                    <div className="font-medium">{submission.recipient_name}</div>
                                    <div className="text-sm text-muted-foreground">{submission.recipient_email}</div>
                                </TableCell>
                                <TableCell>{format(new Date(submission.submitted_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                                <TableCell>{submission.ip_address}</TableCell>
                                <TableCell>
                                    <pre className="max-w-xs overflow-auto rounded bg-muted p-2 text-xs">
                                        {JSON.stringify(submission.submitted_data, null, 2)}
                                    </pre>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
