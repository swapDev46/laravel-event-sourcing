<?php

use App\Enums\UserStatus;
use App\Models\User;

test('guests are redirected to the login page when accessing users', function () {
    $response = $this->get(route('users.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can view the users list', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('users.index'));

    $response->assertOk();
});

test('authenticated users can see create user page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('users.create'));

    $response->assertOk();
});

test('authenticated users can create a new user and are redirected to users index', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('users.store'), [
        'name' => 'John Doe',
        'email' => 'john.doe@example.com',
        'designation' => 'Senior Developer',
        'status' => 'active',
        'password' => 'secret1234',
    ]);

    $response->assertRedirect(route('users.index'));

    $this->assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'john.doe@example.com',
        'designation' => 'Senior Developer',
        'status' => 'active',
    ]);
});

test('creating user validates required fields and unique email', function () {
    $admin = User::factory()->create(['email' => 'existing@example.com']);

    $response = $this->actingAs($admin)->post(route('users.store'), [
        'name' => '',
        'email' => 'existing@example.com',
        'designation' => 'Tester',
        'status' => 'invalid_status',
    ]);

    $response->assertSessionHasErrors(['name', 'email', 'status']);
});

test('authenticated users can see edit user page', function () {
    $admin = User::factory()->create();
    $targetUser = User::factory()->create();

    $response = $this->actingAs($admin)->get(route('users.edit', $targetUser));

    $response->assertOk();
});

test('authenticated users can update a user and are redirected to users index', function () {
    $admin = User::factory()->create();
    $targetUser = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
        'designation' => 'Junior Dev',
        'status' => 'active',
    ]);

    $response = $this->actingAs($admin)->put(route('users.update', $targetUser), [
        'name' => 'New Name',
        'email' => 'new@example.com',
        'designation' => 'Lead Architect',
        'status' => 'inactive',
    ]);

    $response->assertRedirect(route('users.index'));

    $this->assertDatabaseHas('users', [
        'id' => $targetUser->id,
        'name' => 'New Name',
        'email' => 'new@example.com',
        'designation' => 'Lead Architect',
        'status' => 'inactive',
    ]);
});

test('authenticated users can toggle a user status', function () {
    $admin = User::factory()->create();
    $targetUser = User::factory()->create([
        'status' => UserStatus::Active,
    ]);

    $response = $this->actingAs($admin)->patch(route('users.toggle-status', $targetUser));

    $response->assertRedirect();

    $targetUser->refresh();
    expect($targetUser->status)->toBe(UserStatus::Inactive);

    // Toggle back
    $response = $this->actingAs($admin)->patch(route('users.toggle-status', $targetUser));
    $response->assertRedirect();

    $targetUser->refresh();
    expect($targetUser->status)->toBe(UserStatus::Active);
});

test('authenticated users can delete another user and are redirected to users index', function () {
    $admin = User::factory()->create();
    $targetUser = User::factory()->create();

    $response = $this->actingAs($admin)->delete(route('users.destroy', $targetUser));

    $response->assertRedirect(route('users.index'));
    $this->assertDatabaseMissing('users', ['id' => $targetUser->id]);
});

test('a user cannot delete their own account via user crud', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->delete(route('users.destroy', $admin));

    $response->assertForbidden();
    $this->assertDatabaseHas('users', ['id' => $admin->id]);
});
