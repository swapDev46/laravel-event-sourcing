<?php

namespace App\States;

use Thunk\Verbs\State;

class UserState extends State
{
    public bool $exists = false;

    public ?string $name = null;

    public ?string $email = null;

    public ?string $designation = null;

    public ?string $status = null;
}
