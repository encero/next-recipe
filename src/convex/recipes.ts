import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { DataModel } from "./_generated/dataModel";


async function getOwner(ctx: GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>,) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Not authenticated");
    }

    return identity.subject;
}

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
        const owner = await getOwner(ctx);

        const now = Date.now();

        return await ctx.db.insert("recipes", {
            ...args,
            owner,
            createdAt: now,
            updatedAt: now,
        });
    },
});

export const updateRecipe = mutation({
    args: {
        id: v.id("recipes"),
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
        const { id, ...updateData } = args;
        const now = Date.now();
        const owner = await getOwner(ctx);

        const recipe = await ctx.db.get(id);
        if (!recipe) {
            throw new Error("Recipe not found");
        }
        if (recipe.owner !== owner) {
            throw new Error("Not authorized");
        }

        return await ctx.db.patch(id, {
            ...updateData,
            updatedAt: now,
        });
    },
});

export const deleteRecipe = mutation({
    args: {
        id: v.id("recipes"),
    },
    handler: async (ctx, args) => {
        // Delete the recipe from the database
        const owner = await getOwner(ctx);
        const recipe = await ctx.db.get(args.id);
        if (!recipe) {
            throw new Error("Recipe not found");
        }
        if (recipe.owner !== owner) {
            throw new Error("Not authorized");
        }

        await ctx.db.delete(args.id);
        return { success: true };
    },
});

export const listRecipes = query({
    args: {},
    handler: async (ctx) => {
        const owner = await getOwner(ctx);

        return await ctx.db.query("recipes")
            .filter(q => q.eq(q.field("owner"), owner))
            .order("desc")
            .collect();
    },
});

export const getRecipe = query({
    args: { id: v.id("recipes") },
    handler: async (ctx, args) => {
        const owner = await getOwner(ctx);
        const recipe = await ctx.db.get(args.id);
        if (!recipe) {
            throw new Error("Recipe not found");
        }
        if (recipe.owner !== owner) {
            throw new Error("Not authorized");
        }

        return recipe;
    },
});
