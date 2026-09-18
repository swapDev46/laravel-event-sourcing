import { Head, Link, router } from '@inertiajs/react';
import {
    FilterX,
    Pencil,
    Plus,
    Search,
    UserCheck,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DeleteUserDialog } from '@/components/users/delete-user-dialog';
import { UserPagination } from '@/components/users/user-pagination';
import { UserStatusBadge } from '@/components/users/user-status-badge';
import { UserStatusToggle } from '@/components/users/user-status-toggle';
import { useInitials } from '@/hooks/use-initials';
import { dashboard } from '@/routes';
import { create, edit, index } from '@/routes/users';
import type { PaginatedData, UserFilters, UserItem } from '@/types';

interface UsersIndexProps {
    users: PaginatedData<UserItem>;
    filters: UserFilters;
}

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    const getInitials = useInitials();
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    useEffect(() => {
        setSearch(filters.search ?? '');
        setStatus(filters.status ?? '');
    }, [filters]);

    const applyFilters = (newFilters: { search?: string; status?: string }) => {
        const query: Record<string, string> = {};

        const searchVal = newFilters.search !== undefined ? newFilters.search : search;
        const statusVal = newFilters.status !== undefined ? newFilters.status : status;

        if (searchVal.trim()) {
            query.search = searchVal.trim();
        }

        if (statusVal && statusVal !== 'all') {
            query.status = statusVal;
        }

        router.get(index.url(), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleStatusChange = (val: string) => {
        setStatus(val);
        applyFilters({ status: val });
    };

    const handleResetFilters = () => {
        setSearch('');
        setStatus('');
        router.get(index.url(), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = Boolean(filters.search || filters.status);

    return (
        <>
            <Head title="Users" />

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                                {users.total}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Manage team members, designations, and account access statuses.
                        </p>
                    </div>

                    <Button asChild className="gap-1.5 self-start sm:self-auto">
                        <Link href={create.url()}>
                            <Plus className="size-4" />
                            <span>Create User</span>
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-xs">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name, email, or designation..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </form>

                        {/* Status Filter */}
                        <div className="w-full sm:w-44">
                            <Select value={status || 'all'} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Reset Filters */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleResetFilters}
                                className="gap-1.5 text-muted-foreground hover:text-foreground"
                            >
                                <FilterX className="size-4" />
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Content Table / Empty state */}
                {users.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/70 p-12 text-center">
                        <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <Users className="size-7" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium">No users found</h3>
                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            {hasActiveFilters
                                ? 'No users matched your current search or status filter. Try clearing your filters.'
                                : 'Get started by creating your first user in the system.'}
                        </p>
                        <div className="mt-6 flex gap-3">
                            {hasActiveFilters ? (
                                <Button variant="outline" onClick={handleResetFilters}>
                                    Clear Filters
                                </Button>
                            ) : (
                                <Button asChild>
                                    <Link href={create.url()}>
                                        <Plus className="mr-1.5 size-4" />
                                        Create User
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-sidebar-border/70 bg-muted/50 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        <tr>
                                            <th className="px-5 py-3.5">User</th>
                                            <th className="px-5 py-3.5">Designation</th>
                                            <th className="px-5 py-3.5">Status</th>
                                            <th className="px-5 py-3.5 text-center">Status Toggle</th>
                                            <th className="px-5 py-3.5">Joined</th>
                                            <th className="px-5 py-3.5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sidebar-border/70">
                                        {users.data.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="transition-colors hover:bg-muted/30"
                                            >
                                                {/* User Info */}
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="size-9 rounded-full">
                                                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                                {getInitials(user.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-foreground">
                                                                {user.name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {user.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Designation */}
                                                <td className="px-5 py-3.5">
                                                    {user.designation ? (
                                                        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                                            {user.designation}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Status Badge */}
                                                <td className="px-5 py-3.5">
                                                    <UserStatusBadge status={user.status} />
                                                </td>

                                                {/* Status Toggle Button */}
                                                <td className="px-5 py-3.5 text-center">
                                                    <div className="inline-flex items-center justify-center">
                                                        <UserStatusToggle user={user} />
                                                    </div>
                                                </td>

                                                {/* Joined Date */}
                                                <td className="px-5 py-3.5 text-xs text-muted-foreground">
                                                    {new Date(user.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-5 py-3.5 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                                        >
                                                            <Link href={edit.url(user.id)}>
                                                                <Pencil className="mr-1 size-3.5" />
                                                                Edit
                                                            </Link>
                                                        </Button>

                                                        <DeleteUserDialog user={user} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        <UserPagination paginator={users} className="mt-2 px-1" />
                    </div>
                )}
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Users',
            href: index(),
        },
    ],
};
