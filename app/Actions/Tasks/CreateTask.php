<?php

namespace App\Actions\Tasks;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Events\TaskCreated;
use App\Models\Task;
use App\Models\User;

class CreateTask
{
    /**
     * Create a new task assigned to the user.
     *
     * @param  array{title: string, description?: ?string, status?: string|TaskStatus, priority?: string|TaskPriority, due_date?: ?string}  $data
     */
    public function handle(User $user, array $data): Task
    {
        $status = isset($data['status'])
            ? (is_string($data['status']) ? TaskStatus::from($data['status']) : $data['status'])
            : TaskStatus::Todo;

        $priority = isset($data['priority'])
            ? (is_string($data['priority']) ? TaskPriority::from($data['priority']) : $data['priority'])
            : TaskPriority::Medium;

        $completedAt = $status === TaskStatus::Done ? now() : null;

        $task = $user->tasks()->create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => $status,
            'priority' => $priority,
            'due_date' => $data['due_date'] ?? null,
            'completed_at' => $completedAt,
        ]);

        TaskCreated::fire(
            task_id: $task->id,
            user_id: $user->id,
            title: $task->title,
            description: $task->description,
            status: $task->status,
            priority: $task->priority,
            due_date: $task->due_date?->format('Y-m-d'),
            completed_at: $task->completed_at?->toISOString(),
        );

        return $task;
    }
}
