"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Recipe, RecipeFormData } from "~/types/recipe"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Plus, Minus, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface RecipeFormProps {
  recipe?: Recipe
  mode: "create" | "edit"
}

export function RecipeForm({ recipe, mode }: RecipeFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<RecipeFormData>({
    name: recipe?.name || "",
    image: recipe?.image || "",
    description: recipe?.description || "",
    ingredients: recipe?.ingredients || [""],
    instructions: recipe?.instructions || [""],
    prepTime: recipe?.prepTime || 0,
    cookTime: recipe?.cookTime || 0,
    servings: recipe?.servings || 1,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Filter out empty ingredients and instructions
      const cleanedIngredients = formData.ingredients.filter((item) => item.trim() !== "")
      const cleanedInstructions = formData.instructions.filter((item) => item.trim() !== "")

      const recipeData: Recipe = {
        id: recipe?.id || crypto.randomUUID(),
        ...formData,
        ingredients: cleanedIngredients,
        instructions: cleanedInstructions,
        createdAt: recipe?.createdAt || new Date(),
        updatedAt: new Date(),
        lastCooked: recipe?.lastCooked,
        scheduledFor: recipe?.scheduledFor,
      }

      saveRecipe(recipeData)
      router.push(`/recipes/${recipeData.id}`)
    } catch (error) {
      console.error("Error saving recipe:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
  }

  const updateIngredient = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) => (i === index ? value : item)),
    }))
  }

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }))
  }

  const removeInstruction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }))
  }

  const updateInstruction = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((item, i) => (i === index ? value : item)),
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" asChild>
          <Link href={recipe ? `/recipes/${recipe.id}` : "/home"}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{mode === "create" ? "Add New Recipe" : "Edit Recipe"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Recipe Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter recipe name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the recipe"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="prepTime">Prep Time (min)</Label>
                <Input
                  id="prepTime"
                  type="number"
                  min="0"
                  value={formData.prepTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, prepTime: Number.parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="cookTime">Cook Time (min)</Label>
                <Input
                  id="cookTime"
                  type="number"
                  min="0"
                  value={formData.cookTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cookTime: Number.parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={formData.servings}
                  onChange={(e) => setFormData((prev) => ({ ...prev, servings: Number.parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
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
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  className="flex-1"
                />
                {formData.ingredients.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                    className="px-3"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Instructions */}
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
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1">
                  {index + 1}
                </div>
                <Textarea
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Step ${index + 1} instructions`}
                  rows={2}
                  className="flex-1"
                />
                {formData.instructions.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeInstruction(index)}
                    className="px-3 mt-1"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={recipe ? `/recipes/${recipe.id}` : "/"}>Cancel</Link>
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
