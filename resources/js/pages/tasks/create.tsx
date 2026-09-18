import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckSquare, Loader2 } from 'lucide-react';
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
import { index, store } from '@/routes/tasks';
import type { TaskPriority, TaskStatus } from '@/types';

export default function TaskCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        status: 'todo' as TaskStatus,
        priority: 'medium' as TaskPriority,
        due_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <>
            <Head title="Create Task" />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Back button link */}
                <div>
                    <Button variant="ghost" size="sm" asChild className="gap-1.5 text-muted-foreground hover:text-foreground">
                        <Link href={index.url()}>
                            <ArrowLeft className="size-4" />
                            Back to Tasks
                        </Link>
                    </Button>
                </div>

                <Card className="border-sidebar-border/70 shadow-xs">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-2 text-primary">
                            <CheckSquare className="size-5" />
                            <CardTitle className="text-xl">Create New Task</CardTitle>
                        </div>
                        <CardDescription>
                            Add a new task to your list with title, description, priority, and deadline.
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
                                    placeholder="e.g. Implement user authentication flow"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    autoFocus
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
                                    <Label htmlFor="status">Initial Status</Label>
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
                                    <Link href={index.url()}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                                    Create Task
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TaskCreate.layout = {
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
            title: 'Create Task',
            href: store(),
        },
    ],
};
