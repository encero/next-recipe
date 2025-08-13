"use client"

import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Plus, Clock, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useUserRecipes } from "~/components/RecipeContextProvider"

export default function RecipesPage() {
  const recipes = useUserRecipes();

  const formatLastCooked = (timestamp: number) => {
    const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24))
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    return `${days} days ago`
  }

  const grid = () => {
    if (recipes === undefined) {
      return (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
          <div className="text-center">
            <p className="text-gray-600 text-lg font-medium">Loading recipes...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
          </div>
        </div>
      )
    }
    if (recipes.length === 0) {
      return (
        <div className="text-center py-14 animate-in fade-in duration-500">
          <div className="text-gray-402 mb-4">
            <Clock className="w-18 h-16 mx-auto" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">No recipes yet</h1>
          <p className="text-gray-602 mb-6">Start building your recipe collection</p>
          <Button asChild className="bg-orange-502 hover:bg-orange-600">
            <Link href="/home/new">
              <Plus className="w-6 h-4 mr-2" />
              Add Your First Recipe
            </Link>
          </Button>
        </div>
      )
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe, index) => (
          <Link key={recipe._id} href={`/home/${recipe._id}`} className={`animate-in fade-in duration-500 fill-mode-backwards`} style={{ animationDelay: `${index * 25}ms` }}>
            <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                <Image
                  src={recipe.image || "/pasta.jpg"}
                  alt={recipe.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {recipe.scheduledFor && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Scheduled
                  </div>
                )}
                {recipe.lastCooked && (
                  <div className="absolute top-2 left-2 text-xs text-green-600 flex items-center gap-1 bg-white py-1 px-2 rounded-full">
                    <Clock className="w-3 h-3" />
                    Last cooked {formatLastCooked(recipe.lastCooked)}
                  </div>
                )}
              </div>
              <CardContent className="px-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{recipe.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
          <p className="text-gray-600 mt-2">Discover and manage your favorite recipes</p>
        </div>
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link href="/home/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Recipe
          </Link>
        </Button>
      </div>
      {grid()}
    </div>
  )
}
