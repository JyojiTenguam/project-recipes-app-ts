type RecipeCardProps = {
  recipeName: string;
  recipeThumb: string;
  recipeId: string;
  index: number;
};

function RecipeCard({ recipeName, recipeThumb, recipeId, index }: RecipeCardProps) {
  return (
    <div data-testid={ `${index}-recipe-card` }>
      <h2 data-testid={ `${index}-card-name` }>{recipeName}</h2>
      <img src={ recipeThumb } alt={ recipeName } data-testid={ `${index}-card-img` } />
      <a href={ `/${recipeId}` }>See details</a>
    </div>
  );
}

export default RecipeCard;
