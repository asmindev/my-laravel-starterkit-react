import AppLayout from '@/layouts/app-layout';
import type { Campaign, PaginatedData } from '@/types';
import { Head } from '@inertiajs/react';
import CampaignsTable from './components/campaigns-table';
import SearchBar from './components/search-bar';
import useCampaigns from './hooks/use-campaigns';

interface Props {
    campaigns: PaginatedData<Campaign>;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function CampaignIndexPage({ campaigns, filters }: Props) {
    const { searchQuery, setSearchQuery, handleSearch, handleClear } = useCampaigns(filters);

    return (
        <AppLayout>
            <Head title="Campaigns" />

            <div className="container mx-auto py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Campaigns</h1>
                        <p className="text-muted-foreground">Manage your email campaigns</p>
                    </div>
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} onClear={handleClear} />
                </div>

                <CampaignsTable campaigns={campaigns} />
            </div>
        </AppLayout>
    );
}
