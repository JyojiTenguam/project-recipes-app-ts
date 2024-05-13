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
