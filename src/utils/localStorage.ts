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

export const getFromLocalStorage = (key: string): Recipe[] => {
  const recipesJSON = localStorage.getItem(key);
  return recipesJSON ? JSON.parse(recipesJSON) : [];
};

export const setToLocalStorage = (key: string, data: Recipe[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};
