import { router } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toggleStatus } from '@/routes/users';
import type { UserItem } from '@/types';
import { cn } from '@/lib/utils';

interface UserStatusToggleProps {
    user: UserItem;
    className?: string;
}

export function UserStatusToggle({ user, className }: UserStatusToggleProps) {
    const [loading, setLoading] = useState(false);
    const isActive = user.status === 'active';

    const handleToggle = () => {
        if (loading) return;

        setLoading(true);
        router.patch(
            toggleStatus.url(user.id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isActive}
            aria-label={`Toggle status for ${user.name}`}
            disabled={loading}
            onClick={handleToggle}
            className={cn(
                'group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                isActive
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600',
                className
            )}
        >
            <span
                className={cn(
                    'pointer-events-none flex size-5 items-center justify-center rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out dark:bg-neutral-100',
                    isActive ? 'translate-x-5' : 'translate-x-0'
                )}
            >
                {loading ? (
                    <Loader2 className="size-3 animate-spin text-neutral-500" />
                ) : (
                    <span
                        className={cn(
                            'size-1.5 rounded-full',
                            isActive ? 'bg-emerald-500' : 'bg-neutral-400'
                        )}
                    />
                )}
            </span>
        </button>
    );
}
