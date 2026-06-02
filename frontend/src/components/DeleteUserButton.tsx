import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

type DeleteUserButtonProps = {
    userId: string;
    type: "text" | "icon";
    onDelete: (id: string) => void;
};

export default function DeleteUserButton({
    userId,
    onDelete,
    type,
}: DeleteUserButtonProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                >
                    {type === "icon" ? <Trash2 className="h-4 w-4" /> :
                        <Label className="text-red-500">Delete</Label>
                    }
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete User
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction className="bg-red-600 hover:bg-red-800"
                        onClick={() =>
                            onDelete(userId)
                        }
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}