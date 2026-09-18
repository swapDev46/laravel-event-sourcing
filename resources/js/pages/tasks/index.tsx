import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckSquare,
    ChevronDown,
    ExternalLink,
    FilterX,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DeleteTaskDialog } from '@/components/tasks/delete-task-dialog';
import { TaskPagination } from '@/components/tasks/task-pagination';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import { create, edit, index, show } from '@/routes/tasks';
import type { PaginatedData, Task, TaskFilters } from '@/types';

interface TasksIndexProps {
    tasks: PaginatedData<Task>;
    filters: TaskFilters;
}

export default function TasksIndex({ tasks, filters }: TasksIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search ?? '')) {
                applyFilters({ search });
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [search]);

    const applyFilters = (updated: Partial<TaskFilters>) => {
        const newFilters = {
            search: search,
            status: filters.status || undefined,
            priority: filters.priority || undefined,
            sort: filters.sort || undefined,
            ...updated,
        };

        // Remove empty keys
        Object.keys(newFilters).forEach((key) => {
            const k = key as keyof typeof newFilters;
            if (!newFilters[k]) {
                delete newFilters[k];
            }
        });

        router.get(index.url(), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = Boolean(
        filters.search || filters.status || filters.priority || filters.sort === 'asc',
    );

    const clearFilters = () => {
        setSearch('');
        router.get(index.url(), {}, { preserveState: true, replace: true });
    };

    const formatDueDate = (dateStr: string | null) => {
        if (!dateStr) return 'No due date';
        const d = new Date(dateStr);
        return d.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const isOverdue = (dateStr: string | null, status: string) => {
        if (!dateStr || status === 'done') return false;
        const due = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return due < today;
    };

    return (
        <>
            <Head title="Tasks" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Tasks
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Create, track, and organize your daily tasks.
                        </p>
                    </div>

                    <Button asChild size="sm">
                        <Link href={create.url()} prefetch>
                            <Plus className="mr-1.5 size-4" />
                            Create Task
                        </Link>
                    </Button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-sm">
                            <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search tasks by title..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Status Filter */}
                        <Select
                            value={filters.status || 'all'}
                            onValueChange={(val) =>
                                applyFilters({ status: val === 'all' ? '' : val })
                            }
                        >
                            <SelectTrigger className="w-full sm:w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="todo">To Do</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Priority Filter */}
                        <Select
                            value={filters.priority || 'all'}
                            onValueChange={(val) =>
                                applyFilters({ priority: val === 'all' ? '' : val })
                            }
                        >
                            <SelectTrigger className="w-full sm:w-[140px]">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Sort Order */}
                        <Select
                            value={filters.sort || 'desc'}
                            onValueChange={(val) =>
                                applyFilters({ sort: val as 'asc' | 'desc' })
                            }
                        >
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="Sort order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Newest First</SelectItem>
                                <SelectItem value="asc">Oldest First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reset button */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <FilterX className="mr-1.5 size-4" />
                            Clear Filters
                        </Button>
                    )}
                </div>

                {/* Tasks Table / Content */}
                {tasks.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/80 bg-card/50 p-12 text-center">
                        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CheckSquare className="size-7" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-foreground">
                            {hasActiveFilters ? 'No tasks found' : 'No tasks yet'}
                        </h3>
                        <p className="text-muted-foreground mt-1.5 max-w-sm text-sm">
                            {hasActiveFilters
                                ? 'No tasks match your current filters. Try changing or clearing your search criteria.'
                                : 'Get started by creating your very first task to track your progress.'}
                        </p>
                        <div className="mt-6 flex gap-3">
                            {hasActiveFilters ? (
                                <Button variant="outline" size="sm" onClick={clearFilters}>
                                    <FilterX className="mr-1.5 size-4" />
                                    Clear Filters
                                </Button>
                            ) : (
                                <Button asChild size="sm">
                                    <Link href={create.url()}>
                                        <Plus className="mr-1.5 size-4" />
                                        Create Task
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
                                    <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        <tr>
                                            <th className="px-6 py-3.5">Task</th>
                                            <th className="px-6 py-3.5">Status</th>
                                            <th className="px-6 py-3.5">Priority</th>
                                            <th className="px-6 py-3.5">Due Date</th>
                                            <th className="px-6 py-3.5">Created</th>
                                            <th className="px-6 py-3.5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sidebar-border/60">
                                        {tasks.data.map((task) => {
                                            const overdue = isOverdue(task.due_date, task.status);

                                            return (
                                                <tr
                                                    key={task.id}
                                                    className="group transition-colors hover:bg-muted/30"
                                                >
                                                    {/* Title & Description */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-0.5">
                                                            <Link
                                                                href={show.url(task.id)}
                                                                className="font-medium text-foreground hover:underline"
                                                            >
                                                                {task.title}
                                                            </Link>
                                                            {task.description && (
                                                                <p className="line-clamp-1 text-xs text-muted-foreground">
                                                                    {task.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Status Badge */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <TaskStatusBadge status={task.status} />
                                                    </td>

                                                    {/* Priority Badge */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <TaskPriorityBadge priority={task.priority} />
                                                    </td>

                                                    {/* Due Date */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div
                                                            className={`flex items-center gap-1.5 text-xs ${
                                                                overdue
                                                                    ? 'font-medium text-destructive'
                                                                    : 'text-muted-foreground'
                                                            }`}
                                                        >
                                                            {overdue ? (
                                                                <AlertCircle className="size-3.5 shrink-0" />
                                                            ) : (
                                                                <Calendar className="size-3.5 shrink-0" />
                                                            )}
                                                            <span>{formatDueDate(task.due_date)}</span>
                                                            {overdue && (
                                                                <span className="text-[10px] uppercase tracking-wider font-semibold">
                                                                    (Overdue)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Created Date */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                                                        {new Date(task.created_at).toLocaleDateString(
                                                            undefined,
                                                            {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="size-8"
                                                                >
                                                                    <MoreHorizontal className="size-4" />
                                                                    <span className="sr-only">Actions</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-40">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={show.url(task.id)}>
                                                                        <ExternalLink className="mr-2 size-4" />
                                                                        View Details
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={edit.url(task.id)}>
                                                                        <Pencil className="mr-2 size-4" />
                                                                        Edit Task
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <div className="p-1">
                                                                    <DeleteTaskDialog
                                                                        task={task}
                                                                        trigger={
                                                                            <button
                                                                                type="button"
                                                                                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
                                                                            >
                                                                                Delete Task
                                                                            </button>
                                                                        }
                                                                    />
                                                                </div>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        <TaskPagination paginator={tasks} className="mt-2 px-1" />
                    </div>
                )}
            </div>
        </>
    );
}

TasksIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Tasks',
            href: index(),
        },
    ],
};
