import { useState, useEffect } from 'react';
import { getFromLocalStorage, Recipe } from '../../utils/localStorage';
import shareIcon from '../../images/shareIcon.svg';

function DoneRecipes() {
  // Armazena as receitas
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  // Controla o tipo de receita a ser exibida
  const [recipeType, setRecipeType] = useState<'meal' | 'drink' | 'all'>('all');
  // Controlar se a mensagem link é copiada
  const [copied, setCopied] = useState(false);
  // Carrega as receitas da localStorage
  useEffect(() => {
    const loadRecipes = () => {
      const fetchLoadRecipes = getFromLocalStorage();
      // Atualiza o estado das receitas
      setRecipes(fetchLoadRecipes);
    };
    loadRecipes();
  }, []); // Executa apenas uma vez, quando o componente é montado
  // Filtra as receitas com base no tipo
  useEffect(() => {
    const filterRecipes = () => {
      if (recipeType === 'all') {
        // Se for 'all', carrega todas as receitas da localStorage
        const fetchAllRecipes = getFromLocalStorage();
        setRecipes(fetchAllRecipes);
      } else {
        // Caso contrário, filtra as receitas da localStorage com base no tipo (meal ou drink)
        const fetchUnicRecipes = getFromLocalStorage()
          .filter((recipe) => recipe.type === recipeType);
        setRecipes(fetchUnicRecipes);
      }
    };
    filterRecipes();
  }, [recipeType]); // Atualiza sempre que recipeType mudar
  // Função para lidar com o clique nos botões de filtro
  const handleFilter = (type: 'meal' | 'drink' | 'all') => {
    setRecipeType(type);
  };
  // Função para lidar com o clique no botão de compartilhar
  const handleShareClick = (recipe: Recipe) => {
    // Monta a URL da receita
    const recipeUrl = `${window.location.origin}/${recipe.type === 'meal'
      ? 'meals' : 'drinks'}/${recipe.id}`;
    // Copia a URL para a área de transferência
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
    <div>
      {/* Botões de filtro para escolher o tipo de receita a ser exibido */}
      <div>
        <button data-testid="filter-by-all-btn" onClick={ () => handleFilter('all') }>
          All
        </button>
        <button data-testid="filter-by-meal-btn" onClick={ () => handleFilter('meal') }>
          Meals
        </button>
        <button data-testid="filter-by-drink-btn" onClick={ () => handleFilter('drink') }>
          Drinks
        </button>
      </div>
      {/* Renderização do card da receita */}
      {recipes.map((recipe, index) => (
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
          {/* Botão de compartilhamento para cada receita */}
          <input
            type="image"
            src={ shareIcon }
            alt="Compartilhar"
            onClick={ () => handleShareClick(recipe) }
            data-testid={ `${index}-horizontal-share-btn` }
          />
          <div>
            {/* Renderiza as tags associadas à receita */}
            {recipe.tags.map((tag, tagIndex) => (
              <span key={ tagIndex } data-testid={ `${index}-${tag}-horizontal-tag` }>
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
      {/* Exibição da mensagem copiada */}
      {copied && <p>Link copied!</p>}
    </div>
  );
}

export default DoneRecipes;
