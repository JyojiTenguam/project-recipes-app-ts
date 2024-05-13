export interface Recipe {
  id: string;
  type: 'meal' | 'drink';
  nationality: string;
  category: string;
  alcoholicOrNot: string;
  name: string;
  image: string;
  doneDate: string;
  tags: string[];
}

export const getFromLocalStorage = (): Recipe[] => {
  const doneRecipesJSON = localStorage.getItem('doneRecipes');
  return doneRecipesJSON ? JSON.parse(doneRecipesJSON) : [];
};
export const getInProgressRecipes = (): Record<string, string[]> => {
  const inProgressRecipesJSON = localStorage.getItem('inProgressRecipes');
  return inProgressRecipesJSON ? JSON.parse(inProgressRecipesJSON) : {};
};
export const isRecipeInProgress = (type: string, id: string): boolean => {
  const inProgressRecipes = getInProgressRecipes();
  return inProgressRecipes[type] ? Object
    .keys(inProgressRecipes[type]).includes(id) : false;
};

export const getFavoriteRecipes = (): Recipe[] => {
  const favoriteRecipesJSON = localStorage.getItem('favoriteRecipes');
  return favoriteRecipesJSON ? JSON.parse(favoriteRecipesJSON) : [];
};
