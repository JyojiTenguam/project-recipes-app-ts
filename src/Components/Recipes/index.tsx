import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeCard from '../RecipesCard';
import { fetchDrinks, fetchDrinksByCategory } from '../../Services/ApiDrinks';
import { fetchMeals, fetchMealsListByCategory } from '../../Services/ApiMeals';
import { DrinkCategoryType, DrinkType,
  MealCategoryType, MealType } from '../../utils/types';

function Recipes() {
  const [mealRecipes, setMealRecipes] = useState<MealType[]>([]);
  const [drinkRecipes, setDrinkRecipes] = useState< DrinkType[]>([]);
  const [mealCategories, setMealCategories] = useState<MealCategoryType[]>([]);
  const [drinkCategories, setDrinkCategories] = useState< DrinkCategoryType[]>([]);

  const location = useLocation();
  const activePage = location.pathname.includes('/meals') ? 'meals' : 'drinks';

  useEffect(() => {
    const fetchData = async () => {
      if (activePage === 'meals') {
        const responseCategories:MealCategoryType[] = await fetchMealsListByCategory();
        setMealCategories(responseCategories);
        const response:MealType[] = await fetchMeals();
        setMealRecipes(response);
      } else {
        const responseCategories:DrinkCategoryType[] = await fetchDrinksByCategory();
        setDrinkCategories(responseCategories);
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
        {activePage === 'meals' && mealCategories && mealCategories.length > 0
    && mealCategories.slice(0, 5).map((category, index) => (
      <div
        key={ index }
        data-testid={ `${category.strCategory}-category-filter` }
      >
        <p>{category.strCategory}</p>
      </div>
    ))}
        {activePage === 'drinks' && drinkCategories && drinkCategories.length > 0
    && drinkCategories.slice(0, 5).map((category, index) => (
      <div
        key={ index }
        data-testid={ `${category.strCategory}-category-filter` }
      >
        <p>{category.strCategory}</p>
      </div>
    ))}
      </div>

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
