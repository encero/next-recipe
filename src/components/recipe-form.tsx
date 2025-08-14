"use client"

import type React from "react"
import { useRef, useEffect } from "react"

import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { useForm, useStore } from "@tanstack/react-form"
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
  image: z.string(),
  description: z.string(),
  ingredients: z.array(z.object({ value: z.string() })),
  instructions: z.array(z.object({ value: z.string() })),
  prepTime: z.number().min(0, "Prep time must be 0 or greater"),
  cookTime: z.number().min(0, "Cook time must be 0 or greater"),
  servings: z.number().min(1, "Servings must be at least 1"),
})

interface RecipeFormProps {
  recipe?: Recipe
  mode: "create" | "edit"
}

export function RecipeForm({ recipe, mode }: RecipeFormProps) {
  const router = useRouter()
  const insertRecipe = useMutation(api.recipes.insertRecipe)
  const updateRecipe = useMutation(api.recipes.updateRecipe)
  
  // Refs to track ingredient input fields for focusing
  const ingredientRefs = useRef<(HTMLInputElement | null)[]>([])

  const form = useForm({
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
    validators: {
      onChange: recipeFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // Filter out empty ingredients and instructions
        const cleanedIngredients = value.ingredients.map((item) => item.value.trim()).filter((item) => item !== "")
        const cleanedInstructions = value.instructions.map((item) => item.value.trim()).filter((item) => item !== "")

        if (mode === "create") {
          const recipeId = await insertRecipe({
            name: value.recipeName,
            image: value.image ?? "",
            description: value.description ?? "",
            ingredients: cleanedIngredients,
            instructions: cleanedInstructions,
            prepTime: value.prepTime,
            cookTime: value.cookTime,
            servings: value.servings,
          })

          router.push(`/home/${recipeId}`)
        } else {
          // Edit mode
          if (!recipe?._id) {
            throw new Error("Recipe ID not found")
          }

          await updateRecipe({
            id: recipe._id as Id<"recipes">,
            name: value.recipeName,
            image: value.image ?? "",
            description: value.description ?? "",
            ingredients: cleanedIngredients,
            instructions: cleanedInstructions,
            prepTime: value.prepTime,
            cookTime: value.cookTime,
            servings: value.servings,
          })

          router.push(`/home/${recipe._id}`)
        }
      } catch (error) {
        console.error("Error saving recipe:", error)
        alert("Error saving recipe. Please try again.")
      }
    },
  })

  // Focus the newly added ingredient field
  useEffect(() => {
    if (ingredientRefs.current.length > 0) {
      const lastIndex = ingredientRefs.current.length - 1
      const lastRef = ingredientRefs.current[lastIndex]
      if (lastRef && lastRef.value === "") {
        lastRef.focus()
      }
    }
  }, [useStore(form.store, (state) => state.values.ingredients)])

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

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Field name="recipeName">
              {(field) => (
                <div>
                  <Label htmlFor="name">Recipe Name *</Label>
                  <Input
                    id="name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter recipe name"
                    className={field.state.meta.errors ? "border-red-500" : ""}
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-red-500 mt-1">
                      {field.state.meta.errors.map(error => error?.message).join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Brief description of the recipe"
                    rows={3}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="image">
              {(field) => (
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://example.com/image.jpg (optional)"
                    type="url"
                  />
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-3 gap-4">
              <form.Field name="prepTime">
                {(field) => (
                  <div>
                    <Label htmlFor="prepTime">Prep Time (min)</Label>
                    <Input
                      id="prepTime"
                      type="number"
                      min="0"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      className={field.state.meta.errors.length > 0 ? "border-red-500" : ""}
                    />
                    {field.state.meta.errors && (
                      <p className="text-sm text-red-500 mt-1">
                        {field.state.meta.errors.map(error => error?.message).join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="cookTime">
                {(field) => (
                  <div>
                    <Label htmlFor="cookTime">Cook Time (min)</Label>
                    <Input
                      id="cookTime"
                      type="number"
                      min="0"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      className={field.state.meta.errors.length > 0 ? "border-red-500" : ""}
                    />
                    {field.state.meta.errors && (
                      <p className="text-sm text-red-500 mt-1">
                        {field.state.meta.errors.map(error => error?.message).join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="servings">
                {(field) => (
                  <div>
                    <Label htmlFor="servings">Servings</Label>
                    <Input
                      id="servings"
                      type="number"
                      min="1"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      className={field.state.meta.errors.length > 0 ? "border-red-500" : ""}
                    />
                    {field.state.meta.errors && (
                      <p className="text-sm text-red-500 mt-1">
                        {field.state.meta.errors.map(error => error?.message).join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <form.Subscribe selector={form => form.values.ingredients}>
          {(ingredients) => (
            ingredients.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Ingredients</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={() => form.pushFieldValue("ingredients", { value: "" })}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Ingredient
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <form.Field name="ingredients" mode="array">
                    {(field) => (
                      <>
                        {field.state.value.map((_, i) => (
                          <form.Field key={i} name={`ingredients[${i}].value`}>
                            {(subfield) => (
                              <div className="flex gap-2">
                                <Input
                                  value={subfield.state.value}
                                  onChange={(e) => subfield.handleChange(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      form.pushFieldValue("ingredients", { value: "" })
                                    }
                                  }}
                                  placeholder={`Ingredient ${i + 1}`}
                                  className="flex-1"
                                  ref={(el) => {
                                    ingredientRefs.current[i] = el
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => form.removeFieldValue("ingredients", i)}
                                  className="px-3"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </form.Field>
                        ))}
                      </>
                    )}
                  </form.Field>
                </CardContent>
              </Card>
            )
          )}
        </form.Subscribe>

        {/* Instructions */}
        <form.Subscribe selector={form => form.values.instructions}>
          {(instructions) => (
            instructions.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Instructions</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={() => form.pushFieldValue("instructions", { value: "" })}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <form.Field name="instructions" mode="array">
                    {(field) => (
                      <>
                        {field.state.value.map((_, i) => (
                          <form.Field key={i} name={`instructions[${i}].value`}>
                            {(subfield) => (
                              <div className="flex gap-2">
                                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                  {i + 1}
                                </div>
                                <Textarea
                                  value={subfield.state.value}
                                  onChange={(e) => subfield.handleChange(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      form.pushFieldValue("instructions", { value: "" })
                                    }
                                  }}
                                  placeholder={`Step ${i + 1} instructions`}
                                  rows={2}
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => form.removeFieldValue("instructions", i)}
                                  className="px-3 mt-1"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </form.Field>
                        ))}
                      </>
                    )}
                  </form.Field>
                </CardContent>
              </Card>
            )
          )}
        </form.Subscribe>

        {/* Toggle Buttons for Hidden Sections */}
        <div className="flex gap-4 justify-center">
          <form.Subscribe selector={form => form.values.ingredients}>
            {(ingredients) => (
              ingredients.length === 0 && <Button
                type="button"
                variant="outline"
                onClick={() => form.pushFieldValue("ingredients", { value: "" })}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Ingredients
              </Button>
            )}
          </form.Subscribe>
          <form.Subscribe selector={form => form.values.instructions}>
            {(instructions) => (
              instructions.length === 0 && <Button
                type="button"
                variant="outline"
                onClick={() => form.pushFieldValue("instructions", { value: "" })}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Instructions
              </Button>
            )}
          </form.Subscribe>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={mode === "edit" && recipe ? `/home/${recipe._id}` : "/home"}>Cancel</Link>
          </Button>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
            <Save className="w-4 h-4 mr-2" />
            {mode === "create" ? "Create Recipe" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
