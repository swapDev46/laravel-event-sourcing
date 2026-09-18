<?php

namespace App\Actions\Tasks;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Events\TaskUpdated;
use App\Models\Task;

class UpdateTask
{
    public function __construct(
        private readonly ChangeTaskStatus $changeTaskStatus,
    ) {}

    /**
     * Update an existing task.
     *
     * @param  array{title: string, description?: ?string, status: string|TaskStatus, priority: string|TaskPriority, due_date?: ?string}  $data
     */
    public function handle(Task $task, array $data): Task
    {
        $priority = is_string($data['priority'])
            ? TaskPriority::from($data['priority'])
            : $data['priority'];

        $extraAttributes = [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'priority' => $priority,
            'due_date' => $data['due_date'] ?? null,
        ];

        TaskUpdated::fire(
            task_id: $task->id,
            title: $data['title'],
            description: $data['description'] ?? null,
            priority: $priority,
            due_date: $data['due_date'] ?? null,
        );

        return $this->changeTaskStatus->handle(
            $task,
            $data['status'],
            $extraAttributes
        );
    }
}
