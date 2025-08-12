"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Recipe } from "~/types/recipe"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { ArrowLeft, Clock, Users, Calendar, Edit, Trash2, ChefHat } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()


  const recipe:Recipe = {
      id: "1",
      name: "Classic Spaghetti Carbonara",
      image: "/images/carbonara.jpg",
      description: "A traditional Italian pasta dish with eggs, cheese, pancetta, and black pepper. Simple ingredients come together to create this creamy, satisfying meal.",
      ingredients: [
        "400g spaghetti",
        "200g pancetta or guanciale, diced",
        "4 large eggs",
        "100g Pecorino Romano cheese, grated",
        "2 cloves garlic, minced",
        "Freshly ground black pepper",
        "Salt to taste"
      ],
      instructions: [
        "Bring a large pot of salted water to boil and cook spaghetti according to package directions.",
        "While pasta cooks, heat a large pan over medium heat and cook pancetta until crispy.",
        "In a bowl, whisk together eggs, grated cheese, and black pepper.",
        "When pasta is ready, reserve 1 cup pasta water and drain the rest.",
        "Add hot pasta to the pan with pancetta and toss.",
        "Remove from heat and quickly stir in egg mixture, adding pasta water as needed to create a creamy sauce.",
        "Serve immediately with extra cheese and black pepper."
      ],
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      createdAt: new Date(),
      updatedAt: new Date()
  }

  const handleDelete = () => {
    if (recipe && confirm("Are you sure you want to delete this recipe?")) {
      router.push("/")
    }
  }

  const handleMarkCooked = () => {
  }


  const formatLastCooked = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    return `${days} days ago`
  }

  const formatScheduledDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h1>
          <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" asChild>
          <Link href="/home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
          </Link>
        </Button>
      </div>

      {/* Recipe Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image src={recipe.image || "/placeholder.svg"} alt={recipe.name} fill className="object-cover" />
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
            <p className="text-gray-600 text-lg">{recipe.description}</p>
          </div>

          {/* Recipe Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Prep: {recipe.prepTime}min</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <ChefHat className="w-4 h-4" />
              <span className="text-sm">Cook: {recipe.cookTime}min</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-sm">{recipe.servings} servings</span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            {recipe.lastCooked && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Last cooked {formatLastCooked(recipe.lastCooked)}
              </Badge>
            )}
            {recipe.scheduledFor && recipe.scheduledFor.getTime() > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Calendar className="w-3 h-3 mr-1" />
                Scheduled for {formatScheduledDate(recipe.scheduledFor)}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4">
            <Button onClick={handleMarkCooked} className="bg-green-600 hover:bg-green-700">
              <ChefHat className="w-4 h-4 mr-2" />
              Mark as Cooked
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/recipes/${recipe.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 pt-0.5">{instruction}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

