import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { DrinkType, MealType } from '../../utils/types';
import { fetchDrinkById } from '../../Services/ApiDrinks';
import { fetchMealById } from '../../Services/ApiMeals';

function RecipeInProgress() {
  const [mealRecipe, setMealRecipe] = useState<MealType>();
  const [drinkRecipe, setDrinkRecipe] = useState<DrinkType>();
  const { id: idParam } = useParams<string>();
  const [checkedIng, setCheckedIng] = useState<string[]>([]);
  const location = useLocation();
  const activePage = location.pathname.includes('/meals') ? 'meals' : 'drinks';

  useEffect(() => {
    const loadProgressFromLocalStorage = () => {
      const progress = localStorage.getItem(`${activePage}/${idParam}/in-progress`);
      if (progress) {
        setCheckedIng(JSON.parse(progress));
      }
    };
    loadProgressFromLocalStorage();
  }, [activePage, idParam]);

  useEffect(() => {
    const saveProgressToLocalStorage = () => {
      localStorage.setItem(`${activePage}/${idParam}/in-progress`, JSON
        .stringify(checkedIng));
    };

    saveProgressToLocalStorage();
  }, [activePage, checkedIng, idParam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activePage === 'meals') {
          const response = await fetchMealById(idParam as string);
          setMealRecipe(response);
        } else {
          const response = await fetchDrinkById(idParam as string);
          setDrinkRecipe(response);
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    fetchData();
  }, [activePage, idParam]);

  const handleIngredientToggle = (ingredient: string) => {
    if (checkedIng.includes(ingredient)) {
      setCheckedIng(checkedIng.filter((item) => item !== ingredient));
    } else {
      setCheckedIng([...checkedIng, ingredient]);
    }
  };

  const renderIngredients = (recipe: MealType | DrinkType) => {
    const ingredients: string[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingredientKey = `strIngredient${i}`;
      const ingredient = recipe[ingredientKey as keyof (MealType | DrinkType)];

      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(ingredient);
      }
    }

    return ingredients.map((ingredient, index) => (
      <div
        key={ index }
        data-testid={ `${index}-ingredient-step` }
        style={ {
          textDecoration: checkedIng[index]
            ? 'line-through solid rgb(0, 0, 0)' : 'none' } }
      >
        <input
          type="checkbox"
          id={ ingredient }
          name={ ingredient }
          value={ ingredient }
          checked={ checkedIng.includes(ingredient) }
          onChange={ () => handleIngredientToggle(ingredient) }
        />
        <label htmlFor={ ingredient }>{ ingredient }</label>
      </div>
    ));
  };

  return (
    <div className="recipe-card">
      {activePage === 'meals'
      && mealRecipe && (
        <>
          <h1 data-testid="recipe-title">
            {mealRecipe.strMeal}
          </h1>
          <source data-testid="recipe-photo" src={ mealRecipe.strMealThumb } />
          <button data-testid="share-btn">
            Share
          </button>
          <button data-testid="favorite-btn">
            Favorite
          </button>
          <p data-testid="recipe-category">{ mealRecipe.strCategory }</p>
          <p data-testid="instructions">{ mealRecipe.strInstructions }</p>
          {renderIngredients(mealRecipe)}
          <button data-testid="finish-recipe-btn">Finalizar Receita</button>
        </>)}

      {activePage === 'drinks'
      && drinkRecipe && (
        <>
          <h1 data-testid="recipe-title">
            {drinkRecipe.strDrink}
          </h1>
          <img
            src={ drinkRecipe.strDrinkThumb }
            alt={ drinkRecipe.strDrink }
            data-testid="recipe-photo"
          />
          <button data-testid="share-btn">
            Share
          </button>
          <button data-testid="favorite-btn">
            Favorite
          </button>
          <p data-testid="recipe-category">{ drinkRecipe.strCategory }</p>
          <p data-testid="instructions">{ drinkRecipe.strInstructions }</p>
          {renderIngredients(drinkRecipe)}
          <button data-testid="finish-recipe-btn">Finalizar Receita</button>
        </>)}
      <br />
      <br />
    </div>

  );
}

export default RecipeInProgress;
