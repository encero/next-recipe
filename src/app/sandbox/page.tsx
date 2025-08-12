"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

// Mock recipe data definitions
const sampleRecipes = [
  {
    name: "Classic Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
    description: "A traditional Italian pizza with fresh mozzarella, basil, and tomato sauce",
    ingredients: ["Pizza dough", "Fresh mozzarella", "Fresh basil", "Tomato sauce", "Olive oil", "Salt"],
    instructions: [
      "Preheat oven to 450°F (230°C)",
      "Roll out pizza dough on a floured surface",
      "Spread tomato sauce evenly over dough",
      "Add fresh mozzarella slices",
      "Bake for 12-15 minutes until crust is golden",
      "Garnish with fresh basil and drizzle with olive oil"
    ],
    prepTime: 20,
    cookTime: 15,
    servings: 4
  },
  {
    name: "Chicken Tikka Masala",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    description: "Creamy and flavorful Indian curry with tender chicken pieces",
    ingredients: ["Chicken breast", "Yogurt", "Garam masala", "Heavy cream", "Tomato paste", "Onion", "Garlic", "Ginger"],
    instructions: [
      "Marinate chicken in yogurt and spices for 2 hours",
      "Sauté onions, garlic, and ginger until fragrant",
      "Add marinated chicken and cook until browned",
      "Stir in tomato paste and cream",
      "Simmer for 20 minutes until sauce thickens",
      "Serve with rice and naan bread"
    ],
    prepTime: 30,
    cookTime: 25,
    servings: 6
  },
  {
    name: "Chocolate Chip Cookies",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
    description: "Soft and chewy cookies loaded with chocolate chips",
    ingredients: ["All-purpose flour", "Butter", "Brown sugar", "White sugar", "Eggs", "Vanilla extract", "Chocolate chips", "Baking soda"],
    instructions: [
      "Cream butter and sugars until fluffy",
      "Beat in eggs and vanilla",
      "Mix in dry ingredients",
      "Fold in chocolate chips",
      "Drop rounded tablespoons onto baking sheet",
      "Bake at 375°F (190°C) for 10-12 minutes"
    ],
    prepTime: 15,
    cookTime: 12,
    servings: 24
  },
  {
    name: "Beef Stir Fry",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
    description: "Quick and healthy stir-fried beef with vegetables",
    ingredients: ["Beef strips", "Broccoli", "Bell peppers", "Soy sauce", "Garlic", "Ginger", "Sesame oil", "Cornstarch"],
    instructions: [
      "Slice beef into thin strips",
      "Heat wok with sesame oil",
      "Stir-fry beef until browned",
      "Add vegetables and stir-fry for 3-4 minutes",
      "Mix soy sauce, garlic, and ginger",
      "Thicken sauce with cornstarch slurry"
    ],
    prepTime: 20,
    cookTime: 10,
    servings: 4
  },
  {
    name: "Caesar Salad",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    description: "Classic Caesar salad with homemade dressing and croutons",
    ingredients: ["Romaine lettuce", "Parmesan cheese", "Croutons", "Lemon juice", "Garlic", "Anchovy paste", "Dijon mustard", "Olive oil"],
    instructions: [
      "Wash and chop romaine lettuce",
      "Make dressing with lemon, garlic, and anchovy",
      "Toss lettuce with dressing",
      "Add croutons and shaved parmesan",
      "Season with black pepper",
      "Serve immediately"
    ],
    prepTime: 15,
    cookTime: 0,
    servings: 4
  },
  {
    name: "Pasta Carbonara",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
    description: "Traditional Italian pasta with eggs, cheese, and pancetta",
    ingredients: ["Spaghetti", "Eggs", "Pecorino Romano", "Pancetta", "Black pepper", "Salt", "Pasta water"],
    instructions: [
      "Cook pasta in salted water",
      "Crisp pancetta in a large pan",
      "Beat eggs with grated cheese",
      "Toss hot pasta with egg mixture",
      "Add pancetta and black pepper",
      "Use pasta water to create creamy sauce"
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4
  },
  {
    name: "Grilled Salmon",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
    description: "Perfectly grilled salmon with herbs and lemon",
    ingredients: ["Salmon fillets", "Lemon", "Fresh herbs", "Olive oil", "Garlic", "Salt", "Black pepper"],
    instructions: [
      "Preheat grill to medium-high heat",
      "Season salmon with salt and pepper",
      "Brush with olive oil and herbs",
      "Grill skin-side down for 4-5 minutes",
      "Flip and grill for 3-4 more minutes",
      "Serve with lemon wedges"
    ],
    prepTime: 10,
    cookTime: 10,
    servings: 4
  },
  {
    name: "Vegetable Curry",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400",
    description: "Spicy vegetable curry with coconut milk and aromatic spices",
    ingredients: ["Mixed vegetables", "Coconut milk", "Curry powder", "Onion", "Garlic", "Ginger", "Tomatoes", "Chickpeas"],
    instructions: [
      "Sauté onions, garlic, and ginger",
      "Add curry powder and cook until fragrant",
      "Stir in vegetables and chickpeas",
      "Pour in coconut milk and tomatoes",
      "Simmer for 20 minutes until vegetables are tender",
      "Season with salt and serve with rice"
    ],
    prepTime: 15,
    cookTime: 25,
    servings: 6
  },
  {
    name: "French Toast",
    image: "https://images.unsplash.com/photo-1484723091739-30a097c8b4ef?w=400",
    description: "Classic French toast with cinnamon and maple syrup",
    ingredients: ["Bread slices", "Eggs", "Milk", "Cinnamon", "Vanilla extract", "Butter", "Maple syrup"],
    instructions: [
      "Whisk eggs, milk, cinnamon, and vanilla",
      "Dip bread slices in egg mixture",
      "Heat butter in a large skillet",
      "Cook bread until golden brown on both sides",
      "Serve hot with maple syrup",
      "Garnish with fresh berries if desired"
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4
  },
  {
    name: "Beef Tacos",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
    description: "Flavorful beef tacos with fresh toppings and homemade salsa",
    ingredients: ["Ground beef", "Taco seasoning", "Tortillas", "Lettuce", "Tomatoes", "Cheese", "Sour cream", "Onion"],
    instructions: [
      "Brown ground beef in a skillet",
      "Add taco seasoning and water",
      "Simmer until sauce thickens",
      "Warm tortillas in a dry pan",
      "Fill tortillas with beef mixture",
      "Top with lettuce, tomatoes, cheese, and sour cream"
    ],
    prepTime: 15,
    cookTime: 15,
    servings: 6
  }
];

export default function SandboxPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string>("");
  
  const insertRecipe = useMutation(api.recipes.insertRecipe);

  const handleSeedDatabase = async () => {
    try {
      setIsSeeding(true);
      setSeedResult("Seeding database...");
      
      // Insert recipes one by one using the single recipe mutation
      const recipeIds = [];
      for (const recipe of sampleRecipes) {
        const recipeId = await insertRecipe(recipe);
        recipeIds.push(recipeId);
      }
      
      setSeedResult(`Successfully seeded database with ${recipeIds.length} recipes!`);
    } catch (error) {
      console.error("Error seeding database:", error);
      setSeedResult(`Error seeding database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearDatabase = async () => {
    // TODO: Implement clear database functionality
    setSeedResult("Clear database functionality not yet implemented");
  };

  const handleViewRecipes = async () => {
    // TODO: Implement view recipes functionality
    setSeedResult("View recipes functionality not yet implemented");
  };

  const handleExportData = async () => {
    // TODO: Implement export data functionality
    setSeedResult("Export data functionality not yet implemented");
  };

  const handleImportData = async () => {
    // TODO: Implement import data functionality
    setSeedResult("Import data functionality not yet implemented");
  };

  const handleResetAll = async () => {
    // TODO: Implement reset all functionality
    setSeedResult("Reset all functionality not yet implemented");
  };

  const buttons = [
    {
      label: "Seed the DB",
      onClick: handleSeedDatabase,
      disabled: isSeeding,
      variant: "primary" as const,
      description: "Fill the database with 10 sample recipes"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-6">
          <a
            href="/home"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to App
          </a>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sandbox</h1>
          <p className="text-lg text-gray-600">
            Development and testing tools for the recipe application
          </p>
        </div>

        {/* Result Display */}
        {seedResult && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-2">Last Operation Result:</h3>
            <p className="text-gray-700">{seedResult}</p>
          </div>
        )}

        {/* Button Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              disabled={button.disabled}
              className={`
                p-6 rounded-lg shadow-sm border transition-all duration-200
                ${button.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-md hover:scale-105'
                }
                ${button.variant === 'primary' 
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                  : button.variant === 'danger'
                  ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                  : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="text-center">
                <div className="text-xl font-semibold mb-2">{button.label}</div>
                <div className="text-sm opacity-80">{button.description}</div>
                {button.disabled && (
                  <div className="mt-2 text-xs opacity-60">
                    {isSeeding ? "Processing..." : "Disabled"}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
