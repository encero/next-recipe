"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import type { Recipe } from "~/types/recipe"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Plus, Minus, Save, ArrowLeft, ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"

interface RecipeFormData {
  name: string
  image: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
}

interface RecipeFormProps {
  recipe?: Recipe
  mode: "create" | "edit"
}

export function RecipeForm({ recipe, mode }: RecipeFormProps) {
  const router = useRouter()
  const insertRecipe = useMutation(api.recipes.insertRecipe)
  
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
  const [ingredientsCollapsed, setIngredientsCollapsed] = useState(formData.ingredients.length === 0)
  const [instructionsCollapsed, setInstructionsCollapsed] = useState(formData.instructions.length === 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Filter out empty ingredients and instructions
      const cleanedIngredients = formData.ingredients.filter((item) => item.trim() !== "")
      const cleanedInstructions = formData.instructions.filter((item) => item.trim() !== "")

      if (mode === "create") {
        const recipeId = await insertRecipe({
          name: formData.name,
          image: formData.image || "/pasta.jpg", // Default image if none provided
          description: formData.description,
          ingredients: cleanedIngredients,
          instructions: cleanedInstructions,
          prepTime: formData.prepTime,
          cookTime: formData.cookTime,
          servings: formData.servings,
        })
        
        router.push(`/home/${recipeId}`)
      } else {
        // TODO: Implement edit functionality when edit mutation is available
        console.log("Edit functionality not yet implemented")
      }
    } catch (error) {
      console.error("Error saving recipe:", error)
      alert("Error saving recipe. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
    
    // If we're removing the last ingredient, collapse the section
    if (formData.ingredients.length <= 1) {
      setIngredientsCollapsed(true)
    }
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
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
    
    // If we're removing the last instruction, collapse the section
    if (formData.instructions.length <= 1) {
      setInstructionsCollapsed(true)
    }
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
          <Link href="/home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
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
              <Label htmlFor="name">Recipe Name *</Label>
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
                placeholder="https://example.com/image.jpg (optional)"
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
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    className="flex-1"
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
                setIngredientsCollapsed(false);
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
                setInstructionsCollapsed(false);
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
            <Link href="/home">Cancel</Link>
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
