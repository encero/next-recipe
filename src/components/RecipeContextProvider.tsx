"use client"

import { useQuery } from "convex/react";
import { createContext, useContext } from "react";
import { api } from "~/convex/_generated/api";
import type { Recipe } from "~/types/recipe";

const RecipeListContext = createContext<Recipe[] | undefined>(undefined);

export function RecipeContextProvider({ children }: { children: React.ReactNode }) {

    const recipes = useQuery(api.recipes.listRecipes);

    return (
        <RecipeListContext.Provider value={recipes}>
            {children}
        </RecipeListContext.Provider>
    );
}

export function useUserRecipes() {
    return useContext(RecipeListContext);
}