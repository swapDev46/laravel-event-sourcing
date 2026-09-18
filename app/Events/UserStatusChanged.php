<?php

namespace App\Events;

use App\Models\User;
use App\States\UserState;
use Thunk\Verbs\Attributes\Autodiscovery\StateId;
use Thunk\Verbs\Event;

class UserStatusChanged extends Event
{
    #[StateId(UserState::class)]
    public int $user_id;

    public string $status;

    public function apply(UserState $state): void
    {
        $state->status = $this->status;
    }

    public function handle(): void
    {
        User::whereKey($this->user_id)->update([
            'status' => $this->status,
        ]);
    }
}
