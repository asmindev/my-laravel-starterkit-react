import type { SVGProps } from 'react';

import { CreditCard, FileText, FolderTree, GalleryVerticalEnd, LayoutDashboard, Shield, Users } from 'lucide-react';

import { NavUser } from '@/components/nav-user';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarRail,
    useSidebar,
} from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

type NavItem = {
    label: string;
    href?: string;
    icon?: React.FC<SVGProps<SVGSVGElement>>;
    submenu?: NavItem[]; // khusus master data
    children?: NavItem[]; // untuk grouping besar (Operasional / Referensi / Settings)
};

const navigation: NavItem[] = [
    {
        label: 'Operasional',
        children: [
            {
                label: 'Dashboard',
                href: route('home'),
                icon: LayoutDashboard,
            },
            {
                label: 'Recipients',
                href: '#',
                icon: Users,
                submenu: [
                    {
                        label: 'All Recipients',
                        href: route('recipients.index'),
                    },
                    {
                        label: 'Groups',
                        // href: route('recipient-groups.index'),
                        href: '#',
                    },
                ],
            },
            {
                label: 'Email Templates',
                href: route('email-templates.index'),
                icon: FolderTree,
            },
            {
                label: 'Form Templates',
                href: route('form-templates.index'),
                icon: FileText,
            },
            {
                label: 'Campaigns',
                href: route('campaigns.index'),
                icon: CreditCard,
            },
        ],
    },
];

type AdminSidebarProps = {
    activePath?: string;
};

interface AuthUser {
    name: string;
    email: string;
    avatar?: string;
}

export function AppSidebar({ activePath }: AdminSidebarProps) {
    const { auth } = usePage().props as { auth?: { user: AuthUser } };
    const { state } = useSidebar();
    const getPathFromUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            return urlObj.pathname;
        } catch (e) {
            // Jika url sudah relative (misal '/users'), kembalikan apa adanya
            console.log(e);
            return url;
        }
    };
    const isActive = (href: string) => {
        if (!href || href === '#') return false;

        const currentPath = window.location.pathname;
        const targetPath = getPathFromUrl(href);

        // Khusus Dashboard / Home (Exact Match)
        // Kita bandingkan path-nya saja untuk menghindari isu http vs https atau domain
        const homePath = getPathFromUrl(route('home'));

        if (targetPath === homePath) {
            return currentPath === homePath;
        }

        // Untuk route lain (StartsWith untuk handle nested resource misal: /recipients/create)
        return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
    };

    const hasActiveChild = (item: NavItem): boolean => {
        const children = item.children ?? [];
        const submenu = item.submenu ?? [];
        const all = [...children, ...submenu];

        const currentPath = window.location.pathname;
        const homePath = getPathFromUrl(route('home'));

        return all.some((c) => {
            if (!c.href || c.href === '#') return false;

            const targetPath = getPathFromUrl(c.href);

            // Jangan aktifkan parent jika anaknya adalah dashboard tapi kita sedang tidak di dashboard
            if (targetPath === homePath) {
                return currentPath === homePath;
            }

            return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
        });
    };

    const user = auth?.user || { name: 'Admin', email: 'admin@example.com' };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                {state === 'collapsed' ? (
                    <div className="flex justify-center rounded-md border bg-primary py-1">
                        <GalleryVerticalEnd className="size-5 text-primary-foreground" strokeWidth={1.5} />
                    </div>
                ) : (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/50 bg-primary px-3 py-2 shadow-sm">
                        <div className="flex items-center gap-3 text-primary-foreground">
                            <div className="flex size-10 items-center justify-center rounded-xl border border-background/20">
                                <GalleryVerticalEnd className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Notaris</p>
                                <p className="text-xs">Admin</p>
                            </div>
                        </div>
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent className="w-full">
                {navigation.map((section) => (
                    <SidebarGroup key={section.label}>
                        <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                        <SidebarMenu>
                            {section.children?.map((item) => {
                                const Icon = item.icon;

                                // CASE 1 — item punya submenu (Master Data)
                                if (item.submenu) {
                                    return (
                                        <Collapsible key={item.label} defaultOpen className="group/collapsible">
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        tooltip={item.label}
                                                        asChild
                                                        className={`${hasActiveChild(item) && state === 'collapsed' ? 'bg-primary font-medium text-primary-foreground hover:bg-primary hover:text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {Icon && <Icon className="size-4" />}
                                                            <span>{item.label}</span>
                                                        </div>
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>

                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.submenu.map((sub) => (
                                                            <SidebarMenuSubItem key={sub.href}>
                                                                <SidebarMenuButton
                                                                    asChild
                                                                    tooltip={sub.label}
                                                                    className={`${isActive(sub.href!) ? 'bg-primary font-medium text-primary-foreground hover:bg-primary hover:text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                                                                >
                                                                    <Link href={sub.href!}>
                                                                        <span>{sub.label}</span>
                                                                    </Link>
                                                                </SidebarMenuButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                }

                                // CASE 2 — item biasa
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.label}
                                            className={`${isActive(item.href!) ? 'bg-primary font-medium text-primary-foreground hover:bg-primary hover:text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                                        >
                                            <Link href={item.href!}>
                                                {Icon && <Icon className="size-4" />}
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}

                {state === 'expanded' && (
                    <SidebarGroup className="mx-auto w-11/12 rounded-lg border p-3 text-sm">
                        <div className="flex items-center gap-3">
                            <Shield className="size-4" />
                            <p className="font-semibold">Keamanan & audit</p>
                        </div>
                        <p className="mt-2 text-xs">Aktifkan MFA dan tinjau log aktivitas mingguan.</p>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
