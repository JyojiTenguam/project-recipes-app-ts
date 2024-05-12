import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import RecipeCard from '../RecipesCard';
import { fetchDrinks, fetchDrinksByCategory,
  fetchFilterDrinksByCategory } from '../../Services/ApiDrinks';
import { fetchFilterMealsByCategory, fetchMeals,
  fetchMealsListByCategory } from '../../Services/ApiMeals';
import { CategoryType, DrinkType,
  MealType } from '../../utils/types';

function Recipes() {
  const [mealRecipes, setMealRecipes] = useState<MealType[]>([]);
  const [drinkRecipes, setDrinkRecipes] = useState< DrinkType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [filter, setFilter] = useState<string>('');

  const location = useLocation();
  const activePage = location.pathname.includes('/meals') ? 'meals' : 'drinks';

  useEffect(() => {
    const fetchData = async () => {
      if (activePage === 'meals') {
        const response:MealType[] = filter ? await fetchFilterMealsByCategory(filter)
          : await fetchMeals();
        setMealRecipes(response);
      } else {
        const response:DrinkType[] = filter ? await fetchFilterDrinksByCategory(filter)
          : await fetchDrinks();
        setDrinkRecipes(response);
      }
    };

    const fetchCategories = async () => {
      if (activePage === 'meals') {
        const response:CategoryType[] = await fetchMealsListByCategory();
        setCategories(response);
      } else {
        const response:CategoryType[] = await fetchDrinksByCategory();
        setCategories(response);
      }
    };

    fetchData();
    fetchCategories();
  }, [activePage, filter]);

  const handleFilter = async (category: string) => {
    if (category === filter) {
      setFilter('');
    } else {
      setFilter(category);
    }
  };

  return (
    <>
      <div>
        <button
          data-testid="All-category-filter"
          onClick={ () => setFilter('') }
        >
          All
        </button>
        {categories && categories.length > 0
    && categories.slice(0, 5).map((category, index) => (
      <button
        onClick={ () => handleFilter(category.strCategory) }
        key={ index }
        data-testid={ `${category.strCategory}-category-filter` }
      >
        {category.strCategory}
      </button>
    ))}
      </div>
      <div>
        {activePage === 'meals' && mealRecipes
        && mealRecipes.slice(0, 12).map((recipe, index) => (
          <Link to={ `/meals/${recipe.idMeal}` } key={ recipe.idMeal }>
            <RecipeCard
              data-testid={ `${index}-recipe-card` }
              recipeName={ recipe.strMeal }
              recipeThumb={ recipe.strMealThumb }
              recipeId={ recipe.idMeal }
              index={ index }
            />
          </Link>
        ))}
        {activePage === 'drinks' && drinkRecipes
        && drinkRecipes.slice(0, 12).map((recipe, index) => (
          <Link to={ `/drinks/${recipe.idDrink}` } key={ recipe.idDrink }>
            <RecipeCard
              data-testid={ `${index}-recipe-card` }
              recipeName={ recipe.strDrink }
              recipeThumb={ recipe.strDrinkThumb }
              recipeId={ recipe.idDrink }
              index={ index }
            />
          </Link>

        ))}
      </div>
    </>
  );
}

export default Recipes;
