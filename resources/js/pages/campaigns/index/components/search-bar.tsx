import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { route } from 'ziggy-js';

interface Props {
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    onSearch: (e?: React.FormEvent) => void;
    onClear: () => void;
}

export default function SearchBar({ searchQuery, setSearchQuery, onSearch, onClear }: Props) {
    return (
        <div className="flex gap-2">
            <form onSubmit={onSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button type="submit">Search</Button>
            </form>

            {searchQuery && (
                <Button type="button" variant="outline" onClick={onClear}>
                    Clear
                </Button>
            )}

            <Button asChild>
                <Link href={route('campaigns.create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Campaign
                </Link>
            </Button>
        </div>
    );
}
