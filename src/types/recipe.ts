export interface Recipe {
  _id: string
  name: string
  image: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number // in minutes
  cookTime: number // in minutes
  servings: number
  lastCooked?: number // UTC timestamp in milliseconds
  scheduledFor?: number // UTC timestamp in milliseconds
  createdAt: number // UTC timestamp in milliseconds
  updatedAt: number // UTC timestamp in milliseconds
}
