import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  recipes: defineTable({
    name: v.string(),
    image: v.string(),
    description: v.string(),
    ingredients: v.array(v.string()),
    instructions: v.array(v.string()),
    prepTime: v.number(), // in minutes
    cookTime: v.number(), // in minutes
    servings: v.number(),
    lastCooked: v.optional(v.number()), // stored as UTC timestamp in milliseconds
    scheduledFor: v.optional(v.number()), // stored as UTC timestamp in milliseconds
    createdAt: v.number(), // stored as UTC timestamp in milliseconds
    updatedAt: v.number(), // stored as UTC timestamp in milliseconds
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_scheduledFor", ["scheduledFor"])
    .index("by_lastCooked", ["lastCooked"]),
});