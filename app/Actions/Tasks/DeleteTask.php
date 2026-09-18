<?php

namespace App\Actions\Tasks;

use App\Events\TaskDeleted;
use App\Models\Task;

class DeleteTask
{
    public function handle(Task $task): bool
    {
        TaskDeleted::fire(
            task_id: $task->id,
        );

        return true;
    }
}
