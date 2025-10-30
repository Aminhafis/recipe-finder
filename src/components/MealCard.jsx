import React from "react";
import PropTypes from "prop-types";

/**
 * Displays a single recipe meal card, with favorite icon.
 */
function MealCard({ meal, isFavorite, onToggleFavorite }) {
  return (
    <div className="bg-white rounded-xl border border-orange-100 shadow-sm hover:shadow-md flex flex-col items-center p-4 transition relative">
      {/* Favorite Heart Icon */}
      <button
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className="absolute right-3 top-3 text-lg"
        onClick={() => onToggleFavorite && onToggleFavorite(meal)}
        style={{ outline: "none", background: "none", border: "none" }}
      >
        {isFavorite
          ? <span className="text-orange-500">❤️</span>
          : <span className="text-gray-300 hover:text-orange-400">🤍</span>
        }
      </button>
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="w-24 h-24 object-cover rounded mb-2 border border-yellow-100"
      />
      <h2 className="text-[1rem] font-semibold text-center mb-1 text-orange-800 whitespace-normal leading-tight">{meal.strMeal}</h2>
      <a
        href={`https://www.themealdb.com/meal/${meal.idMeal}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 px-3 py-1 rounded bg-orange-400 hover:bg-orange-500 text-white text-xs font-medium transition"
      >
        View Recipe
      </a>
    </div>
  );
}

MealCard.propTypes = {
  meal: PropTypes.shape({
    idMeal: PropTypes.string,
    strMeal: PropTypes.string,
    strMealThumb: PropTypes.string,
  }).isRequired,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func,
};

export default MealCard;
