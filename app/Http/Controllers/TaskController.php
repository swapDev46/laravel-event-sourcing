<?php

namespace App\Http\Controllers;

use App\Actions\Tasks\CreateTask;
use App\Actions\Tasks\DeleteTask;
use App\Actions\Tasks\UpdateTask;
use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Http\Requests\Tasks\StoreTaskRequest;
use App\Http\Requests\Tasks\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks for the authenticated user.
     */
    public function index(Request $request): Response
    {
        $query = $request->user()->tasks();

        if ($request->filled('search')) {
            $search = (string) $request->input('search');
            $query->where('title', 'like', "%{$search}%");
        }

        if ($request->filled('status')) {
            $status = (string) $request->input('status');
            if (TaskStatus::tryFrom($status)) {
                $query->where('status', $status);
            }
        }

        if ($request->filled('priority')) {
            $priority = (string) $request->input('priority');
            if (TaskPriority::tryFrom($priority)) {
                $query->where('priority', $priority);
            }
        }

        $sortDirection = $request->input('sort') === 'asc' ? 'asc' : 'desc';

        $tasks = $query->orderBy('created_at', $sortDirection)
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'priority' => $request->input('priority', ''),
                'sort' => $sortDirection,
            ],
        ]);
    }

    /**
     * Show the form for creating a new task.
     */
    public function create(): Response
    {
        return Inertia::render('tasks/create');
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(StoreTaskRequest $request, CreateTask $createTask): RedirectResponse
    {
        $task = $createTask->handle($request->user(), $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Task created successfully.'),
        ]);

        return to_route('tasks.show', $task);
    }

    /**
     * Display the specified task.
     */
    public function show(Task $task): Response
    {
        Gate::authorize('view', $task);

        return Inertia::render('tasks/show', [
            'task' => $task->load('user:id,name,email'),
        ]);
    }

    /**
     * Show the form for editing the specified task.
     */
    public function edit(Task $task): Response
    {
        Gate::authorize('update', $task);

        return Inertia::render('tasks/edit', [
            'task' => $task,
        ]);
    }

    /**
     * Update the specified task in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task, UpdateTask $updateTask): RedirectResponse
    {
        Gate::authorize('update', $task);

        $updateTask->handle($task, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Task updated successfully.'),
        ]);

        return to_route('tasks.show', $task);
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Task $task, DeleteTask $deleteTask): RedirectResponse
    {
        Gate::authorize('delete', $task);

        $deleteTask->handle($task);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Task deleted successfully.'),
        ]);

        return to_route('tasks.index');
    }
}
