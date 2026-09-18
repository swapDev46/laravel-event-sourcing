<?php

namespace App\Actions\Users;

use App\Enums\UserStatus;
use App\Events\UserCreated;
use App\Models\User;
use Glhd\Bits\Snowflake;
use Illuminate\Support\Facades\Hash;

class CreateUser
{
    /**
     * Create a new user.
     *
     * @param  array{name: string, email: string, designation?: ?string, status?: string|UserStatus, password?: ?string}  $data
     */
        public function handle(array $data): void
        {
            $status = isset($data['status'])
                ? (is_string($data['status']) ? UserStatus::from($data['status']) : $data['status'])
                : UserStatus::Active;

            UserCreated::fire(
                name: $data['name'],
                email: $data['email'],
                designation: $data['designation'] ?? null,
                status: $status->value,
            );
        }
}
