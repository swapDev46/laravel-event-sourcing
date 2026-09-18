<?php

namespace App\Actions\Tasks;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Events\TaskStatusChanged;
use App\Events\TaskUpdated;
use App\Models\Task;

class UpdateTask
{
    /**
     * Update an existing task.
     *
     * @param  array{title: string, description?: ?string, status: string|TaskStatus, priority: string|TaskPriority, due_date?: ?string}  $data
     */
    public function handle(Task $task, array $data): void
    {
        $priority = is_string($data['priority'])
            ? TaskPriority::from($data['priority'])
            : $data['priority'];

        TaskUpdated::fire(
            task_id: $task->id,
            title: $data['title'],
            description: $data['description'] ?? null,
            priority: $priority,
            due_date: $data['due_date'] ?? null,
        );

        $newStatus = is_string($data['status'])
            ? TaskStatus::from($data['status'])
            : $data['status'];

        if ($newStatus !== $task->status) {
            $completedAt = $task->completed_at;

            if ($newStatus === TaskStatus::Done && $task->status !== TaskStatus::Done) {
                $completedAt = now();
            } elseif ($newStatus !== TaskStatus::Done && $task->status === TaskStatus::Done) {
                $completedAt = null;
            }

            TaskStatusChanged::fire(
                task_id: $task->id,
                from: $task->status,
                to: $newStatus,
                completed_at: $completedAt?->toISOString(),
            );
        }
    }
}
