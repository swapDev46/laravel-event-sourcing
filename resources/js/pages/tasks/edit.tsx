import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckSquare, Info, Loader2 } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import { edit, index, show, update } from '@/routes/tasks';
import type { Task, TaskPriority, TaskStatus } from '@/types';

interface TaskEditProps {
    task: Task;
}

export default function TaskEdit({ task }: TaskEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ? task.due_date.substring(0, 10) : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update.url(task.id));
    };

    return (
        <>
            <Head title={`Edit: ${task.title}`} />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Back button */}
                <div>
                    <Button variant="ghost" size="sm" asChild className="gap-1.5 text-muted-foreground hover:text-foreground">
                        <Link href={show.url(task.id)}>
                            <ArrowLeft className="size-4" />
                            Back to Task Details
                        </Link>
                    </Button>
                </div>

                <Card className="border-sidebar-border/70 shadow-xs">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-2 text-primary">
                            <CheckSquare className="size-5" />
                            <CardTitle className="text-xl">Edit Task</CardTitle>
                        </div>
                        <CardDescription>
                            Update task parameters, change status, or adjust deadlines.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Title */}
                            <div className="grid gap-2">
                                <Label htmlFor="title">
                                    Title <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                    className={errors.title ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                                />
                                <InputError message={errors.title} />
                            </div>

                            {/* Description */}
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    placeholder="Provide detailed notes or requirements for this task..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Status & Priority Row */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* Status */}
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(val) => setData('status', val as TaskStatus)}
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todo">To Do</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="done">Done</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />

                                    {/* Informational helper for completion timestamp logic */}
                                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                        <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
                                        <span>
                                            Marking as <strong>Done</strong> sets completed timestamp. Reverting to <strong>To Do</strong> or <strong>In Progress</strong> reopens the task.
                                        </span>
                                    </div>
                                </div>

                                {/* Priority */}
                                <div className="grid gap-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select
                                        value={data.priority}
                                        onValueChange={(val) => setData('priority', val as TaskPriority)}
                                    >
                                        <SelectTrigger id="priority">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.priority} />
                                </div>
                            </div>

                            {/* Due Date */}
                            <div className="grid gap-2">
                                <Label htmlFor="due_date">Due Date</Label>
                                <Input
                                    id="due_date"
                                    name="due_date"
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    className="w-full sm:w-1/2"
                                />
                                <InputError message={errors.due_date} />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-sidebar-border/70">
                                <Button variant="outline" asChild disabled={processing}>
                                    <Link href={show.url(task.id)}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TaskEdit.layout = {
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
            title: 'Edit Task',
            href: '#',
        },
    ],
};
