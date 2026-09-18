import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import type { TaskPriority } from '@/types';
import { cn } from '@/lib/utils';

interface TaskPriorityBadgeProps {
    priority: TaskPriority;
    className?: string;
}

const priorityConfig: Record<
    TaskPriority,
    { label: string; icon: typeof Minus; className: string }
> = {
    low: {
        label: 'Low',
        icon: ArrowDown,
        className:
            'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700',
    },
    medium: {
        label: 'Medium',
        icon: Minus,
        className:
            'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    },
    high: {
        label: 'High',
        icon: ArrowUp,
        className:
            'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    },
};

export function TaskPriorityBadge({ priority, className }: TaskPriorityBadgeProps) {
    const config = priorityConfig[priority] ?? priorityConfig.medium;
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
