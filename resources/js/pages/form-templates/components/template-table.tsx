import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PaginatedData } from '@/types';
import { router } from '@inertiajs/react';
import { Copy, Eye, MoreHorizontal, Pencil, Power, Trash2 } from 'lucide-react';

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
    templates: PaginatedData<FormTemplate>;
    onPreview: (template: FormTemplate) => void;
    onEdit: (template: FormTemplate) => void;
    onToggleStatus: (id: number) => void;
    onDuplicate: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function TemplateTable({ templates, onPreview, onEdit, onToggleStatus, onDuplicate, onDelete }: Props) {
    return (
        <>
            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submissions</TableHead>
                            <TableHead>Dibuat</TableHead>
                            <TableHead className="w-17.5"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {templates.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    Tidak ada template ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            templates.data.map((template) => (
                                <TableRow key={template.id}>
                                    <TableCell className="font-medium">{template.name}</TableCell>
                                    <TableCell className="max-w-xs truncate">{template.description || '-'}</TableCell>
                                    <TableCell>{template.metadata?.type && <Badge variant="outline">{template.metadata.type}</Badge>}</TableCell>
                                    <TableCell>
                                        {template.is_active ? (
                                            <Badge variant="default" className="bg-green-500">
                                                Aktif
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">Tidak Aktif</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{template.submissions_count || 0}</TableCell>
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
                                                <DropdownMenuItem onClick={() => onEdit(template)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onToggleStatus(template.id)}>
                                                    <Power className="mr-2 h-4 w-4" />
                                                    {template.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onDuplicate(template.id)}>
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Duplikat
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
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan {templates.from} sampai {templates.to} dari {templates.total} template
                    </p>
                    <div className="flex gap-2">
                        {templates.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
