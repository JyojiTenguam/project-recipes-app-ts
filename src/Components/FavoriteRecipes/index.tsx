import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Recipe, getFromLocalStorage } from '../../utils/localStorage';
import shareIcon from '../../images/shareIcon.svg';
import favoriteIcon from '../../images/blackHeartIcon.svg';

function FavoriteRecipes() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadFavoriteRecipes = () => {
      const fetchedFavoriteRecipes = getFromLocalStorage('favoriteRecipes');
      setFavoriteRecipes(fetchedFavoriteRecipes);
    };

    loadFavoriteRecipes();
  }, []);

  const handleShareClick = (recipe: Recipe) => {
    const recipeUrl = `${window.location.origin}/${recipe.type === 'meal'
      ? 'meals' : 'drinks'}/${recipe.id}`;
    navigator.clipboard.writeText(recipeUrl)
      .then(() => {
      })
      .catch((error) => {
        console.error('Erro ao copiar', error);
      });
  };

  return (
    <div>
      <div>
        <button data-testid="filter-by-all-btn">
          All
        </button>
        <button data-testid="filter-by-meal-btn">
          Meals
        </button>
        <button data-testid="filter-by-drink-btn">
          Drinks
        </button>
      </div>
      {favoriteRecipes.map((recipe, index) => (
        <div key={ recipe.id }>
          <Link to={ `/${recipe.type === 'meal' ? 'meals' : 'drinks'}/${recipe.id}` }>
            <img
              src={ recipe.image }
              alt={ recipe.name }
              data-testid={ `${index}-horizontal-image` }
              width={ 250 }
            />
            <p data-testid={ `${index}-horizontal-name` }>{recipe.name}</p>
          </Link>
          <p data-testid={ `${index}-horizontal-top-text` }>
            {recipe.type === 'meal'
              ? `${recipe.nationality}` : ''}
          </p>
          <input
            type="image"
            src={ shareIcon }
            alt="Compartilhar"
            onClick={ () => handleShareClick(recipe) }
            data-testid={ `${index}-horizontal-share-btn` }
          />
          <input
            type="image"
            src={ favoriteIcon }
            alt="Favoritar"
            data-testid={ `${index}-horizontal-favorite-btn` }
          />
          <div />
        </div>
      ))}
    </div>
  );
}

export default FavoriteRecipes;
