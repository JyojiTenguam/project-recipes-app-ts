import { useState } from 'react';
import { getFromLocalStorage, Recipe } from '../../utils/localStorage';
import shareIcon from '../../images/shareIcon.svg';

function DoneRecipes() {
  const recipes: Recipe[] = getFromLocalStorage();

  const [recipeType, setRecipeType] = useState<'meal' | 'drink' | 'all'>('all');
  const [copied, setCopied] = useState(false);

  const recipeDetails = (recipe: Recipe, index: number) => {
    if (recipeType !== 'all' && recipe.type !== recipeType) {
      return null;
    }

    const handleShareClick = () => {
      const recipeUrl = `${window.location.origin}/${recipe.type === 'meal'
        ? 'meals' : 'drinks'}/${recipe.id}`;
      navigator.clipboard.writeText(recipeUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch((error) => {
          console.error('Erro ao copiar', error);
        });
    };

    return (
      <div key={ recipe.id }>
        <img
          src={ recipe.image }
          alt={ recipe.name }
          data-testid={ `${index}-horizontal-image` }
        />
        <p data-testid={ `${index}-horizontal-top-text` }>
          {recipe.type === 'meal'
            ? `${recipe.nationality} - ${recipe.category}` : 'Alcoholic'}
        </p>
        <p data-testid={ `${index}-horizontal-name` }>{recipe.name}</p>
        <p data-testid={ `${index}-horizontal-done-date` }>{recipe.doneDate}</p>

        {/* O input dessa forma com tipo de imagem define a imagem do atributo src como um botão de submit.
OBS: não se esquecer do prevent Defalt ao criar a lógica do botão. */}
        <input
          data-testid={ `${index}-horizontal-share-btn` }
          type="image"
          src={ shareIcon }
          alt="Compartilhar"
          onClick={ handleShareClick }
        />
        <div>
          {recipe.tags.map((tag, tagIndex) => (
            <span key={ tagIndex } data-testid={ `${index}-${tag}-horizontal-tag` }>
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div>
        <button
          data-testid="filter-by-all-btn"
          onClick={ () => setRecipeType('all') }
        >
          Todos
        </button>
        <button
          data-testid="filter-by-meal-btn"
          onClick={ () => setRecipeType('meal') }
        >
          Refeições
        </button>
        <button
          data-testid="filter-by-drink-btn"
          onClick={ () => setRecipeType('drink') }
        >
          Bebidas
        </button>
      </div>
      {recipes.map((recipe, index) => recipeDetails(recipe, index))}
      {copied && <p>Link copied!</p>}
    </div>
  );
}

export default DoneRecipes;

// ate aqui
