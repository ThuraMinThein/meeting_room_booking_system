import type { User } from "@/api/users";
import { CreateUserDialog } from "@/components/CreateUserDialog";
import DeleteUserButton from "@/components/DeleteUserButton";
import TableSkeleton from "@/components/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UpdateUserDialog } from "@/components/UpdateUserDialog";
import { useDebounce } from "@/hooks/useBounce";
import type { Role } from "@/hooks/useRole";
import { useCreateUser, useDeleteUser, useGetUsersPaginated, useUpdateUserRole } from "@/hooks/useUser";
import { MoreHorizontal, Plus, Users2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const Users = () => {
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [roles, setRoles] = useState<Role[] | undefined>();
    const debouncedSearch = useDebounce(searchInput, 500);
    const [selectedUser, setSelectedUser] = useState<User>();

    const anchor = useComboboxAnchor();
    const { data, isError, isPending } = useGetUsersPaginated({ page, limit: 12, search: debouncedSearch, roles });
    const { mutate: createUser } = useCreateUser();
    const { mutate: updateUserRole } = useUpdateUserRole();
    const { mutate: deleteUser } = useDeleteUser();

    const handleCreateUser = useCallback(
        (user: User) => createUser(user),
        [createUser]
    );

    const handleUpdateUserRole = useCallback(
        (id: string, role: Role) => updateUserRole({ id, role }),
        [updateUserRole]
    );

    const handleDeleteUser = useCallback(
        (id: string) => deleteUser(id),
        [deleteUser]
    );

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, roles]);

    if (isError) {
        return (
            <Empty >
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Users2 />
                    </EmptyMedia>
                    <EmptyTitle>Error Loading Users</EmptyTitle>
                </EmptyHeader>
            </Empty>
        )
    }

    if (!data && !isPending) {
        return (
            <Empty >
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Users2 />
                    </EmptyMedia>
                    <EmptyTitle>No Users Yet</EmptyTitle>
                    <EmptyDescription>
                        Create your first User
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="flex-row justify-center gap-2">
                    <Button onClick={() => setOpenCreate(true)}>Create User</Button>
                </EmptyContent>
            </Empty>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Users
                    </h1>

                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <Input
                        placeholder="Search users..."
                        value={searchInput}
                        onChange={(e) =>
                            setSearchInput(e.target.value)
                        }
                        className="md:max-w-sm"
                    />

                    <Combobox
                        multiple
                        autoHighlight
                        onValueChange={setRoles}
                        items={['User', 'Owner', 'Admin']}
                        defaultValue={roles}
                    >
                        <ComboboxChips ref={anchor} className="w-full">
                            <ComboboxValue>
                                {(values) => (
                                    <>
                                        {values.map((value: string) => (
                                            <ComboboxChip key={value}>{value}</ComboboxChip>
                                        ))}
                                        <ComboboxChipsInput placeholder="Roles" />
                                    </>
                                )}
                            </ComboboxValue>
                        </ComboboxChips>
                        <ComboboxContent anchor={anchor}>
                            <ComboboxEmpty>No items found.</ComboboxEmpty>
                            <ComboboxList>
                                {(item) => (
                                    <ComboboxItem key={item} value={item}>
                                        {item}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                    <Button className="w-full sm:w-auto" onClick={() => setOpenCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create User
                    </Button>
                </div>
            </div>

            <CreateUserDialog
                open={openCreate}
                onOpenChange={setOpenCreate}
                onSubmit={async (payload) => { handleCreateUser(payload) }}
            />

            {selectedUser && (
                <UpdateUserDialog
                    open={openUpdate}
                    onOpenChange={setOpenUpdate}
                    user={selectedUser}
                    onSubmit={async (payload) => { handleUpdateUserRole(payload.userId, payload.role) }
                    }
                />
            )}

            <Card>
                <CardHeader>
                    <CardTitle>User List</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="hidden md:block">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>User Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Updated At</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {isPending ? (
                                    <TableSkeleton />
                                ) : (

                                    <TableBody>
                                        {data.items.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">
                                                    {user.name}
                                                </TableCell>

                                                <TableCell>
                                                    {user.userName}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge>{user.role}</Badge>
                                                </TableCell>

                                                <TableCell>
                                                    {new Date(user.createdAt!).toLocaleDateString()}
                                                </TableCell>

                                                <TableCell>
                                                    {new Date(user.updatedAt!).toLocaleDateString()}
                                                </TableCell>

                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <MoreHorizontal />
                                                            </Button>
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => {
                                                                setSelectedUser(user);
                                                                setOpenUpdate(true);
                                                            }} className="flex justify-center">
                                                                Update Role
                                                            </DropdownMenuItem>
                                                            <DeleteUserButton
                                                                userId={user.id!}
                                                                onDelete={(id: string) =>
                                                                    handleDeleteUser(id)
                                                                }
                                                                type="text"
                                                            />
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                )}
                            </Table>
                        </div>
                    </div>

                    <div className="space-y-4 md:hidden">
                        {data?.items.map((user) => (
                            <Card key={user.id}>
                                <CardContent className="space-y-4 pt-6">
                                    <div className="flex items-start justify-between space-y-2">
                                        <div>
                                            <h3 className="font-semibold">
                                                {user.name}
                                            </h3>

                                            <p className="text-sm text-muted-foreground">
                                                {user.userName}
                                            </p>
                                        </div>

                                        <div>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setOpenUpdate(true);
                                                }}
                                            >
                                                Update
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 text-sm">
                                        <Badge>
                                            {user.role}
                                        </Badge>
                                    </div>
                                    <div className="pt-2">
                                        <DeleteUserButton
                                            userId={user.id!}
                                            onDelete={(id) =>
                                                handleDeleteUser(id)
                                            }
                                            type="icon"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            {data && data?.meta.itemCount * page} of{" "}
                            {data?.meta.totalItems} Users
                        </p>

                        <div className="flex w-full gap-2 sm:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none"
                                disabled={!data?.meta.hasNextPage}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Users;