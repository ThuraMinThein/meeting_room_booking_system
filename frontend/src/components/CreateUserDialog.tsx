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
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import type { Role } from "@/hooks/useRole";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    onSubmit: (payload: {
        name: string;
        userName: string;
        password: string;
        role: Role;
    }) => Promise<void>;

};

export function CreateUserDialog({
    open,
    onOpenChange,
    onSubmit,
}: Props) {
    const [name, setName] = useState("");
    const [isLoading] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role>("User");

    const [error, setError] = useState<string>();

    const handleCreate = async () => {
        setError(undefined);

        await onSubmit({
            name,
            userName,
            password,
            role
        });

        onOpenChange(false);

        setName("");
        setUserName("");
        setPassword("");
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
                        Create User
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Name</Label>

                        <Input
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Username</Label>

                        <Input
                            value={userName}
                            onChange={(e) =>
                                setUserName(
                                    e.target.value
                                )
                            }
                            required
                            placeholder="johndoe"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Password</Label>

                        <Input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            required
                            placeholder="••••••••"
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

                {isLoading && (
                    <p className="text-sm text-muted-foreground">
                        Loading existing
                        Users <Spinner />
                    </p>
                )}

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
                        Create User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}