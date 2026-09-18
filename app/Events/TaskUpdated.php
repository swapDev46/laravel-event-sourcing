<?php

namespace App\Events;

use App\Enums\TaskPriority;
use App\Models\Task;
use App\States\TaskState;
use Thunk\Verbs\Attributes\Autodiscovery\StateId;
use Thunk\Verbs\Event;

class TaskUpdated extends Event
{
    #[StateId(TaskState::class)]
    public int $task_id;

    public string $title;

    public ?string $description = null;

    public TaskPriority $priority;

    public ?string $due_date = null;

    public function handle(): void
    {
        Task::query()
            ->whereKey($this->task_id)
            ->update([
                'title' => $this->title,
                'description' => $this->description,
                'priority' => $this->priority,
                'due_date' => $this->due_date,
            ]);
    }

    public function apply(TaskState $state): void
    {
        $state->title = $this->title;
        $state->description = $this->description;
        $state->priority = $this->priority;
        $state->due_date = $this->due_date;
    }
}
