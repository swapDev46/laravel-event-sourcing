import { CheckCircle2, XCircle } from 'lucide-react';
import type { UserStatus } from '@/types';
import { cn } from '@/lib/utils';

interface UserStatusBadgeProps {
    status: UserStatus;
    className?: string;
}

const statusConfig: Record<
    UserStatus,
    { label: string; icon: typeof CheckCircle2; className: string }
> = {
    active: {
        label: 'Active',
        icon: CheckCircle2,
        className:
            'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    },
    inactive: {
        label: 'Inactive',
        icon: XCircle,
        className:
            'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700',
    },
};

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
    const config = statusConfig[status] ?? statusConfig.active;
    const Icon = config.icon;

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide',
                config.className,
                className,
            )}
        >
            <Icon className="size-3.5 shrink-0" />
            <span>{config.label}</span>
        </span>
    );
}
