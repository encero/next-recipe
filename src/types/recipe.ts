export interface Recipe {
  id: string
  name: string
  image: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number // in minutes
  cookTime: number // in minutes
  servings: number
  lastCooked?: Date
  scheduledFor?: Date
  createdAt: Date
  updatedAt: Date
}
