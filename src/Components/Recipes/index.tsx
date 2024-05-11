import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeCard from '../RecipesCard';
import { fetchDrinks } from '../../Services/ApiDrinks';
import { fetchMeals } from '../../Services/ApiMeals';
import { DrinkType, MealType } from '../../utils/types';

function Recipes() {
  const [mealRecipes, setMealRecipes] = useState<MealType[]>([]);
  const [drinkRecipes, setDrinkRecipes] = useState< DrinkType[]>([]);

  const location = useLocation();
  const activePage = location.pathname.includes('/meals') ? 'meals' : 'drinks';

  useEffect(() => {
    const fetchData = async () => {
      if (activePage === 'meals') {
        const response:MealType[] = await fetchMeals();
        setMealRecipes(response);
      } else {
        const response:DrinkType[] = await fetchDrinks();
        setDrinkRecipes(response);
      }
    };

    fetchData();
  }, [activePage]);

  return (
    <>
      <h1>Meals by API:</h1>
      <div>
        {activePage === 'meals' && mealRecipes
        && mealRecipes.slice(0, 12).map((recipe, index) => (
          <RecipeCard
            data-testid={ `${index}-recipe-card` }
            key={ recipe.idMeal }
            recipeName={ recipe.strMeal }
            recipeThumb={ recipe.strMealThumb }
            recipeId={ recipe.idMeal }
            index={ index }
          />
        ))}
        {activePage === 'drinks' && drinkRecipes
        && drinkRecipes.slice(0, 12).map((recipe, index) => (
          <RecipeCard
            data-testid={ `${index}-recipe-card` }
            key={ recipe.idDrink }
            recipeName={ recipe.strDrink }
            recipeThumb={ recipe.strDrinkThumb }
            recipeId={ recipe.idDrink }
            index={ index }
          />
        ))}
      </div>
    </>
  );
}

export default Recipes;
