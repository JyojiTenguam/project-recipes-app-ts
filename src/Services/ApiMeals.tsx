import { CategoryType, MealType } from '../utils/types';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const fetchMealsByIngredient = async (ingredient: string): Promise<MealType[]> => {
  const response = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`);
  const data = await response.json();
  return data.meals;
};

export const fetchMealsByName = async (name: string): Promise<MealType[]> => {
  const response = await fetch(`${BASE_URL}/search.php?s=${name}`);
  const data = await response.json();
  return data.meals;
};

export const fetchMealsByFirstLetter = async (letter: string): Promise<MealType[]> => {
  const response = await fetch(`${BASE_URL}/search.php?f=${letter}`);
  const data = await response.json();
  return data.meals;
};

export const fetchMeals = async (): Promise<MealType[]> => {
  const response = await fetch(`${BASE_URL}/search.php?s=`);
  const data = await response.json();
  return data.meals;
};

export const fetchMealsListByCategory = async (): Promise<CategoryType[]> => {
  const response = await fetch(`${BASE_URL}/list.php?c=list`);
  const data = await response.json();
  return data.meals;
};

export const fetchFilterMealsByCategory = async (cat:string):
Promise<MealType[]> => {
  const response = await fetch(`${BASE_URL}/filter.php?c=${cat}`);
  const data = await response.json();
  return data.meals;
};

export const fetchMealById = async (id: string): Promise<MealType> => {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await response.json();
  return data.meals[0];
};
