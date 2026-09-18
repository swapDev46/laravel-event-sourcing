import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { destroy } from '@/routes/tasks';
import type { Task } from '@/types';

interface DeleteTaskDialogProps {
    task: Task;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export function DeleteTaskDialog({
    task,
    trigger,
    onSuccess,
}: DeleteTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(destroy.url(task.id), {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setOpen(false);
            },
            onSuccess: () => {
                onSuccess?.();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Trash2 className="mr-1.5 size-3.5" />
                        Delete
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete{' '}
                        <strong className="text-foreground font-semibold">
                            &ldquo;{task.title}&rdquo;
                        </strong>
                        ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 flex flex-row items-center justify-end gap-2">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isDeleting}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Task'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
