import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import type { Role } from "@/hooks/useRole";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import type { User } from "@/api/users";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | undefined;
    onSubmit: (payload: {
        userId: string;
        role: Role;
    }) => Promise<void>;

};

export function UpdateUserDialog({
    open,
    user,
    onOpenChange,
    onSubmit,
}: Props) {

    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState<Role | undefined>();

    useEffect(() => {
        if (open && user) {
            setName(user.name);
            setUserName(user.userName);
            setRole(user.role);
        }
    }, [open, user]);

    const [error, setError] = useState<string>();

    const handleCreate = async () => {
        setError(undefined);

        if (!user) {
            setError("User not found");
            return
        }

        if (role === user?.role) {
            setError("User is already assigned to this role");
            return
        }

        await onSubmit({
            userId: user.id!,
            role: role!,
        });

        onOpenChange(false);

        setName("");
        setUserName("");
        setRole("User");
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Update User Role
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Name</Label>

                        <Input
                            value={name} disabled
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Username</Label>

                        <Input
                            value={userName}
                            disabled
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Role</Label>

                        <Select
                            value={role}
                            onValueChange={(value) => setRole(value as Role)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>

                            <SelectContent >
                                <SelectGroup>
                                    <SelectLabel>Roles</SelectLabel>
                                    <SelectItem value={"User"}>User</SelectItem>
                                    <SelectItem value={"Admin"}>Admin</SelectItem>
                                    <SelectItem value={"Owner"}>Owner</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() =>
                            onOpenChange(
                                false
                            )
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={
                            handleCreate
                        }
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}