"use client"

import { useQuery } from "convex/react";
import { redirect } from "next/navigation";
import router from "next/router";
import { createContext, useContext } from "react";
import { api } from "~/convex/_generated/api";
import { tryCatch, tryCatchSync } from "~/lib/utils";
import type { Recipe } from "~/types/recipe";

const RecipeListContext = createContext<Recipe[] | undefined>(undefined);

export function RecipeContextProvider({ children }: { children: React.ReactNode }) {

    const { data: recipes, error } = tryCatchSync(() => useQuery(api.recipes.listRecipes));

    if (error) {
        if (error instanceof Error && error.message.includes("Not authenticated")) {
            redirect("/");
        }
        console.error(error);
        throw error;
    }

    return (
        <RecipeListContext.Provider value={recipes}>
            {children}
        </RecipeListContext.Provider>
    );
}

export function useUserRecipes() {
    return useContext(RecipeListContext);
}