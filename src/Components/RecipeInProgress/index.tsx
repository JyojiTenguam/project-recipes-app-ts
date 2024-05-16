import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DrinkType, MealType, RecipeDetailsType, RecipeType } from '../../utils/types';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';

function RecipeInProgress() {
  const [recipe, setRecipe] = useState<RecipeDetailsType>();
  const { id: idParam } = useParams<string>();
  const [checkedIng, setCheckedIng] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const location = useLocation();
  const activePage = location.pathname
    .includes('/meals') ? 'meals' : 'drinks' as keyof RecipeDetailsType;
  const navigate = useNavigate();

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
    const fetchRecipe = async () => {
      let endpoint = '';
      if (activePage === 'meals') {
        endpoint = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idParam}`;
      } else if (activePage === 'drinks') {
        endpoint = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idParam}`;
      } try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Erro ao carregar os dados');
        }
        const data = await response.json();
        setRecipe(data);
        const favoriteRecipes: RecipeType[] = JSON
          .parse(localStorage.getItem('favoriteRecipes') || '[]');
        const isRecipeFavorite = favoriteRecipes
          .some((favRecipe) => favRecipe.id === idParam);
        setIsFavorite(isRecipeFavorite);
      } catch (error) {
        console.error('Erro:', error);
      }
    }; fetchRecipe();
  }, [idParam, activePage]);

  const toggleFavorite = () => {
    const favoriteRecipes: RecipeType[] = JSON
      .parse(localStorage.getItem('favoriteRecipes') || '[]');
    const index = favoriteRecipes.findIndex((favRecipe) => favRecipe.id === idParam);
    if (index !== -1) {
      favoriteRecipes.splice(index, 1);
      localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
      setIsFavorite(false);
    } else {
      if (!recipe) return;
      const attRecipe = recipe[activePage] ? recipe[activePage]?.[0] : null;
      if (!attRecipe) return;
      let newRecipe;
      if (activePage === 'meals') {
        const meal = attRecipe as MealType;
        newRecipe = {
          id: meal.idMeal,
          type: 'meal',
          nationality: meal.strArea,
          category: meal.strCategory,
          alcoholicOrNot: '',
          name: meal.strMeal,
          image: meal.strMealThumb,
        } as unknown as RecipeType;
      } else {
        const drink = attRecipe as DrinkType;
        newRecipe = {
          id: drink.idDrink,
          type: 'drink',
          nationality: '',
          category: drink.strCategory,
          alcoholicOrNot: drink.strAlcoholic,
          name: drink.strDrink,
          image: drink.strDrinkThumb,
        } as unknown as RecipeType;
      }
      favoriteRecipes.push(newRecipe);
      localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
      setIsFavorite(true);
    }
  };

  const shareRecipe = async () => {
    const link = `${window.location.origin}/${activePage}/${idParam}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.error('Erro ao copiar para a área de transferência:', error);
    }
  };

  const handleIngredientToggle = (ingredient: string) => {
    if (checkedIng.includes(ingredient)) {
      setCheckedIng(checkedIng.filter((item) => item !== ingredient));
    } else {
      setCheckedIng([...checkedIng, ingredient]);
    }
  };

  if (!recipe) {
    return <div>Carregando...</div>;
  }

  const ingredients: string[] = [];
  const renderIngredients = () => {
    for (let index = 0; index <= 20; index++) {
      const ingredient = recipe[activePage]?.[0][`strIngredient${index + 1}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(ingredient);
      }
    } return ingredients.map((ingredient, index) => (
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
  let tags: string[] = [];
  const mealTags = recipe.meals?.[0].strTags;
  const drinkTags = recipe.drinks?.[0].strTags;
  if (activePage === 'meals') {
    if (mealTags) {
      tags = mealTags.split(',').filter((tag) => tag.trim() !== '');
    }
  } else if (drinkTags) {
    tags = drinkTags.split(',').filter((tag) => tag.trim() !== '');
  }
  const markRecipeAsDone = () => {
    const dateNow = new Date();
    const typeRecipe = activePage === 'meals' ? 'meal' : 'drink';
    const doneRecipe = {
      id: idParam,
      nationality: activePage === 'meals' ? recipe.meals?.[0].strArea : '',
      name: activePage === 'meals' ? recipe.meals?.[0].strMeal
        : recipe.drinks?.[0].strDrink,
      category: activePage === 'meals' ? recipe.meals?.[0].strCategory
        : recipe.drinks?.[0].strCategory,
      image: activePage === 'meals' ? recipe.meals?.[0].strMealThumb
        : recipe.drinks?.[0].strDrinkThumb,
      tags,
      alcoholicOrNot: activePage === 'meals' ? '' : recipe.drinks?.[0].strAlcoholic || '',
      type: typeRecipe,
      doneDate: dateNow.toISOString(),
    };

    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes') || '[]');
    doneRecipes.push(doneRecipe);
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    navigate('/done-recipes');
  };

  return (
    <div>
      <img
        src={ activePage === 'meals' ? recipe.meals?.[0]
          .strMealThumb : recipe.drinks?.[0].strDrinkThumb }
        alt="Recipe"
        data-testid="recipe-photo"
      />
      <h2 data-testid="recipe-title">
        {activePage === 'meals' ? recipe.meals?.[0].strMeal : recipe.drinks?.[0].strDrink}
      </h2>
      <p data-testid="recipe-category">
        {activePage === 'meals'
          ? recipe.meals?.[0].strCategory
          : recipe.drinks?.[0].strCategory}
      </p>
      {activePage === 'drinks' && recipe.drinks?.[0].strAlcoholic && (
        <p data-testid="recipe-category">{recipe.drinks?.[0].strAlcoholic}</p>
      )}
      <h3>Ingredientes:</h3>
      <ul>{renderIngredients()}</ul>
      <h3>Instruções:</h3>
      <p data-testid="instructions">
        {activePage === 'meals' ? recipe.meals?.[0]
          .strInstructions : recipe.drinks?.[0].strInstructions}
      </p>
      <button
        data-testid="finish-recipe-btn"
        disabled={ checkedIng.length !== ingredients.length }
        style={ { position: 'fixed',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20%' } }
        onClick={ markRecipeAsDone }
      >
        Finish Recipe
      </button>
      <button
        data-testid="share-btn"
        className="share-btn"
        onClick={ shareRecipe }
      >
        <img src={ shareIcon } alt="Share" style={ { width: '20px' } } />
        Compartilhar
      </button>
      {copied && (<p>Link copied!</p>)}
      <button onClick={ toggleFavorite }>
        <img
          data-testid="favorite-btn"
          src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
          alt="Favorite"
          style={ { width: '20px' } }
        />
      </button>
    </div>
  );
}
export default RecipeInProgress;
