export type UserStatus = 'active' | 'inactive';

export type UserItem = {
    id: number;
    name: string;
    email: string;
    designation: string | null;
    status: UserStatus;
    created_at: string;
    updated_at: string;
};

export type UserFilters = {
    search?: string;
    status?: string;
    sort?: 'asc' | 'desc';
};
