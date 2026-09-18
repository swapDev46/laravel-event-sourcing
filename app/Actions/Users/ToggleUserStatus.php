<?php

namespace App\Actions\Users;

use App\Events\UserStatusChanged;
use App\Enums\UserStatus;
use App\Models\User;

class ToggleUserStatus
{
    /**
     * Toggle the status of a user between active and inactive.
     */
    public function handle(User $user): User
    {
        $newStatus = $user->status === UserStatus::Active ? UserStatus::Inactive : UserStatus::Active;

        UserStatusChanged::fire(
            user_id: $user->id,
            status: $newStatus,
        );

        // $user->update(['status' => $newStatus]);

        return $user;
    }
}
