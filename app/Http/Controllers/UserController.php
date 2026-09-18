<?php

namespace App\Http\Controllers;

use App\Actions\Users\CreateUser;
use App\Actions\Users\DeleteUser;
use App\Actions\Users\ToggleUserStatus;
use App\Actions\Users\UpdateUser;
use App\Enums\UserStatus;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', User::class);

        $query = User::query();

        if ($request->filled('search')) {
            $search = (string) $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('designation', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $status = (string) $request->input('status');
            if (UserStatus::tryFrom($status)) {
                $query->where('status', $status);
            }
        }

        $sortDirection = $request->input('sort') === 'asc' ? 'asc' : 'desc';

        $users = $query->orderBy('created_at', $sortDirection)
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'sort' => $sortDirection,
            ],
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        Gate::authorize('create', User::class);

        return Inertia::render('users/create');
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request, CreateUser $createUser): RedirectResponse
    {
        Gate::authorize('create', User::class);

        $createUser->handle($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('User created successfully.'),
        ]);

        return to_route('users.index');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        Gate::authorize('update', $user);

        return Inertia::render('users/edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user, UpdateUser $updateUser): RedirectResponse
    {
        Gate::authorize('update', $user);

        $updateUser->handle($user, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('User updated successfully.'),
        ]);

        return to_route('users.index');
    }

    /**
     * Toggle the status of the specified user.
     */
    public function toggleStatus(User $user, ToggleUserStatus $toggleUserStatus): RedirectResponse
    {
        Gate::authorize('update', $user);

        $toggleUserStatus->handle($user);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('User status updated successfully.'),
        ]);

        return back();
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user, DeleteUser $deleteUser): RedirectResponse
    {
        Gate::authorize('delete', $user);

        $deleteUser->handle($user);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('User deleted successfully.'),
        ]);

        return to_route('users.index');
    }
}
