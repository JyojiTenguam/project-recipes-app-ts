import { RecipeType } from './types';

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
  favorite: boolean;
}

export const getFromLocalStorage = (): RecipeType[] => {
  const doneRecipesJSON = localStorage.getItem('doneRecipes');
  return doneRecipesJSON ? JSON.parse(doneRecipesJSON) : [];
};

/*Qual a função dessa getFromLocalStorage
 export const getFromLocalStorage = (key: string): Recipe[] => {
  const recipesJSON = localStorage.getItem(key);
  return recipesJSON ? JSON.parse(recipesJSON) : [];
}; */

export const setToLocalStorage = (key: string, data: Recipe[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
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
