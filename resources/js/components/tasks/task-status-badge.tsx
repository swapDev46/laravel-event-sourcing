import { CheckCircle2, Circle, Clock } from 'lucide-react';
import type { TaskStatus } from '@/types';
import { cn } from '@/lib/utils';

interface TaskStatusBadgeProps {
    status: TaskStatus;
    className?: string;
}

const statusConfig: Record<
    TaskStatus,
    { label: string; icon: typeof Circle; className: string }
> = {
    todo: {
        label: 'To Do',
        icon: Circle,
        className:
            'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
    },
    in_progress: {
        label: 'In Progress',
        icon: Clock,
        className:
            'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    },
    done: {
        label: 'Done',
        icon: CheckCircle2,
        className:
            'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    },
};

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
    const config = statusConfig[status] ?? statusConfig.todo;
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
