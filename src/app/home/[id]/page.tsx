"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { ArrowLeft, Clock, Users, Calendar, Edit, Trash2, ChefHat, AlertTriangle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { userRecipes } from "~/components/RecipeContextProvider"

// Common header component
function RecipeHeader() {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Button variant="ghost" asChild>
        <Link href="/home">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Recipes
        </Link>
      </Button>
    </div>
  )
}

// Common page wrapper component
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <RecipeHeader />
      {children}
    </div>
  )
}

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const recipeId = params.id as string
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const recipes = userRecipes();
  const recipe = recipes?.find((recipe) => recipe._id === recipeId);
  const deleteRecipe = useMutation(api.recipes.deleteRecipe);

  const handleDelete = async () => {
    if (!recipe) return;
    
    setIsDeleting(true);
    try {
      await deleteRecipe({ id: recipe._id as any });
      // Close the dialog
      setIsDeleteDialogOpen(false);
      // Navigate back to recipes list
      router.push("/home");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Error deleting recipe. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  const handleMarkCooked = () => {
    // TODO: Implement mark as cooked functionality
  }

  const formatLastCooked = (timestamp: number) => {
    const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24))
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    return `${days} days ago`
  }

  const formatScheduledDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Loading state
  if (recipe === undefined) {
    return (
      <PageWrapper>
        <div className="flex flex-col justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
          <div className="text-center">
            <p className="text-gray-600 text-lg font-medium">Loading recipe...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  // Recipe not found
  if (!recipe) {
    return (
      <PageWrapper>
        <div className="text-center py-12 animate-in fade-in duration-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h1>
          <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Link>
          </Button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="animate-in fade-in duration-200">
        {/* Recipe Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image src={recipe.image || "/pasta.jpg"} alt={recipe.name} fill className="object-cover" />
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
              {recipe.scheduledFor && (
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
                <Link href={`/home/${recipe._id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
              
              {/* Delete Button with Dialog */}
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      Delete Recipe
                    </DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete "{recipe.name}"? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Deleting...
                        </>
                      ) : (
                        "Delete Recipe"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div  className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          {recipe.ingredients.length > 0 && (
          <Card className="animate-in fade-in slide-in-from-left-4 duration-200 fill-mode-backwards" style={{ animationDelay: "50ms" }}>
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
          )}
          {/* Instructions */}
          {recipe.instructions.length > 0 && (
          <Card className="animate-in fade-in slide-in-from-right-4 duration-200 fill-mode-backwards" style={{ animationDelay: "100ms" }}>
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
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

