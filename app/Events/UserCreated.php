<?php

namespace App\Events;

use App\Models\User;
use App\States\UserState;
use Thunk\Verbs\Attributes\Autodiscovery\StateId;
use Thunk\Verbs\Event;

class UserCreated extends Event
{
    #[StateId(UserState::class)]
    public ?int $user_id = null;

    public string $name;

    public string $email;

    public ?string $designation;

    public string $status;

    public function apply(UserState $state): void
    {
        $state->exists = true;
        $state->name = $this->name;
        $state->email = $this->email;
        $state->designation = $this->designation;
        $state->status = $this->status;
    }

    public function handle(): void
    {
        info($this->user_id);
        info($this->name);
        User::updateOrCreate(
            ['id' => $this->user_id],
            [
                'name' => $this->name,
                'email' => $this->email,
                'designation' => $this->designation,
                'status' => $this->status,
            ]
        );
    }
}