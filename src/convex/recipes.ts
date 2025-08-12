import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const insertRecipe = mutation({
  args: {
    name: v.string(),
    image: v.string(),
    description: v.string(),
    ingredients: v.array(v.string()),
    instructions: v.array(v.string()),
    prepTime: v.number(),
    cookTime: v.number(),
    servings: v.number(),
    lastCooked: v.optional(v.number()),
    scheduledFor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    args.ingredients = args.ingredients.filter((ingredient) => ingredient !== "");
    args.instructions = args.instructions.filter((instruction) => instruction !== "");
    
    return await ctx.db.insert("recipes", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const listRecipes = query({
  args: {},
  handler: async (ctx) => {
    // Skip auth for now, just return all recipes
    return await ctx.db.query("recipes")
      .order("desc")
      .collect();
  },
});

export const getRecipe = query({
  args: { id: v.id("recipes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
