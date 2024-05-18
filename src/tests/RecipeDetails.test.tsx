import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RecipeDetails from '../Components/RecipeDetails';
import oneMealResult from './mocks/oneResultMeal';
import oneResultDrink from './mocks/oneResultDrink';
import { mockDrinksAPI } from './mocks/mockDrinksAPI';
import renderWithRouter from './RenderWithRouter';
import { mockMealsAPI } from './mocks/mockMealsAPI';

const URL_DRINKS = '/drinks/11118';
const ERROR = 'Erro ao carregar os dados';
const STARTBUTTON = 'start-recipe-btn';
const FAVORITEBUTTON = 'favorite-btn';

describe('RecipeDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders Loading state', () => {
    renderWithRouter(<RecipeDetails />, { route: '/meals/52977' });
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('renders Meal Details correctly', async () => {
    const mockMealResponse = {
      ok: true,
      status: 200,
      json: async () => oneMealResult,
    };
    const mockDrinkRecommendations = {
      ok: true,
      status: 200,
      json: async () => mockDrinksAPI,
    };

    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(mockDrinkRecommendations as Response)
      .mockResolvedValueOnce(mockMealResponse as Response);

    const { user } = renderWithRouter(<RecipeDetails />, { route: '/meals/52771' });

    await waitFor(() => expect(screen.getByTestId('recipe-title')).toHaveTextContent('Spicy Arrabiata Penne'));
    await waitFor(() => expect(screen.getByTestId('recipe-category')).toHaveTextContent('Vegetarian'));
    await waitFor(() => expect(screen.getByTestId('instructions')).toHaveTextContent('Bring a large.'));
    await waitFor(() => expect(screen.getByTestId('recipe-photo')).toHaveAttribute('src', 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg'));
    await waitFor(() => expect(screen.getByTestId('0-ingredient-name-and-measure')).toHaveTextContent('penne rigate - 1 pound'));
    await waitFor(() => expect(screen.getByTestId('1-ingredient-name-and-measure')).toHaveTextContent('olive oil - 1/4 cup'));
    const favoriteBtn = await screen.findByTestId(FAVORITEBUTTON);
    expect(favoriteBtn).toBeInTheDocument();

    expect(favoriteBtn).toHaveAttribute('src', '/src/images/whiteHeartIcon.svg');

    await user.click(favoriteBtn);
  });

  it('handles fetch error and logs it', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockRejectedValue(new Error(ERROR));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithRouter(<RecipeDetails />, { route: URL_DRINKS });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Erro:', new Error(ERROR));
    });

    mockFetch.mockRestore();
    consoleSpy.mockRestore();
  });

  it('toggles favorite state and updates localStorage', async () => {
    const mockDrinkResponse = {
      ok: true,
      status: 200,
      json: async () => oneResultDrink,
    };
    const mockMealRecommendations = {
      ok: true,
      status: 200,
      json: async () => mockMealsAPI,
    };

    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(mockMealRecommendations as Response)
      .mockResolvedValueOnce(mockDrinkResponse as Response);

    const { user } = renderWithRouter(<RecipeDetails />, { route: URL_DRINKS });

    const favoriteBtn = await screen.findByTestId(FAVORITEBUTTON);
    const shareBtn = await screen.findByTestId('share-btn');
    const startBtn = await screen.findByTestId(STARTBUTTON);
    expect(favoriteBtn).toBeInTheDocument();

    expect(favoriteBtn).toHaveAttribute('src', '/src/images/whiteHeartIcon.svg');

    await user.click(favoriteBtn);
    expect(favoriteBtn).toHaveAttribute('src', '/src/images/blackHeartIcon.svg');
    expect(JSON.parse(localStorage.getItem('favoriteRecipes')!)).toEqual([
      {
        id: '11118',
        type: 'drink',
        nationality: '',
        category: 'Ordinary Drink',
        alcoholicOrNot: 'Alcoholic',
        name: 'Blue Margarita',
        image: 'https://www.thecocktaildb.com/images/media/drink/bry4qh1582751040.jpg',
      },
    ]);

    await user.click(favoriteBtn);
    await user.click(shareBtn);
    expect(favoriteBtn).toHaveAttribute('src', '/src/images/blackHeartIcon.svg');
    expect(localStorage.getItem('favoriteRecipes')).toBe('[{"id":"11118","type":"drink","nationality":"","category":"Ordinary Drink","alcoholicOrNot":"Alcoholic","name":"Blue Margarita","image":"https://www.thecocktaildb.com/images/media/drink/bry4qh1582751040.jpg"},{"id":"11118","type":"drink","nationality":"","category":"Ordinary Drink","alcoholicOrNot":"Alcoholic","name":"Blue Margarita","image":"https://www.thecocktaildb.com/images/media/drink/bry4qh1582751040.jpg"}]');
    await user.click(startBtn);
  });

  it('Error log', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockRejectedValue(new Error(ERROR));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithRouter(<RecipeDetails />, { route: URL_DRINKS });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Erro:', new Error(ERROR));
    });

    mockFetch.mockRestore();
    consoleSpy.mockRestore();
  });

  it('handles error when copying link to clipboard fails', async () => {
    localStorage.clear();
    localStorage.setItem('drinks/11118/in-progress', JSON.stringify(['Tequila']));
    localStorage.setItem('favoriteRecipes', JSON.stringify([{ name: 'Blue Margarita' }]));

    const mockDrinkResponse = {
      ok: true,
      status: 200,
      json: async () => oneResultDrink,
    };
    const mockMealRecommendations = {
      ok: true,
      status: 200,
      json: async () => mockMealsAPI,
    };

    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(mockMealRecommendations as Response)
      .mockResolvedValueOnce(mockDrinkResponse as Response);

    const mockClipboard = vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Erro ao copiar para a área de transferência'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { user } = renderWithRouter(<RecipeDetails />, { route: URL_DRINKS });

    await screen.findByTestId('recipe-photo');

    const shareButton = screen.getByTestId('share-btn');
    await user.click(shareButton);

    await waitFor(() => {
      expect(mockClipboard).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Erro ao copiar para a área de transferência:', new Error('Erro ao copiar para a área de transferência'));
    });
  });

  vi.restoreAllMocks();
  vi.resetAllMocks();
  vi.clearAllMocks();
});

describe('RecipeDetails - exeções', () => {
  it('handles fetch error and logs it', async () => {
    const mockDrinkResponse = {
      ok: true,
      status: 200,
      json: async () => oneResultDrink,
    };
    const mockMealRecommendations = {
      ok: true,
      status: 200,
      json: async () => mockMealsAPI,
    };

    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(mockMealRecommendations as Response)
      .mockResolvedValueOnce(mockDrinkResponse as Response);

    const { user } = renderWithRouter(<RecipeDetails />, { route: URL_DRINKS });

    const favoriteBtn = await screen.findByTestId(FAVORITEBUTTON);
    const shareBtn = await screen.findByTestId('share-btn');
    const startBtn = await screen.findByTestId(STARTBUTTON);
    expect(favoriteBtn).toBeInTheDocument();

    await user.click(favoriteBtn);
    await user.click(shareBtn);
    await user.click(startBtn);
  });
  it('toggles favorite state and updates localStorage', async () => {
    const mockDrinkResponse = {
      ok: true,
      status: 200,
      json: async () => oneResultDrink,
    };
    const mockMealRecommendations = {
      ok: true,
      status: 200,
      json: async () => mockMealsAPI,
    };

    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(mockMealRecommendations as Response)
      .mockResolvedValueOnce(mockDrinkResponse as Response);
    const { user } = renderWithRouter(<RecipeDetails />, { route: URL_DRINKS });
    const startBtn = await screen.findByTestId(STARTBUTTON);

    await user.click(startBtn);
  });

  it('throws an error when response is not ok', async () => {
    const MockMealError = {
      ok: false,
      status: 500,
      json: async () => ({}),
    };
    const mockMealRecommendations = {
      ok: false,
      status: 500,
      json: async () => ({}),
    };

    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(mockMealRecommendations as Response)
      .mockResolvedValueOnce(MockMealError as Response);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithRouter(<RecipeDetails />, { route: '/meals/52771' });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Erro:', new Error(ERROR));
    });

    consoleSpy.mockRestore();
  });
  vi.restoreAllMocks();
  vi.resetAllMocks();
  vi.clearAllMocks();
});
