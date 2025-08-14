import { SignOutButton } from "@clerk/nextjs";
import { RecipeContextProvider } from "~/components/RecipeContextProvider";
import { Button } from "~/components/ui/button";


export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <RecipeContextProvider>
            <div className="flex flex-col min-h-screen">
                <div className="flex-grow">
                    {children}
                </div>
                <footer className="flex justify-center items-center p-4">
                <SignOutButton>
                    <Button variant="outline">Sign out</Button>
                </SignOutButton>
            </footer>
            </div>
        </RecipeContextProvider>
    );
}