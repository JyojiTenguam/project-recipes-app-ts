import React from 'react';
import { getFromLocalStorage } from '../../utils/localStorage';

const doneRecipes: React.FC = () => {
  const recipes = getFromLocalStorage();
  return (
    <div>
      <div>

        <button
          data-testid="filter-by-all-btn"
          onClick={ () => console.log('Filtrar Todos') }
        >
          Todos
        </button>
        <button
          data-testid="filter-by-meal-btn"
          onClick={ () => console.log('Filtrar refeições') }
        >
          Refeições
        </button>
        <button
          data-testid="filter-by-drink-btn"
          onClick={ () => console.log('') }
        >
          Bebidas
        </button>
      </div>
      {recipes.map((recipe, index) => (
        <div key={ recipe.id }>
          <img
            src={ recipe.image }
            alt={ recipe.name }
            data-testid={ `${index}-horizontal-image` }
          />
          <p data-testid={ `${index}-horizontal-top-text` }>
            { recipe.nationality }
            { recipe.category }
          </p>
          <p data-testid={ `${index}-horizontal-name` }>
            {recipe.name}
          </p>
          <p data-testid={ `${index}-horizontal-done-date` }>
            {recipe.doneDate}
          </p>
          <button data-testid={ `${index}-horizontal-share-btn` }>
            Compartilhar
          </button>
          <div>
            { recipe.tags.map((tag, tagIndex) => (
              <span key={ tagIndex } data-testid={ `${index}-${tag}-horizontal-tag` }>
                {tag}
              </span>
            )) }
          </div>
        </div>
      ))}
    </div>
  );
};
export default doneRecipes;
