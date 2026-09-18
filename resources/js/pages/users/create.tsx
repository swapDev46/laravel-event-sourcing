import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import { index, store } from '@/routes/users';
import type { UserStatus } from '@/types';

export default function UserCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        designation: '',
        status: 'active' as UserStatus,
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <>
            <Head title="Create User" />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Back button */}
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                        <Link href={index.url()}>
                            <ArrowLeft className="size-4" />
                            Back to Users
                        </Link>
                    </Button>
                </div>

                <Card className="border-sidebar-border/70 shadow-xs">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-2 text-primary">
                            <UserPlus className="size-5" />
                            <CardTitle className="text-xl">Create New User</CardTitle>
                        </div>
                        <CardDescription>
                            Add a new team member with their name, email, designation, and status.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">
                                    Full Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g. Jane Doe"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className={
                                        errors.name
                                            ? 'border-destructive focus-visible:ring-destructive/20'
                                            : ''
                                    }
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Email Address <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="e.g. jane@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    className={
                                        errors.email
                                            ? 'border-destructive focus-visible:ring-destructive/20'
                                            : ''
                                    }
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Designation */}
                            <div className="grid gap-2">
                                <Label htmlFor="designation">Designation</Label>
                                <Input
                                    id="designation"
                                    name="designation"
                                    placeholder="e.g. Senior Software Engineer"
                                    value={data.designation}
                                    onChange={(e) => setData('designation', e.target.value)}
                                    className={
                                        errors.designation
                                            ? 'border-destructive focus-visible:ring-destructive/20'
                                            : ''
                                    }
                                />
                                <InputError message={errors.designation} />
                            </div>

                            {/* Status */}
                            <div className="grid gap-2">
                                <Label htmlFor="status">
                                    User Status <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(val) => setData('status', val as UserStatus)}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                                <p className="text-xs text-muted-foreground">
                                    Active users are granted access to the system. Inactive accounts are suspended.
                                </p>
                            </div>

                            {/* Password (optional) */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password (Optional)</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Leave empty to use default: password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={
                                        errors.password
                                            ? 'border-destructive focus-visible:ring-destructive/20'
                                            : ''
                                    }
                                />
                                <InputError message={errors.password} />
                                <p className="text-xs text-muted-foreground">
                                    If left blank, the user will be initialized with the temporary password: <code>password</code>.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-sidebar-border/70">
                                <Button variant="outline" asChild disabled={processing}>
                                    <Link href={index.url()}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                                    Create User
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

UserCreate.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Users',
            href: index(),
        },
        {
            title: 'Create User',
            href: '#',
        },
    ],
};
