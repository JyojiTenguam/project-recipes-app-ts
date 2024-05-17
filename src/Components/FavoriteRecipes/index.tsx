import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Recipe, getLocalStorage, setToLocalStorage } from '../../utils/localStorage';
import shareIcon from '../../images/shareIcon.svg';
import favoriteIcon from '../../images/blackHeartIcon.svg';

function FavoriteRecipes() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [copied, setCopied] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'meal' | 'drink'>('all');

  useEffect(() => {
    const loadFavoriteRecipes = () => {
      const fetchedFavoriteRecipes = getLocalStorage('favoriteRecipes');
      setFavoriteRecipes(fetchedFavoriteRecipes);
    };

    loadFavoriteRecipes();
  }, []);

  const handleRemoveFavorite = (recipeId: string) => {
    const upFavorites = favoriteRecipes.filter((recipe) => recipe.id !== recipeId);
    setFavoriteRecipes(upFavorites);
    setToLocalStorage('favoriteRecipes', upFavorites);
  };

  const handleShareClick = (recipe: Recipe) => {
    const recipeUrl = `${window.location.origin}/${recipe.type === 'meal'
      ? 'meals' : 'drinks'}/${recipe.id}`;
    navigator.clipboard.writeText(recipeUrl)
      .then(() => {
        setCopied(true);
      })
      .catch((error) => {
        console.error('Erro ao copiar', error);
      });
  };

  const handleFilterByType = (type: 'all' | 'meal' | 'drink') => {
    setFilterType(type);
  };
  const filteredRecipes = filterType === 'all'
    ? favoriteRecipes
    : favoriteRecipes.filter((recipe) => (filterType === 'meal' && recipe.type === 'meal')
|| (filterType === 'drink' && recipe.type === 'drink'));

  return (
    <div>
      <div>
        <button
          data-testid="filter-by-all-btn"
          onClick={ () => handleFilterByType('all') }
        >
          All
        </button>
        <button
          data-testid="filter-by-meal-btn"
          onClick={ () => handleFilterByType('meal') }
        >
          Meals
        </button>
        <button
          data-testid="filter-by-drink-btn"
          onClick={ () => handleFilterByType('drink') }
        >
          Drinks
        </button>
      </div>
      {filteredRecipes.map((recipe, index) => (
        <div key={ recipe.id }>
          <Link to={ `/${recipe.type === 'meal' ? 'meals' : 'drinks'}/${recipe.id}` }>
            <img
              src={ recipe.image }
              alt={ recipe.name }
              data-testid={ `${index}-horizontal-image` }
              width={ 100 }
            />
            <p data-testid={ `${index}-horizontal-name` }>{recipe.name}</p>
          </Link>
          <p data-testid={ `${index}-horizontal-top-text` }>
            {recipe.type === 'meal'
              ? `${recipe.nationality} - ${recipe.category}` : 'Alcoholic'}
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
            alt="Desfavoritar"
            onClick={ () => handleRemoveFavorite(recipe.id) }
            data-testid={ `${index}-horizontal-favorite-btn` }
          />
          <div />
        </div>
      ))}
      {copied && <p>Link copied!</p>}
    </div>
  );
}

export default FavoriteRecipes;
