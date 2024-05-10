import { DrinkType } from '../utils/types';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export const fetchDrinksByIngredient = async (ingredient: string):
Promise<DrinkType[]> => {
  const response = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`);
  const data = await response.json();
  return data.drinks;
};

export const fetchDrinksByName = async (name: string): Promise<DrinkType[]> => {
  const response = await fetch(`${BASE_URL}/search.php?s=${name}`);
  const data = await response.json();
  return data.drinks;
};

export const fetchDrinksByFirstLetter = async (letter: string): Promise<DrinkType[]> => {
  const response = await fetch(`${BASE_URL}/search.php?f=${letter}`);
  const data = await response.json();
  return data.drinks;
};
