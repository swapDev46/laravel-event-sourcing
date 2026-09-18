<?php

namespace App\Events;

use App\Enums\TaskStatus;
use App\Models\Task;
use App\States\TaskState;
use Thunk\Verbs\Attributes\Autodiscovery\StateId;
use Thunk\Verbs\Event;

class TaskStatusChanged extends Event
{
    #[StateId(TaskState::class)]
    public int $task_id;

    public TaskStatus $from;

    public TaskStatus $to;

    public ?string $completed_at = null;

    public function handle(): void
    {
        Task::query()
            ->whereKey($this->task_id)
            ->update([
                'status' => $this->to,
                'completed_at' => $this->completed_at,
            ]);
    }

    public function apply(TaskState $state): void
    {
        $state->status = $this->to;
        $state->completed_at = $this->completed_at;
    }
}
