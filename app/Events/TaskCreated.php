<?php

namespace App\Events;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Models\Task;
use App\States\TaskState;
use Thunk\Verbs\Attributes\Autodiscovery\StateId;
use Thunk\Verbs\Event;

class TaskCreated extends Event
{
    #[StateId(TaskState::class)]
    public int $task_id;

    public int $user_id;

    public string $title;

    public ?string $description = null;

    public TaskStatus $status;

    public TaskPriority $priority;

    public ?string $due_date = null;

    public ?string $completed_at = null;

    public function apply(TaskState $state): void
    {
        $state->user_id = $this->user_id;
        $state->title = $this->title;
        $state->description = $this->description;
        $state->status = $this->status;
        $state->priority = $this->priority;
        $state->due_date = $this->due_date;
        $state->completed_at = $this->completed_at;
        $state->deleted = false;
    }

    // public function handle(): void
    // {
    //     Task::create([
    //         'id' => $this->task_id,
    //         'user_id' => $this->user_id,
    //         'title' => $this->title,
    //         'description' => $this->description,
    //         'status' => $this->status,
    //         'priority' => $this->priority,
    //         'due_date' => $this->due_date,
    //         'completed_at' => $this->completed_at,
    //     ]);
    // }
}
