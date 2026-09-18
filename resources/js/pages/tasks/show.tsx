import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    Pencil,
    User as UserIcon,
} from 'lucide-react';
import { DeleteTaskDialog } from '@/components/tasks/delete-task-dialog';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dashboard } from '@/routes';
import { edit, index, show } from '@/routes/tasks';
import type { Task } from '@/types';

interface TaskShowProps {
    task: Task;
}

export default function TaskShow({ task }: TaskShowProps) {
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Not set';
        return new Date(dateStr).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTimestamp = (dateStr: string | null) => {
        if (!dateStr) return 'Not set';
        return new Date(dateStr).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isOverdue = (dateStr: string | null, status: string) => {
        if (!dateStr || status === 'done') return false;
        const due = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return due < today;
    };

    const overdue = isOverdue(task.due_date, task.status);

    return (
        <>
            <Head title={`Task: ${task.title}`} />

            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Navigation and Action Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="w-fit gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                        <Link href={index.url()}>
                            <ArrowLeft className="size-4" />
                            Back to Tasks
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={edit.url(task.id)}>
                                <Pencil className="mr-1.5 size-3.5" />
                                Edit Task
                            </Link>
                        </Button>
                        <DeleteTaskDialog task={task} />
                    </div>
                </div>

                {/* Main Card */}
                <Card className="border-sidebar-border/70 shadow-xs">
                    <CardHeader className="space-y-4 pb-4">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <TaskStatusBadge status={task.status} />
                            <TaskPriorityBadge priority={task.priority} />
                            {overdue && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                                    <AlertCircle className="size-3" />
                                    Overdue
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            {task.title}
                        </h1>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Description Section */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Description
                            </h3>
                            <div className="mt-2 rounded-lg bg-muted/30 p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                                {task.description ? (
                                    task.description
                                ) : (
                                    <span className="italic text-muted-foreground">
                                        No description provided for this task.
                                    </span>
                                )}
                            </div>
                        </div>

                        <Separator className="bg-sidebar-border/70" />

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Due Date */}
                            <div className="flex items-start gap-3">
                                <div className="rounded-md border border-sidebar-border/70 bg-card p-2 text-muted-foreground">
                                    <Calendar className="size-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs text-muted-foreground">Due Date</p>
                                    <p className={`text-sm font-medium ${overdue ? 'text-destructive font-semibold' : 'text-foreground'}`}>
                                        {formatDate(task.due_date)}
                                    </p>
                                </div>
                            </div>

                            {/* Completed Date */}
                            <div className="flex items-start gap-3">
                                <div className="rounded-md border border-sidebar-border/70 bg-card p-2 text-muted-foreground">
                                    <CheckCircle2 className="size-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs text-muted-foreground">Completed At</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {task.completed_at
                                            ? formatTimestamp(task.completed_at)
                                            : 'Not completed yet'}
                                    </p>
                                </div>
                            </div>

                            {/* Created Date */}
                            <div className="flex items-start gap-3">
                                <div className="rounded-md border border-sidebar-border/70 bg-card p-2 text-muted-foreground">
                                    <Clock className="size-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs text-muted-foreground">Created</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {formatTimestamp(task.created_at)}
                                    </p>
                                </div>
                            </div>

                            {/* Owner */}
                            <div className="flex items-start gap-3">
                                <div className="rounded-md border border-sidebar-border/70 bg-card p-2 text-muted-foreground">
                                    <UserIcon className="size-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs text-muted-foreground">Assigned Owner</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {task.user?.name ?? 'Assigned User'}
                                    </p>
                                    {task.user?.email && (
                                        <p className="text-xs text-muted-foreground">
                                            {task.user.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TaskShow.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Tasks',
            href: index(),
        },
        {
            title: 'Task Details',
            href: '#',
        },
    ],
};
