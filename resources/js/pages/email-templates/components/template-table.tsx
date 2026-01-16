import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { EmailTemplate, PaginatedData } from '@/types';
import { router } from '@inertiajs/react';
import { Eye, MoreHorizontal, Pencil, Send, Trash2 } from 'lucide-react';

interface Props {
    templates: PaginatedData<EmailTemplate>;
    onPreview: (template: EmailTemplate) => void;
    onTestSend: (template: EmailTemplate) => void;
    onEdit: (template: EmailTemplate) => void;
    onDelete: (id: number) => void;
}

export default function TemplateTable({ templates, onPreview, onTestSend, onEdit, onDelete }: Props) {
    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Subjek</TableHead>
                            <TableHead>Dibuat Pada</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {templates.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="py-8 text-center">
                                    Tidak ada template ditemukan
                                </TableCell>
                            </TableRow>
                        ) : (
                            templates.data.map((template) => (
                                <TableRow key={template.id}>
                                    <TableCell className="font-medium">{template.name}</TableCell>
                                    <TableCell>{template.subject}</TableCell>
                                    <TableCell>{new Date(template.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onPreview(template)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Pratinjau
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onTestSend(template)}>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Kirim Tes
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onEdit(template)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onDelete(template.id)} className="text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {templates.last_page > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                    {templates.links.map((link, index) => (
                        <Button
                            key={index}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
