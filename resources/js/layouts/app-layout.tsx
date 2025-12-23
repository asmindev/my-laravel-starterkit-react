import { PropsWithChildren, useEffect } from 'react';

import { Link, usePage } from '@inertiajs/react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { toast } from 'sonner';
import { AppSidebar } from './app-sidebar';

type BreadcrumbLinkItem = {
    label: string;
    href?: string;
};

type AdminLayoutProps = PropsWithChildren<{
    breadcrumbs?: BreadcrumbLinkItem[];
}>;

export default function AdminLayout({ children, breadcrumbs }: AdminLayoutProps) {
    const { url, props } = usePage();

    useEffect(() => {
        const flash = props.flash as { type: 'success' | 'error' | 'message' | null; content: string | null };
        if (flash.content) {
            toast[flash.type ?? 'message'](flash.content);
        }
    }, [props.flash]);

    return (
        <SidebarProvider>
            <AppSidebar activePath={url} />
            <SidebarInset className="relative flex min-w-0 flex-col">
                <header className="sticky top-0 z-10 flex w-full flex-wrap items-center gap-3 border-b bg-card py-4">
                    <SidebarTrigger />
                    {breadcrumbs && breadcrumbs.length > 0 ? (
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map((item, index) => {
                                    const isLast = index === breadcrumbs.length - 1;
                                    return (
                                        <BreadcrumbItem key={`${item.label}-${index}`}>
                                            {item.href && !isLast ? (
                                                <BreadcrumbLink asChild>
                                                    <Link href={item.href}>{item.label}</Link>
                                                </BreadcrumbLink>
                                            ) : (
                                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                            )}
                                            {!isLast && <BreadcrumbSeparator />}
                                        </BreadcrumbItem>
                                    );
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>
                    ) : (
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Admin</div>
                    )}
                </header>
                <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-auto p-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
