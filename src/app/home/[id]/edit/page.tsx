"use client"

import { useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { useParams } from "next/navigation"
import { RecipeForm } from "~/components/recipe-form"
import { LoadingSpinner } from "~/components/ui/loading-spinner"

export default function EditRecipePage() {
  const params = useParams()
  const recipeId = params.id as string

  const recipe = useQuery(api.recipes.getRecipe, { id: recipeId as any })

  if (recipe === undefined) {
    return <LoadingSpinner />
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h1>
          <p className="text-gray-600">The recipe you're trying to edit doesn't exist.</p>
        </div>
      </div>
    )
  }

  return <RecipeForm recipe={recipe} mode="edit" />
}
