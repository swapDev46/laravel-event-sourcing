import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PaginatedData, Task } from '@/types';

interface TaskPaginationProps {
    paginator: PaginatedData<Task>;
    className?: string;
}

export function TaskPagination({ paginator, className }: TaskPaginationProps) {
    if (paginator.last_page <= 1) {
        return null;
    }

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-between gap-4 sm:flex-row',
                className,
            )}
        >
            <p className="text-muted-foreground text-sm">
                Showing{' '}
                <span className="text-foreground font-medium">
                    {paginator.from ?? 0}
                </span>{' '}
                to{' '}
                <span className="text-foreground font-medium">
                    {paginator.to ?? 0}
                </span>{' '}
                of{' '}
                <span className="text-foreground font-medium">
                    {paginator.total}
                </span>{' '}
                results
            </p>

            <nav
                className="flex items-center gap-1"
                aria-label="Pagination Navigation"
            >
                {paginator.links.map((link, index) => {
                    const isPrevious = link.label.includes('Previous');
                    const isNext = link.label.includes('Next');

                    let label = link.label;
                    if (isPrevious) {
                        label = 'Previous';
                    } else if (isNext) {
                        label = 'Next';
                    }

                    if (!link.url) {
                        return (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                disabled
                                className="pointer-events-none opacity-50"
                            >
                                {isPrevious && (
                                    <ChevronLeft className="mr-1 size-3.5" />
                                )}
                                <span dangerouslySetInnerHTML={{ __html: label }} />
                                {isNext && (
                                    <ChevronRight className="ml-1 size-3.5" />
                                )}
                            </Button>
                        );
                    }

                    return (
                        <Button
                            key={index}
                            asChild
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                        >
                            <Link href={link.url} preserveScroll>
                                {isPrevious && (
                                    <ChevronLeft className="mr-1 size-3.5" />
                                )}
                                <span dangerouslySetInnerHTML={{ __html: label }} />
                                {isNext && (
                                    <ChevronRight className="ml-1 size-3.5" />
                                )}
                            </Link>
                        </Button>
                    );
                })}
            </nav>
        </div>
    );
}
