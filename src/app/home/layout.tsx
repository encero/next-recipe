import { RecipeContextProvider } from "~/components/RecipeContextProvider";


export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <RecipeContextProvider>
            {children}
        </RecipeContextProvider>
    );
}