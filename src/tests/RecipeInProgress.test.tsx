import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RecipeInProgress from '../Components/RecipeInProgress';
import renderWithRouter from './RenderWithRouter';
import oneMealResult from './mocks/oneResultMeal';
import oneResultDrink from './mocks/oneResultDrink';

describe('RecipeInProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const finishRecipeBttn = 'finish-recipe-btn';
  const recipePhoto = 'recipe-photo';
  const favoriteBtn = 'favorite-btn';
  const URL_DRINK_INPROGRESS = '/drinks/11118/in-progress';
  const STORAGE_DRINKS = 'drinks/11118/in-progress';
  const DRINK_TITLE = 'Blue Margarita';
  it('Render Loading', () => {
    renderWithRouter(<RecipeInProgress />, { route: '/meals/52977/in-progress' });

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('Meals', async () => {
    localStorage.clear();
    const MockMeal = {
      ok: true,
      status: 200,
      json: async () => oneMealResult,
    } as Response;
    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockMeal);

    const { user, findAllByTestId } = renderWithRouter(<RecipeInProgress />, { route: '/meals/52977/in-progress' });

    await screen.findByTestId(recipePhoto);

    expect(screen.getByTestId('recipe-title')).toHaveTextContent('Spicy Arrabiata Penne');

    const finishRecipeButton = screen.getByTestId(finishRecipeBttn);
    expect(finishRecipeButton).toBeDisabled();

    const ingredientCheckbox = await findAllByTestId(/-ingredient-step$/);
    expect(ingredientCheckbox).toHaveLength(2);
    const firstIngredient = await screen.getByRole('checkbox', { name: /penne rigate/i });
    const secondIngredient = await screen.getByRole('checkbox', { name: /olive oil/i });
    expect(firstIngredient).not.toBeChecked();
    await user.click(firstIngredient);
    expect(firstIngredient).toBeChecked();
    await user.click(secondIngredient);
    expect(screen.getByTestId('recipe-category')).toHaveTextContent('Vegetarian');
    expect(screen.getByTestId('instructions')).toHaveTextContent('Bring a large');
    await expect(mockFetch).toHaveBeenCalledTimes(1);
    screen.getByTestId(favoriteBtn).click();
    screen.getByTestId('share-btn').click();
    await user.click(finishRecipeButton);

    expect(localStorage.getItem('doneRecipes')).not.toBeNull();
    expect(localStorage.getItem('doneRecipes')).toContain('Spicy Arrabiata Penne');
  });

  it('Drinks', async () => {
    localStorage.clear();
    const MockDrink = {
      ok: true,
      status: 200,
      json: async () => oneResultDrink,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockDrink);

    const { user, findAllByTestId } = renderWithRouter(<RecipeInProgress />, { route: URL_DRINK_INPROGRESS });

    await screen.findByTestId(recipePhoto);
    expect(screen.getByTestId('recipe-title')).toHaveTextContent(DRINK_TITLE);
    const finishRecipeButton = screen.getByTestId(finishRecipeBttn);
    expect(finishRecipeButton).toBeDisabled();

    const ingredientCheckbox = await findAllByTestId(/-ingredient-step$/);
    expect(ingredientCheckbox).toHaveLength(4);
    const firstIngredient = await screen.getByRole('checkbox', { name: /Tequila/i });
    expect(firstIngredient).not.toBeChecked();
    await user.click(firstIngredient);
    expect(firstIngredient).toBeChecked();
    const secondIngredient = await screen.getByRole('checkbox', { name: /Blue Curacao/i });
    const thirdIngredient = await screen.getByRole('checkbox', { name: /Lime juice/i });
    const fourthIngredient = await screen.getByRole('checkbox', { name: /Salt/i });

    await user.click(secondIngredient);
    await user.click(thirdIngredient);
    await user.click(fourthIngredient);

    const categories = await screen.findAllByTestId('recipe-category');
    expect(categories[0]).toHaveTextContent('Ordinary Drink');
    expect(categories[1]).toHaveTextContent('Alcoholic');
    expect(screen.getByTestId('instructions')).toHaveTextContent('Rub rim of cocktail');
    await expect(mockFetch).toHaveBeenCalledTimes(1);
    screen.getByTestId(favoriteBtn).click();
    screen.getByTestId('share-btn').click();
    expect(localStorage.getItem('favoriteRecipes')).not.toBeNull();
    expect(localStorage.getItem('favoriteRecipes')).not.toBeNull();
    await user.click(finishRecipeButton);
  });

  it('Finish Recipe Test', async () => {
    localStorage.clear();
    localStorage.setItem(STORAGE_DRINKS, JSON.stringify(['Tequila']));
    const MockDrink = {
      ok: true,
      status: 200,
      json: async () => oneResultDrink,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockDrink);
    const { user } = renderWithRouter(<RecipeInProgress />, { route: URL_DRINK_INPROGRESS });

    await screen.findByTestId(recipePhoto);

    const finishRecipeButton = screen.getByTestId(finishRecipeBttn);
    expect(finishRecipeButton).toBeDisabled();
    screen.getByTestId(favoriteBtn).click();

    const firstIngredient = await screen.getByRole('checkbox', { name: /Tequila/i });
    const secondIngredient = await screen.getByRole('checkbox', { name: /Blue Curacao/i });
    const thirdIngredient = await screen.getByRole('checkbox', { name: /Lime juice/i });
    const fourthIngredient = await screen.getByRole('checkbox', { name: /Salt/i });
    await user.click(firstIngredient);
    await user.click(secondIngredient);
    await user.click(thirdIngredient);
    await user.click(fourthIngredient);

    expect(localStorage.getItem('favoriteRecipes')).not.toBeNull();
    expect(localStorage.getItem('favoriteRecipes')).toContain(DRINK_TITLE);
    await expect(localStorage.getItem(STORAGE_DRINKS)).toContain('Tequila');

    expect(finishRecipeButton).not.toBeDisabled();

    await user.click(finishRecipeButton);

    await expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('doneRecipes')).not.toBeNull();
    expect(localStorage.getItem('doneRecipes')).toContain(DRINK_TITLE);
  });

  it('Local Storage Test', async () => {
    localStorage.setItem(STORAGE_DRINKS, JSON.stringify(['Tequila']));
    const MockDrink = {
      ok: true,
      status: 200,
      json: async () => oneResultDrink,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockDrink);
    const { user } = renderWithRouter(<RecipeInProgress />, { route: URL_DRINK_INPROGRESS });

    await screen.findByTestId(recipePhoto);

    const finishRecipeButton = screen.getByTestId(finishRecipeBttn);
    screen.getByTestId(favoriteBtn).click();

    expect(localStorage.getItem('favoriteRecipes')).not.toBeNull();
    expect(localStorage.getItem('favoriteRecipes')).toContain(DRINK_TITLE);

    expect(finishRecipeButton).not.toBeDisabled();
    expect(localStorage.getItem(STORAGE_DRINKS)).not.toBeNull();
    await expect(localStorage.getItem(STORAGE_DRINKS)).toContain('Tequila');

    await user.click(finishRecipeButton);

    await expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('Error log', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Erro ao carregar os dados'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithRouter(<RecipeInProgress />, { route: '/drinks/11118/in-progress' });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Erro:', new Error('Erro ao carregar os dados'));
    });

    mockFetch.mockRestore();
    consoleSpy.mockRestore();
  });
  it('handles error when copying link to clipboard fails', async () => {
    localStorage.clear();
    localStorage.setItem('drinks/11118/in-progress', JSON.stringify(['Tequila']));
    localStorage.setItem('favoriteRecipes', JSON.stringify([{ name: 'Blue Margarita' }]));

    const MockDrink = {
      ok: true,
      status: 200,
      json: async () => oneResultDrink,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockDrink);
    const mockClipboard = vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Erro ao copiar para a área de transferência'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { user } = renderWithRouter(<RecipeInProgress />, { route: URL_DRINK_INPROGRESS });

    await screen.findByTestId('recipe-photo');

    const shareButton = screen.getByTestId('share-btn');
    await user.click(shareButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Erro ao copiar para a área de transferência:', new Error('Erro ao copiar para a área de transferência'));
    });

    mockFetch.mockRestore();
    mockClipboard.mockRestore();
    consoleSpy.mockRestore();
  });
});
