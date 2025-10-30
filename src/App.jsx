import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import MealCard from "./components/MealCard";

/**
 * Main Recipe Finder App
 */
export default function App() {
  const [ingredient, setIngredient] = useState("");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allIngredients, setAllIngredients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Fetch all ingredients for autosuggest
  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
      .then(res => res.json())
      .then(data => {
        if (data.meals) {
          setAllIngredients(
            data.meals.map(item => item.strIngredient).filter(Boolean)
          );
        }
      });
  }, []);

  // Fetch recipes for current ingredient
  const fetchMeals = async () => {
    setMeals([]);
    setError("");
    if (!ingredient.trim()) {
      setError("Please enter an ingredient.");
      toast.error("Enter an ingredient.", { duration: 1000 });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient.trim()}`
      );
      const data = await res.json();
      if (data.meals) {
        setMeals(data.meals);
        toast.success("Recipes loaded!", { duration: 1000 });
      } else {
        setError("No recipes found for that ingredient.");
        toast.error("No recipes found", { duration: 1000 });
      }
    } catch {
      setError("Could not connect to the recipe service.");
      toast.error("Could not connect to the recipe service", { duration: 1000 });
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite for a given meal by id
  const toggleFavorite = (meal) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.idMeal === meal.idMeal)) {
        return prev.filter(fav => fav.idMeal !== meal.idMeal);
      }
      return [...prev, meal];
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-orange-50 via-yellow-50 to-orange-200 flex flex-col items-center justify-start py-10 px-2">
      <Toaster richColors position="top-center" />
      <h1 className="text-2xl font-bold mb-3 text-orange-800 tracking-tight">Recipe Finder</h1>
      <p className="text-sm text-orange-600 mb-7">
        Search recipes by ingredient. Minimal and delightful.
      </p>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="mb-8 w-full max-w-4xl">
          <h2 className="text-lg font-semibold text-orange-500 mb-3">Favorites:</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {favorites.map(meal => (
              <MealCard
                key={meal.idMeal}
                meal={meal}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search Bar with Autosuggest */}
      <div className="relative flex items-center gap-1 mb-6 w-full max-w-xs bg-white rounded-lg shadow border border-orange-200 px-2 py-1">
        <input
          className="flex-1 px-2 py-1 text-gray-800 placeholder-gray-400 bg-transparent outline-none text-base rounded"
          type="text"
          value={ingredient}
          onChange={e => {
            const val = e.target.value;
            setIngredient(val);
            if (val.trim().length > 0 && allIngredients.length > 0) {
              setSuggestions(
                allIngredients
                  .filter(i =>
                    i.toLowerCase().startsWith(val.toLowerCase())
                  )
                  .slice(0, 7)
              );
            } else {
              setSuggestions([]);
            }
          }}
          onKeyDown={e => {
            if (e.key === "Enter") {
              fetchMeals();
              setSuggestions([]);
            }
          }}
          maxLength={32}
          placeholder="e.g. chicken"
        />
        <button
          className="px-3 py-1 rounded bg-orange-400 hover:bg-orange-500 active:bg-orange-700 text-white text-base font-medium transition"
          onClick={fetchMeals}
        >
          Search
        </button>
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 left-0 w-full bg-white border border-orange-200 rounded shadow-lg">
            {suggestions.map((sug, idx) => (
              <li
                key={idx}
                className="cursor-pointer px-3 py-1 hover:bg-yellow-100 transition"
                onClick={() => {
                  setIngredient(sug);
                  setSuggestions([]);
                }}
              >
                {sug}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Loading/Error messages */}
      <div className="mb-4 h-6">
        {loading ? (
          <span className="text-orange-600 font-medium text-sm">Loading…</span>
        ) : (
          error && <span className="text-red-600 font-medium text-sm">{error}</span>
        )}
      </div>

      {/* Meals Grid */}
      {meals.length > 0 && (
        <div className="grid gap-6 w-full max-w-4xl px-2
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3">
          {meals.map((meal) => (
            <MealCard
              key={meal.idMeal}
              meal={meal}
              isFavorite={favorites.some(fav => fav.idMeal === meal.idMeal)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      <footer className="mt-16 text-gray-600 text-xs">
        Built with <span className="text-orange-500 font-bold">React & Tailwind</span>
      </footer>
    </main>
  );
}
