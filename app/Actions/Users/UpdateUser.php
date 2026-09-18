<?php

namespace App\Actions\Users;

use App\Enums\UserStatus;
use App\Events\UserUpdated;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UpdateUser
{
    /**
     * Update an existing user.
     *
     * @param  array{name: string, email: string, designation?: ?string, status?: string|UserStatus, password?: ?string}  $data
     */
    public function handle(User $user, array $data): void
    {
        $status = $user->status;

        if (isset($data['status'])) {
            $status = is_string($data['status'])
                ? UserStatus::from($data['status'])
                : $data['status'];
        }
 
        UserUpdated::fire(
            user_id: $user->id,
            name: $data['name'],
            email: $data['email'],
            designation: $data['designation'] ?? null,
            status: $status,
        );
    }
}
