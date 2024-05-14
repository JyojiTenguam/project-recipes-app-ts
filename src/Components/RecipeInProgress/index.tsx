import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DrinkType, MealType } from '../../utils/types';
import { fetchDrinkById } from '../../Services/ApiDrinks';
import { fetchMealById } from '../../Services/ApiMeals';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';

function RecipeInProgress() {
  const [mealRecipe, setMealRecipe] = useState<MealType>();
  const [drinkRecipe, setDrinkRecipe] = useState<DrinkType>();
  const { id: idParam } = useParams<string>();
  const [checkedIng, setCheckedIng] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const location = useLocation();
  const activePage = location.pathname.includes('/meals') ? 'meals' : 'drinks';
  const navigate = useNavigate();

  useEffect(() => {
    const favoriteStatus = localStorage.getItem(`${activePage}-${idParam}-favorite`);
    if (favoriteStatus) {
      setIsFavorite(JSON.parse(favoriteStatus));
    }
  }, [activePage, idParam]);

  useEffect(() => {
    const loadProgressFromLocalStorage = () => {
      const progress = localStorage.getItem(`${activePage}/${idParam}/in-progress`);
      if (progress) {
        setCheckedIng(JSON.parse(progress));
      }
      const favorite = localStorage.getItem(`${activePage}/${idParam}/favorite`);
      if (favorite) {
        setIsFavorite(JSON.parse(favorite));
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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    localStorage.setItem(`${activePage}/${idParam}/favorite`, JSON
      .stringify(!isFavorite));
  };

  const shareRecipe = () => {
    const recipeUrl = `${window.location.origin}/${activePage}/${idParam}`;
    navigator.clipboard.writeText(recipeUrl);
    setCopied(true);
  };

  const handleIngredientToggle = (ingredient: string) => {
    if (checkedIng.includes(ingredient)) {
      setCheckedIng(checkedIng.filter((item) => item !== ingredient));
    } else {
      setCheckedIng([...checkedIng, ingredient]);
    }
  };

  const handleDoneRecipes = () => {
    navigate('/done-recipes');
  };
  const ingredients: string[] = [];

  const renderIngredients = (recipe: MealType | DrinkType) => {
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
          <button data-testid="share-btn" onClick={ shareRecipe }>
            Share
          </button>
          {copied && <p>Link copied!</p>}
          <button
            data-testid="favorite-btn"
            onClick={ toggleFavorite }
            src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
          <p data-testid="recipe-category">{ mealRecipe.strCategory }</p>
          <p data-testid="instructions">{ mealRecipe.strInstructions }</p>
          {renderIngredients(mealRecipe)}
          <button
            data-testid="finish-recipe-btn"
            disabled={ checkedIng.length !== ingredients.length }
            onClick={ handleDoneRecipes }
          >
            Finalizar Receita
          </button>
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
          <button data-testid="share-btn" onClick={ shareRecipe }>
            Share
          </button>
          {copied && <p>Link copied!</p>}
          <button
            data-testid="favorite-btn"
            onClick={ toggleFavorite }
            src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
          <p data-testid="recipe-category">{ drinkRecipe.strCategory }</p>
          <p data-testid="instructions">{ drinkRecipe.strInstructions }</p>
          {renderIngredients(drinkRecipe)}
          <button
            data-testid="finish-recipe-btn"
            disabled={ checkedIng.length !== ingredients.length }
            onClick={ handleDoneRecipes }
          >
            Finalizar Receita
          </button>
        </>)}
      <br />
      <br />
    </div>
  );
}

export default RecipeInProgress;
