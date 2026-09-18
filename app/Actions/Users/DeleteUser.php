<?php

namespace App\Actions\Users;

use App\Events\UserDeleted;
use App\Models\User;

class DeleteUser
{
    /**
     * Delete a user.
     */
    public function handle(User $user): void
    {
        UserDeleted::fire(user_id: $user->id);
    }
}
