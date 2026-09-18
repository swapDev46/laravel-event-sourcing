<?php

namespace App\Events;

use App\Models\Task;
use App\States\TaskState;
use Thunk\Verbs\Attributes\Autodiscovery\StateId;
use Thunk\Verbs\Event;

class TaskDeleted extends Event
{
    #[StateId(TaskState::class)]
    public int $task_id;

    public function apply(TaskState $state): void
    {
        $state->deleted = true;
    }

    public function handle(): void
    {
        Task::query()
            ->whereKey($this->task_id)
            ->delete();
    }
}
