# 🚀 Laravel Event Sourcing with Verbs

A demo app showcasing **Event Sourcing** in Laravel using [Laravel Verbs](https://verbs.thunk.dev).

> Instead of directly mutating the database, every action fires an **event**. The database is rebuilt by replaying those events.

---

## 🧠 How It Works

### The Old Way (Direct CRUD)
```
Request → Controller → Model::create() → Database
```

### The Event Sourcing Way (With Verbs)
```
Request → Action → Event::fire() → apply() updates State → handle() writes to Database
```

The **event log** (`verb_events` table) is the source of truth. The `users` and `tasks` tables are just **projections** — read-optimized views that can be destroyed and rebuilt anytime.

---

## 🗂️ Project Structure

```
app/
├── Actions/
│   ├── Users/          # CreateUser, UpdateUser, DeleteUser, ToggleUserStatus
│   └── Tasks/          # CreateTask, UpdateTask, DeleteTask
├── Events/             # Verbs events (UserCreated, TaskUpdated, etc.)
├── States/             # Verbs states (UserState, TaskState)
├── Models/             # Eloquent models (User, Task)
└── Http/Controllers/   # Controllers delegate to Actions
```

---

## 🔄 The Flow

### 1. Action fires an Event

```php
// CreateUser.php — No direct DB write!
UserCreated::fire(
    name: $data['name'],
    email: $data['email'],
    status: $status->value,
);
```

### 2. `apply()` updates the State

```php
// UserCreated.php
public function apply(UserState $state): void
{
    $state->exists = true;
    $state->name = $this->name;
    $state->email = $this->email;
    $state->status = $this->status;
}
```

### 3. `handle()` writes to the database (Projection)

```php
// UserCreated.php
public function handle(): void
{
    User::updateOrCreate(
        ['id' => $this->user_id],
        ['name' => $this->name, 'email' => $this->email, ...]
    );
}
```

---

## ✨ Key Concepts

| Concept | What it does |
|---------|-------------|
| **Event** | Records *what happened* (past tense: `UserCreated`, `TaskDeleted`) |
| **State** | Holds the *current state* reconstructed from all events |
| **`apply()`** | Mutates the State when an event fires |
| **`handle()`** | Writes to the database (the projection/read model) |
| **`#[StateId]`** | Links an event property to its State class |
| **`::fire()`** | Fires an event without committing immediately |
| **`::commit()`** | Fires and immediately commits the event |

---

## 🧪 Try It — The Replay Magic

This is the fun part. You can **destroy your data** and **rebuild it from events**.

### Step 1: Create some data
```
- Register an account
- Create a few users and tasks
```

### Step 2: Check the database
```bash
php artisan tinker --execute 'echo "Users: " . \App\Models\User::count() . " | Tasks: " . \App\Models\Task::count();'
```

### Step 3: Truncate the tables
```bash
php artisan tinker --execute 'DB::table("tasks")->truncate(); DB::table("users")->delete();'
```

### Step 4: Verify data is gone
```bash
php artisan tinker --execute 'echo "Users: " . \App\Models\User::count() . " | Tasks: " . \App\Models\Task::count();'
# Users: 0 | Tasks: 0
```

### Step 5: Replay events — data is back! 🎉
```bash
php artisan verbs:replay
```

```bash
php artisan tinker --execute 'echo "Users: " . \App\Models\User::count() . " | Tasks: " . \App\Models\Task::count();'
# Users: X | Tasks: Y  (restored from event history)
```

---

## 🐳 Quick Setup

### Prerequisites
- Docker
- PHP 8.3+

### 1. Clone & Install
```bash
git clone <repo-url>
cd laravel-event-sourcing
composer install
```

### 2. Start MySQL Container
```bash
docker compose up -d
```

### 3. Configure Environment
```bash
cp .env.example .env
php artisan key:generate
```

> `.env.example` is pre-configured for the Docker MySQL on port `3307`.

### 4. Migrate & Build
```bash
php artisan migrate
npm install && npm run build
```

### 5. Run the App
```bash
composer run dev
```

Visit `http://localhost:8000`, register, and start creating users/tasks.

---

## 📦 Packages Used

- **[hirethunk/verbs](https://verbs.thunk.dev)** — Event Sourcing for Laravel
- **Laravel 13** — The framework
- **Inertia + React** — Frontend
- **Pest** — Testing

---

## 📁 Event Storage

Verbs stores events in three tables:

| Table | Purpose |
|-------|---------|
| `verb_events` | The event history (source of truth) |
| `verb_state_events` | Links events to their States |
| `verb_snapshots` | Cached state snapshots for performance |

These tables are **never truncated** during replay — they are the permanent record.

---

## 📚 Learn More

- [Verbs Documentation](https://verbs.thunk.dev)
- [Verbs GitHub](https://github.com/hirethunk/verbs)
- [Event Sourcing Explained](https://verbs.thunk.dev/docs/reference/event-sourcing)
