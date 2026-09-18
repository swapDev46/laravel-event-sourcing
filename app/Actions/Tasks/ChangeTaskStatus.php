<?php

namespace App\Actions\Tasks;

use App\Enums\TaskStatus;
use App\Events\TaskStatusChanged;
use App\Models\Task;

class ChangeTaskStatus
{
    public function handle(
        Task $task,
        TaskStatus|string $status,
        array $extraAttributes = []
    ): Task {
        $newStatus = is_string($status)
            ? TaskStatus::from($status)
            : $status;

        $previousStatus = $task->status;

        $completedAt = $task->completed_at;

        if ($newStatus === TaskStatus::Done && $previousStatus !== TaskStatus::Done) {
            $completedAt = now();
        } elseif ($newStatus !== TaskStatus::Done && $previousStatus === TaskStatus::Done) {
            $completedAt = null;
        }

        TaskStatusChanged::fire(
            task_id: $task->id,
            from: $previousStatus,
            to: $newStatus,
            completed_at: $completedAt?->toISOString(),
        );

        return Task::findOrFail($task->id);
    }
}
