import { RecipeType } from './types';

export const getFromLocalStorage = (): RecipeType[] => {
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

export const getFavoriteRecipes = (): RecipeType[] => {
  const favoriteRecipesJSON = localStorage.getItem('favoriteRecipes');
  return favoriteRecipesJSON ? JSON.parse(favoriteRecipesJSON) : [];
};
