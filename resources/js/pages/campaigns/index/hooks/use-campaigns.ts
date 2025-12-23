import { router } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function useCampaigns(filters: { search?: string; status?: string }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleSearch = (e?: React.FormEvent) => {
        if (e && 'preventDefault' in e) e.preventDefault();
        router.get(route('campaigns.index'), { search: searchQuery }, { preserveState: true, preserveScroll: true });
    };

    const handleClear = () => {
        setSearchQuery('');
        router.get(route('campaigns.index'));
    };

    return { searchQuery, setSearchQuery, handleSearch, handleClear } as const;
}
