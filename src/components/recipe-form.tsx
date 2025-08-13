"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "~/convex/_generated/api"
import type { Recipe } from "~/types/recipe"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Plus, Minus, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Id } from "~/convex/_generated/dataModel"

// Zod validation schema
const recipeFormSchema = z.object({
  recipeName: z.string().min(1, "Recipe name is required"),
  image: z.string().optional(),
  description: z.string().optional(),
  ingredients: z.array(z.object({value: z.string()})),
  instructions: z.array(z.object({value: z.string()})),
  prepTime: z.number().min(0, "Prep time must be 0 or greater"),
  cookTime: z.number().min(0, "Cook time must be 0 or greater"),
  servings: z.number().min(1, "Servings must be at least 1"),
})

type RecipeFormData = z.infer<typeof recipeFormSchema>

interface RecipeFormProps {
  recipe?: Recipe
  mode: "create" | "edit"
}

export function RecipeForm({ recipe, mode }: RecipeFormProps) {
  const router = useRouter()
  const insertRecipe = useMutation(api.recipes.insertRecipe)
  const updateRecipe = useMutation(api.recipes.updateRecipe)

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      recipeName: recipe?.name ?? "",
      image: recipe?.image ?? "",
      description: recipe?.description ?? "",
      ingredients: recipe?.ingredients.map((ingredient) => ({ value: ingredient })) ?? [],
      instructions: recipe?.instructions.map((instruction) => ({ value: instruction })) ?? [],
      prepTime: recipe?.prepTime ?? 0,
      cookTime: recipe?.cookTime ?? 0,
      servings: recipe?.servings ?? 1,
    },
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = form

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  })

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: "instructions",
  })

  const watchedIngredients = watch("ingredients")
  const watchedInstructions = watch("instructions")

  console.log("watchedIngredients", watchedIngredients)
  console.log("watchedInstructions", watchedInstructions)

  const ingredientsCollapsed = watchedIngredients.length === 0
  const instructionsCollapsed = watchedInstructions.length === 0

  const onSubmit = async (data: RecipeFormData) => {
    try {
      // Filter out empty ingredients and instructions
      const cleanedIngredients = data.ingredients.map((item) => item.value).filter((item) => item.trim() !== "")
      const cleanedInstructions = data.instructions.map((item) => item.value).filter((item) => item.trim() !== "")

      if (mode === "create") {
        const recipeId = await insertRecipe({
          name: data.recipeName,
          image: data.image ?? "",
          description: data.description ?? "",
          ingredients: cleanedIngredients,
          instructions: cleanedInstructions,
          prepTime: data.prepTime,
          cookTime: data.cookTime,
          servings: data.servings,
        })

        router.push(`/home/${recipeId}`)
      } else {
        // Edit mode
        if (!recipe?._id) {
          throw new Error("Recipe ID not found")
        }

        await updateRecipe({
          id: recipe._id as Id<"recipes">,
          name: data.recipeName,
          image: data.image ?? "",
          description: data.description ?? "",
          ingredients: cleanedIngredients,
          instructions: cleanedInstructions,
          prepTime: data.prepTime,
          cookTime: data.cookTime,
          servings: data.servings,
        })

        router.push(`/home/${recipe._id}`)
      }
    } catch (error) {
      console.error("Error saving recipe:", error)
      alert("Error saving recipe. Please try again.")
    }
  }

  const addIngredient = () => {
    appendIngredient({value: ""})
  }

  const addInstruction = () => {
    appendInstruction({value: ""})
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" asChild>
          <Link href={mode === "edit" && recipe ? `/home/${recipe._id}` : "/home"}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {mode === "edit" ? "Back to Recipe" : "Back to Recipes"}
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{mode === "create" ? "Add New Recipe" : "Edit Recipe"}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Recipe Name *</Label>
              <Input
                id="name"
                {...register("recipeName")}
                placeholder="Enter recipe name"
                className={errors.recipeName ? "border-red-500" : ""}
              />
              {errors.recipeName && (
                <p className="text-sm text-red-500 mt-1">{errors.recipeName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Brief description of the recipe"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                {...register("image")}
                placeholder="https://example.com/image.jpg (optional)"
                type="url"
                className={errors.image ? "border-red-500" : ""}
              />
              {errors.image && (
                <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="prepTime">Prep Time (min)</Label>
                <Input
                  id="prepTime"
                  type="number"
                  min="0"
                  {...register("prepTime", { valueAsNumber: true })}
                  className={errors.prepTime ? "border-red-500" : ""}
                />
                {errors.prepTime && (
                  <p className="text-sm text-red-500 mt-1">{errors.prepTime.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="cookTime">Cook Time (min)</Label>
                <Input
                  id="cookTime"
                  type="number"
                  min="0"
                  {...register("cookTime", { valueAsNumber: true })}
                  className={errors.cookTime ? "border-red-500" : ""}
                />
                {errors.cookTime && (
                  <p className="text-sm text-red-500 mt-1">{errors.cookTime.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  {...register("servings", { valueAsNumber: true })}
                  className={errors.servings ? "border-red-500" : ""}
                />
                {errors.servings && (
                  <p className="text-sm text-red-500 mt-1">{errors.servings.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        {!ingredientsCollapsed && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ingredients</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {ingredientFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    {...register(`ingredients.${index}.value` as const)}
                    placeholder={`Ingredient ${index + 1}`}
                    className={`flex-1 ${errors.ingredients?.[index] ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                    className="px-3"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {errors.ingredients && (
                <p className="text-sm text-red-500 mt-1">At least one ingredient is required</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!instructionsCollapsed && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Instructions</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {instructionFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1">
                    {index + 1}
                  </div>
                  <Textarea
                    {...register(`instructions.${index}.value` as const)}
                    placeholder={`Step ${index + 1} instructions`}
                    rows={2}
                    className={`flex-1 ${errors.instructions?.[index] ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeInstruction(index)}
                    className="px-3 mt-1"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {errors.instructions && (
                <p className="text-sm text-red-500 mt-1">At least one instruction is required</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Toggle Buttons for Hidden Sections */}
        <div className="flex gap-4 justify-center">
          {ingredientsCollapsed && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                addIngredient();
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Ingredients
            </Button>
          )}
          {instructionsCollapsed && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                addInstruction();
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Instructions
            </Button>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={mode === "edit" && recipe ? `/home/${recipe._id}` : "/home"}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600">
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving..." : mode === "create" ? "Create Recipe" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
