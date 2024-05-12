import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeCard from '../RecipesCard';
import { fetchDrinks, fetchDrinksByCategory,
  fetchFilterDrinksByCategory } from '../../Services/ApiDrinks';
import { fetchFilterMealsByCategory, fetchMeals,
  fetchMealsListByCategory } from '../../Services/ApiMeals';
import { DrinkCategoryDetailsType, DrinkCategoryType, DrinkType,
  MealCategoryDetailsType,
  MealCategoryType, MealType } from '../../utils/types';

function Recipes() {
  const [mealRecipes, setMealRecipes] = useState<MealType[]>([]);
  const [drinkRecipes, setDrinkRecipes] = useState< DrinkType[]>([]);
  const [mealCategories, setMealCategories] = useState<MealCategoryType[]>([]);
  const [drinkCategories, setDrinkCategories] = useState< DrinkCategoryType[]>([]);
  const [mealFiltredRecipes, setMealFiltredRecipes] = useState<
  MealCategoryDetailsType[]>([]);
  const [drinkFiltredRecipes, setDrinkFiltredRecipes] = useState<
  DrinkCategoryDetailsType[]>([]);

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

  const handleFilter = async (category: string) => {
    if (activePage === 'meals') {
      const recipes = await fetchFilterMealsByCategory(category);
      setMealFiltredRecipes(recipes);
    } else {
      const recipes = await fetchFilterDrinksByCategory(category);
      setDrinkFiltredRecipes(recipes);
    }
  };

  const handleClearFilters = async () => {
    if (activePage === 'meals') {
      setMealFiltredRecipes([]);
    }
    setDrinkFiltredRecipes([]);
  };

  return (
    <>
      <div>
        <button onClick={ () => handleClearFilters() }>All</button>
        {activePage === 'meals' && mealCategories && mealCategories.length > 0
    && mealCategories.slice(0, 5).map((category, index) => (
      <div
        key={ index }
        data-testid={ `${category.strCategory}-category-filter` }
      >
        <button
          onClick={ () => handleFilter(category.strCategory) }
        >
          {category.strCategory}
        </button>
      </div>
    ))}
        {activePage === 'drinks' && drinkCategories && drinkCategories.length > 0
    && drinkCategories.slice(0, 5).map((category, index) => (
      <div
        key={ index }
        data-testid={ `${category.strCategory}-category-filter` }
      >
        <button
          onClick={ () => handleFilter(category.strCategory) }
        >
          {category.strCategory}
        </button>
      </div>
    ))}
      </div>
      <div>
        {activePage === 'meals' && mealFiltredRecipes.length > 0
          ? mealFiltredRecipes.slice(0, 12).map((recipe, index) => (
            <RecipeCard
              data-testid={ `${index}-recipe-card` }
              key={ recipe.idMeal }
              recipeName={ recipe.strMeal }
              recipeThumb={ recipe.strMealThumb }
              recipeId={ recipe.idMeal }
              index={ index }
            />
          ))
          : mealRecipes && mealRecipes.slice(0, 12).map((recipe, index) => (
            <RecipeCard
              data-testid={ `${index}-recipe-card` }
              key={ recipe.idMeal }
              recipeName={ recipe.strMeal }
              recipeThumb={ recipe.strMealThumb }
              recipeId={ recipe.idMeal }
              index={ index }
            />
          ))}
        {activePage === 'drinks' && drinkFiltredRecipes.length > 0
          ? drinkFiltredRecipes.slice(0, 12).map((recipe, index) => (
            <RecipeCard
              data-testid={ `${index}-recipe-card` }
              key={ recipe.idDrink }
              recipeName={ recipe.strDrink }
              recipeThumb={ recipe.strDrinkThumb }
              recipeId={ recipe.idDrink }
              index={ index }
            />
          ))
          : drinkRecipes && drinkRecipes.slice(0, 12).map((recipe, index) => (
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
