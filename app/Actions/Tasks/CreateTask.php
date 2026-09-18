<?php

namespace App\Actions\Tasks;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Events\TaskCreated;
use App\Models\User;

class CreateTask
{
    /**
     * Create a new task assigned to the user.
     *
     * @param  array{title: string, description?: ?string, status?: string|TaskStatus, priority?: string|TaskPriority, due_date?: ?string}  $data
     */
    public function handle(User $user, array $data): void
    {
        $status = isset($data['status'])
            ? (is_string($data['status']) ? TaskStatus::from($data['status']) : $data['status'])
            : TaskStatus::Todo;

        $priority = isset($data['priority'])
            ? (is_string($data['priority']) ? TaskPriority::from($data['priority']) : $data['priority'])
            : TaskPriority::Medium;

        $completedAt = $status === TaskStatus::Done ? now() : null;

        TaskCreated::fire(
            user_id: $user->id,
            title: $data['title'],
            description: $data['description'] ?? null,
            status: $status,
            priority: $priority,
            due_date: $data['due_date'] ?? null,
            completed_at: $completedAt?->toISOString(),
        );
    }
}
