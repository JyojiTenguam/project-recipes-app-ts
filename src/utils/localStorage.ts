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

// Obtem os dados das receitas e armazena no local storage
export const getFromLocalStorage = (key: string): Recipe[] => {
  const recipesJSON = localStorage.getItem(key);
  return recipesJSON ? JSON.parse(recipesJSON) : [];
};
