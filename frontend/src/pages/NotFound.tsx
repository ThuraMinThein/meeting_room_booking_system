import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { useNavigate } from "react-router-dom";

const NotFound = () => {

    const navigate = useNavigate();

    return (
        <Empty>
            <EmptyHeader>
                <EmptyTitle>404 - Not Found</EmptyTitle>
                <EmptyDescription>
                    The page you're looking for doesn't exist.
                    Please go back to home page
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button onClick={() => navigate("/")}>Back to Home</Button>
            </EmptyContent>
        </Empty>
    )
}

export default NotFound;