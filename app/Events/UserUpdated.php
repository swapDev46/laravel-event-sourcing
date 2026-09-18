<?php

namespace App\Events;

use App\Models\User;
use App\States\UserState;
use Thunk\Verbs\Attributes\Autodiscovery\StateId;
use Thunk\Verbs\Event;

class UserUpdated extends Event
{
    #[StateId(UserState::class)]
    public int $user_id;

    public string $name;

    public string $email;

    public ?string $designation;

    public ?string $status;

    public function apply(UserState $state): void
    {
        $state->name = $this->name;
        $state->email = $this->email;
        $state->designation = $this->designation;

        if ($this->status !== null) {
            $state->status = $this->status;
        }
    }

    public function handle(): void
    {
        User::whereKey($this->user_id)->update([
            'name' => $this->name,
            'email' => $this->email,
            'designation' => $this->designation,
            ...($this->status !== null
                ? ['status' => $this->status]
                : []),
        ]);
    }
}
