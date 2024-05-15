import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { isRecipeInProgress } from '../../utils/localStorage';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import { RecipeDetailsType, RecipeType, MealType, DrinkType } from '../../utils/types';
import './style.css';

function RecipeDetails() {
  const [recipe, setRecipe] = useState<RecipeDetailsType>();
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const type = location.pathname
    .includes('meals') ? 'meals' : 'drinks' as keyof RecipeDetailsType;
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<(MealType | DrinkType)[]>([]);
  useEffect(() => {
    const fetchRecommendations = async () => {
      let endpoint = '';
      if (type === 'meals') {
        endpoint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
      } else if (type === 'drinks') {
        endpoint = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
      } try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Erro ao carregar os dados');
        }
        const data = await response.json();
        setRecommendations(data[type === 'meals' ? 'drinks' : 'meals']);
      } catch (error) {
        console.error('Erro:', error);
      }
    }; fetchRecommendations();
  }, [type]);
  useEffect(() => {
    const fetchRecipe = async () => {
      let endpoint = '';
      if (type === 'meals') {
        endpoint = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
      } else if (type === 'drinks') {
        endpoint = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
      } try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Erro ao carregar os dados');
        }
        const data = await response.json();
        setRecipe(data);
        const favoriteRecipes: RecipeType[] = JSON
          .parse(localStorage.getItem('favoriteRecipes') || '[]');
        const isRecipeFavorite = favoriteRecipes.some((favRecipe) => favRecipe.id === id);
        setIsFavorite(isRecipeFavorite);
      } catch (error) {
        console.error('Erro:', error);
      }
    }; fetchRecipe();
  }, [id, type]);
  const copyToClipboard = async () => {
    const link = window.location.href;
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
  const toggleFavorite = () => {
    const favoriteRecipes: RecipeType[] = JSON
      .parse(localStorage.getItem('favoriteRecipes') || '[]');
    const index = favoriteRecipes.findIndex((favRecipe) => favRecipe.id === id);
    if (index !== -1) {
      favoriteRecipes.splice(index, 1); // Remove a receita do array de favoritos
      localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
      setIsFavorite(false);
    } else {
      if (!recipe) return;
      const attRecipe = recipe[type] ? recipe[type]?.[0] : null;
      if (!attRecipe) return;
      let newRecipe;
      if (type === 'meals') {
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
      favoriteRecipes.push(newRecipe); // Adiciona a receita ao array de favoritos
      localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
      setIsFavorite(true);
    }
  }; if (!recipe || recommendations.length === 0) {
    return <div>Carregando...</div>;
  }
  const renderIngredients = () => {
    const ingredients = [];
    for (let index = 0; index <= 20; index++) {
      const ingredient = recipe[type]?.[0][`strIngredient${index + 1}`];
      const measure = recipe[type]?.[0][`strMeasure${index + 1}`];
      if (ingredient && measure) {
        ingredients.push(
          <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
            {`${ingredient} - ${measure}`}
          </li>,
        );
      }
    } return ingredients;
  };
  return (
    <div>
      <img
        src={ type === 'meals' ? recipe.meals?.[0]
          .strMealThumb : recipe.drinks?.[0].strDrinkThumb }
        alt="Recipe"
        data-testid="recipe-photo"
      />
      <h2 data-testid="recipe-title">
        {type === 'meals' ? recipe.meals?.[0].strMeal : recipe.drinks?.[0].strDrink}
      </h2>
      <p data-testid="recipe-category">
        {type === 'meals'
          ? recipe.meals?.[0].strCategory
          : recipe.drinks?.[0].strCategory}
      </p>
      {type === 'drinks' && recipe.drinks?.[0].strAlcoholic && (
        <p data-testid="recipe-category">
          {recipe.drinks?.[0].strAlcoholic}
        </p>
      )}
      <h3>Ingredientes:</h3>
      <ul>{renderIngredients()}</ul>
      <h3>Recomendações:</h3>
      <div
        style={ {
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          WebkitOverflowScrolling: 'touch',
          padding: '10px',
        } }
      >
        {recommendations.slice(0, 6).map((recommendation, index) => (
          <div
            key={ index }
            style={ {
              flex: '0 0 auto',
              width: '200px',
              marginRight: '10px',
              borderRadius: '10px',
              overflow: 'hidden',
            } }
            data-testid={ `${index}-recommendation-card` }
          >
            <p
              style={ {
                backgroundColor: '#F0F0F0',
                padding: '10px',
                margin: '0',
                borderRadius: '10px',
              } }
              data-testid={ `${index}-recommendation-title` }
            >
              {type === 'meals' ? recommendation.strDrink : recommendation.strMeal}
            </p>
          </div>
        ))}
      </div>
      <h3>Instruções:</h3>
      <p data-testid="instructions">
        {type === 'meals' ? recipe.meals?.[0]
          .strInstructions : recipe.drinks?.[0].strInstructions}
      </p>
      {type === 'meals' && recipe.meals?.[0].strYoutube && (
        <div data-testid="video">
          <iframe
            title="Recipe Video"
            width="560"
            height="315"
            src={ `https://www.youtube.com/embed/${recipe.meals?.[0].strYoutube.slice(-11)}` }
            allowFullScreen
          />
        </div>
      )}
      <button
        data-testid="start-recipe-btn"
        style={ { position: 'fixed',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20%' } }
        onClick={ () => navigate(`/${type.endsWith('s')
          ? type : `${type}s`}/${id}/in-progress`) }
      >
        {isRecipeInProgress(type, id!.toString()) ? 'Continue Recipe' : 'Start Recipe'}
      </button>
      <button
        data-testid="share-btn"
        className="share-btn"
        onClick={ copyToClipboard }
      >
        <img src={ shareIcon } alt="Share" style={ { width: '20px' } } />
        Compartilhar
      </button>
      <button
        onClick={ toggleFavorite }
      >
        <img
          data-testid="favorite-btn"
          src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
          alt="Favorite"
          style={ { width: '20px' } }
        />
      </button>
      {copied && (
        <p>
          Link copied!
        </p>)}
    </div>
  );
}
export default RecipeDetails;
