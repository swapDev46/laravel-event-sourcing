<?php

namespace App\States;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Thunk\Verbs\State;

class TaskState extends State
{
    public bool $exists = false;

    public int $user_id;

    public string $title;

    public ?string $description = null;

    public TaskStatus $status;

    public TaskPriority $priority;

    public ?string $due_date = null;

    public ?string $completed_at = null;
}
