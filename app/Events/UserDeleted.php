<?php

namespace App\Events;

use App\Models\User;
use App\States\UserState;
use Thunk\Verbs\Attributes\Autodiscovery\StateId;
use Thunk\Verbs\Event;

class UserDeleted extends Event
{
    #[StateId(UserState::class)]
    public int $user_id;

    public function apply(UserState $state): void
    {
        $state->exists = false;
    }

    public function handle(): void
    {
        User::whereKey($this->user_id)->delete();
    }
}
