import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter, BrowserRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import Header from '../Components/Header/index';
import Footer from '../Components/Footer';
import mealsByIngredient from './mocks/mealsByIngredient';
import oneResultMeal from './mocks/oneResultMeal';
import mealByFLetter from './mocks/mealByFLetter';
import drinksByIngredient from './mocks/drinksByIngredient';
import oneResultDrink from './mocks/oneResultDrink';
import drinkByFLetter from './mocks/drinkByFLetter';
import * as ApiMeals from '../Services/ApiMeals';
import * as ApiDrinks from '../Services/ApiDrinks';
import App from '../App';
import renderWithRouter from './RenderWithRouter';
import SearchBar from '../Components/SearchBar';
import mockDrinkCategories from './mocks/mockDrinkCategories';
import Profile from '../Components/Profile/index';

const SEARCH_TOP_BTN = 'search-top-btn';
const SEARCH_INPUT = 'search-input';
const SEARCH_BTN = 'exec-search-btn';
const SEARCH_INGREDIENT_RADIO = 'ingredient-search-radio';
const SEARCH_NAME_RADIO = 'name-search-radio';
const SEARCH_FIRST_LETTER_RADIO = 'first-letter-search-radio';
const ERROR_API_RESULT = 'Sorry, we haven\'t found any recipes for these filters';

describe('Header', () => {
  test('renderiza o cabeçalho com o ícone do perfil', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const profileIcon = getByTestId('profile-top-btn');
    expect(profileIcon).toBeInTheDocument();
  });

  test('clicar no ícone do perfil navega para a página de perfil', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const profileIcon = getByTestId('profile-top-btn');
    fireEvent.click(profileIcon);
    const profilePageTitle = getByTestId('page-title');
    expect(profilePageTitle.textContent).toBe('Profile');
  });

  test('renderiza o cabeçalho sem ícone de pesquisa na página inicial', () => {
    const { queryByTestId } = render(
      <MemoryRouter initialEntries={ ['/'] }>
        <Header />
      </MemoryRouter>,
    );
    const searchIcon = queryByTestId(SEARCH_TOP_BTN);
    expect(searchIcon).not.toBeInTheDocument();
  });

  test('renderiza o cabeçalho com o ícone de pesquisa nas páginas de meals/drinks', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Header />
      </MemoryRouter>,
    );
    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    expect(searchIcon).toBeInTheDocument();
  });

  test('renderiza a entrada de pesquisa quando o ícone de pesquisa é clicado', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Header />
      </MemoryRouter>,
    );
    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    fireEvent.click(searchIcon);
    const searchInput = getByTestId(SEARCH_INPUT);
    expect(searchInput).toBeInTheDocument();
  });

  test('renderiza o título da página corretamente', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Header />
      </MemoryRouter>,
    );
    const pageTitle = getByTestId('page-title');
    expect(pageTitle.textContent).toBe('Meals');
  });
});

describe('Footer Test by marcolas', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>,
    );
  });

  it('renderizar footer component', () => {
    expect(document.querySelector('[data-testid="footer"]')).toBeInTheDocument();
  });

  it('renderizar drinks button', () => {
    expect(document.querySelector('[data-testid="drinks-bottom-btn"]')).toBeInTheDocument();
  });

  it('renderizar meals button', () => {
    expect(document.querySelector('[data-testid="meals-bottom-btn"]')).toBeInTheDocument();
  });
});

describe('SearchBar testes - Arthur', () => {
  const searchInputLint = SEARCH_INPUT;
  it('SearchBar renderiza corretamente na tela', async () => {
    const { user, getByTestId } = renderWithRouter(<App />, { route: '/meals' });

    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    await user.click(searchIcon);

    expect(getByTestId(searchInputLint)).toBeInTheDocument();
    expect(getByTestId(SEARCH_INGREDIENT_RADIO)).toBeInTheDocument();
    expect(getByTestId(SEARCH_NAME_RADIO)).toBeInTheDocument();
    expect(getByTestId(SEARCH_FIRST_LETTER_RADIO)).toBeInTheDocument();
    expect(getByTestId(SEARCH_BTN)).toBeInTheDocument();
  });

  it('SearchBar testas inputs e click nos radios', async () => {
    const { user, getByTestId } = renderWithRouter(<App />, { route: '/meals' });
    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    await user.click(searchIcon);

    const ingredientRadio = getByTestId(SEARCH_INGREDIENT_RADIO) as HTMLInputElement;
    const nameRadio = getByTestId(SEARCH_NAME_RADIO) as HTMLInputElement;
    const firstLetterRadio = getByTestId(SEARCH_FIRST_LETTER_RADIO) as HTMLInputElement;
    const searchInput = getByTestId(searchInputLint) as HTMLInputElement;

    await user.click(nameRadio);
    expect(nameRadio).toBeChecked();

    await user.click(firstLetterRadio);
    expect(firstLetterRadio).toBeChecked();

    await user.click(ingredientRadio);
    expect(ingredientRadio).toBeChecked();

    await user.type(searchInput, 'chicken');
    expect(searchInput.value).toBe('chicken');
  });
});

describe('SearchBar chamada de API Meals - Arthur', () => {
  afterEach(() => vi.clearAllMocks());
  beforeEach(() => vi.clearAllMocks());

  it('SearchBar busca por ingrediente', async () => {
    const MockAPI = {
      ok: true,
      status: 200,
      json: async () => mealsByIngredient,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockAPI);

    const { user, getByTestId } = renderWithRouter(<App />, { route: '/meals' });

    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    await user.click(searchIcon);

    await user.click(getByTestId(SEARCH_INGREDIENT_RADIO));

    await user.type(getByTestId(SEARCH_INPUT), 'chicken_breast');

    await user.click(getByTestId(SEARCH_BTN));

    expect(mockFetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast');
    expect(mockFetch).toHaveBeenCalled();
  });

  it('Deve buscar corretamente por nome quando o radio Name é selecionado', async () => {
    const MockAPI = {
      ok: true,
      status: 200,
      json: async () => oneResultMeal,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockAPI);

    const { user, getByTestId } = renderWithRouter(<App />, { route: '/meals' });

    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    await user.click(searchIcon);

    await user.click(getByTestId(SEARCH_NAME_RADIO));

    await user.type(getByTestId(SEARCH_INPUT), 'Arrabiata');

    await user.click(getByTestId(SEARCH_BTN));

    expect(mockFetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata');
    expect(window.location.href).toBe('http://localhost:3000/meals');
  });

  it('Deve buscar corretamente pela primeira letra quando o radio First letter é selecionado', async () => {
    const MockAPI = {
      ok: true,
      status: 200,
      json: async () => mealByFLetter,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockAPI);

    const { user, getByTestId } = renderWithRouter(<App />, { route: '/meals' });

    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    await user.click(searchIcon);

    await user.click(getByTestId(SEARCH_FIRST_LETTER_RADIO));

    await user.type(getByTestId(SEARCH_INPUT), 'a');

    await user.click(getByTestId(SEARCH_BTN));

    expect(mockFetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?f=a');
  });
});

describe('SearchBar Funcionalidade API Drinks - Arthur', () => {
  afterEach(() => vi.clearAllMocks());
  it('Deve buscar corretamente por ingrediente na API de bebidas quando o radio Ingredient é selecionado', async () => {
    const MockAPI = {
      ok: true,
      status: 200,
      json: async () => drinksByIngredient,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockAPI);

    const { user, getByTestId } = renderWithRouter(<App />, { route: '/drinks' });

    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    await user.click(searchIcon);

    await user.click(getByTestId(SEARCH_INGREDIENT_RADIO));

    await user.type(getByTestId(SEARCH_INPUT), 'salt');

    await user.click(getByTestId(SEARCH_BTN));

    expect(mockFetch).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=salt');
  });

  it('Deve buscar corretamente por nome na API de bebidas quando o radio Name é selecionado', async () => {
    const MockAPI = {
      ok: true,
      status: 200,
      json: async () => oneResultDrink,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockAPI);

    const { user, getByTestId } = renderWithRouter(<App />, { route: '/drinks' });

    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    await user.click(searchIcon);

    await user.click(getByTestId(SEARCH_NAME_RADIO));

    await user.type(getByTestId(SEARCH_INPUT), 'Aquamarine');

    await user.click(getByTestId(SEARCH_BTN));

    expect(mockFetch).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=Aquamarine');
  });

  it('Deve buscar corretamente pela primeira letra na API de bebidas quando o radio First letter é selecionado', async () => {
    const MockAPI = {
      ok: true,
      status: 200,
      json: async () => drinkByFLetter,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockAPI);
    const { user, getByTestId } = renderWithRouter(<App />, { route: '/drinks' });

    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    await user.click(searchIcon);

    await user.click(getByTestId(SEARCH_FIRST_LETTER_RADIO));

    await user.type(getByTestId(SEARCH_INPUT), 'y');

    await user.click(getByTestId(SEARCH_BTN));

    expect(mockFetch).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=y');
  });
});

describe('SearchBar Alerts - Arthur', () => {
  afterEach(() => vi.clearAllMocks());
  it('Deve exibir um alerta quando a busca na API for feita com mais de uma letra e o radio First letter estiver selecionado', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const { user, getByTestId } = renderWithRouter(<Header />, { route: '/meals' });

    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    await user.click(searchIcon);

    await user.click(getByTestId(SEARCH_FIRST_LETTER_RADIO));

    await user.type(getByTestId(SEARCH_INPUT), 'aaa');

    await user.click(getByTestId(SEARCH_BTN));

    expect(alertMock).toHaveBeenCalledWith('Your search must have only 1 (one) character');
  });

  it('Deve exibir um alerta quando a busca na API for feita e não houver retorno', async () => {
    it('Deve exibir um alerta quando a busca na API for feita e não houver retorno', async () => {
      const mockFetchMeals = vi.spyOn(ApiMeals, 'fetchMealsByName').mockRejectedValue(new Error(ERROR_API_RESULT));
      const mockFetchDrinks = vi.spyOn(ApiDrinks, 'fetchDrinksByName').mockRejectedValueOnce(new Error(ERROR_API_RESULT));

      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

      const { user, getByTestId } = renderWithRouter(<App />, { route: '/meals' });

      const searchInput = getByTestId(SEARCH_INPUT);
      await user.type(searchInput, 'sicparvismagna');

      const searchButton = getByTestId(SEARCH_BTN);
      await user.click(searchButton);
      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(expect.stringMatching(/Sorry, we haven't found any recipes for these filters/));
      });

      expect(mockFetchMeals).toHaveBeenCalled();
      expect(mockFetchDrinks).toHaveBeenCalled();
    });
  });

  it('Catch console error', async () => {
    const { user, getByTestId } = renderWithRouter(<SearchBar />, { route: '/meals' });

    // mockFetch.mockRejectedValueOnce('error');

    await user.click(getByTestId(SEARCH_NAME_RADIO));

    await user.type(getByTestId(SEARCH_INPUT), 'sicparvismagna');

    await user.click(getByTestId(SEARCH_BTN));

    expect(window.alert).toHaveBeenCalledWith("Sorry, we haven't found any recipes for these filters");
  });
});

describe('Meals', () => {
  test('renders the "Meals" heading', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <App />
      </MemoryRouter>,
    );
    const headingElement = getByText('Meals');
    expect(headingElement).toBeInTheDocument();
  });
});

describe('Profile', () => {
  test('renders the profile heading', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={ ['/profile'] }>
        <App />
      </MemoryRouter>,
    );
    const headingElement = getByText('Profile');
    expect(headingElement).toBeInTheDocument();
  });
});

describe('Drinks', () => {
  test('renders the "Drinks" heading', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={ ['/drinks'] }>
        <App />
      </MemoryRouter>,
    );
    const headingElement = getByText('Drinks');
    expect(headingElement).toBeInTheDocument();
  });
});

describe('FavoriteRecipes', () => {
  test('renders the "FavoriteRecipes" heading', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={ ['/favorite-recipes'] }>
        <App />
      </MemoryRouter>,
    );
    const headingElement = getByText('Favorite Recipes');
    expect(headingElement).toBeInTheDocument();
  });
});

describe('Recipes', () => {
  afterEach(() => vi.clearAllMocks());

  const MockMeals = ([
    { idMeal: '1', strMeal: 'Meal 1', strMealThumb: 'thumb1.jpg' },
    { idMeal: '2', strMeal: 'Meal 2', strMealThumb: 'thumb2.jpg' },
  ]);
  const MockDrinksByCategory = ([
    { strCategory: 'Category 1' },
    { strCategory: 'Category 2' },
  ]);
  const MockDrinks = ([
    { idDrink: '1', strDrink: 'Drink 1', strDrinkThumb: 'thumb1.jpg' },
    { idDrink: '2', strDrink: 'Drink 2', strDrinkThumb: 'thumb2.jpg' },
  ]);

  it('Recipes Meal', async () => {
    const MockMeal = {
      ok: true,
      status: 200,
      json: async () => MockMeals,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockMeal);

    const { findAllByTestId } = renderWithRouter(<App />, { route: '/meals' });

    waitFor(async () => {
      await expect(mockFetch).toHaveBeenCalled();
      const mealCategories = await findAllByTestId(/-category-filter$/);
      await expect(mealCategories).toHaveLength(2);

      const mealCards = await findAllByTestId(/-recipe-card$/);
      await expect(mealCards).toHaveLength(2);
    }, { timeout: 5000 });
  });

  it('Recipes Drink', async () => {
    const MockDrinkCategory = {
      ok: true,
      status: 200,
      json: async () => MockDrinksByCategory,
    } as Response;

    const mockFetchCat = vi.spyOn(global, 'fetch').mockResolvedValue(MockDrinkCategory);
    const { findAllByTestId } = renderWithRouter(<App />, { route: '/drinks' });

    waitFor(async () => {
      const drinkCategories = await findAllByTestId(/-category-filter$/);
      await expect(drinkCategories).toHaveLength(6);

      const drinkCards = await findAllByTestId(/-recipe-card$/);
      await expect(drinkCards).toHaveLength(11);
    });

    expect(mockFetchCat).toHaveBeenCalled();
  });

  it('Recipes Driks by Filter', async () => {
    const MockDrink = {
      ok: true,
      status: 200,
      json: async () => MockDrinks,
    } as Response;

    vi.spyOn(global, 'fetch').mockResolvedValue(MockDrink);
    const { user, getByText, findAllByTestId } = renderWithRouter(<App />, { route: '/drinks' });

    await expect(getByText('All')).toBeInTheDocument();
    await user.click(getByText('All'));

    waitFor(async () => {
      // await expect(mockFetch).toHaveBeenCalled();
      const drinkCategories = await findAllByTestId(/-category-filter$/);
      await user.click(drinkCategories[0]);
      await expect(drinkCategories).toHaveLength(3);

      const drinkCards = await findAllByTestId(/-recipe-card$/);
      await expect(drinkCards).toHaveLength(2);
    });
  });

  it('Recipes Meals by Filter', async () => {
    const MockMeal = {
      ok: true,
      status: 200,
      json: async () => MockMeals,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockMeal);
    const { user, getByText, findAllByTestId } = renderWithRouter(<App />, { route: '/meals' });

    await expect(getByText('All')).toBeInTheDocument();
    await user.click(getByText('All'));

    waitFor(async () => {
      await expect(mockFetch).toHaveBeenCalled();
      const mealCategories = await findAllByTestId(/-category-filter$/);
      await user.click(mealCategories[0]);
      await expect(mealCategories).toHaveLength(3);

      const mealCards = await findAllByTestId(/-recipe-card$/);
      await expect(mealCards).toHaveLength(2);
    });
  });

  it('Recipes Render', async () => {
    const MockMeal = {
      ok: true,
      status: 200,
      json: async () => mockDrinkCategories,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockMeal);
    const { user, getByText, findAllByTestId } = renderWithRouter(<App />, { route: '/drinks' });

    await expect(getByText('All')).toBeInTheDocument();
    await user.click(getByText('All'));
    const drinkCategories = await findAllByTestId(/-category-filter$/);
    await user.click(drinkCategories[0]);
    await expect(mockFetch).toHaveBeenCalled();
    const drinkCategories2 = await findAllByTestId(/-category-filter$/);
    await expect(drinkCategories2).toHaveLength(6);
    await user.click(drinkCategories[5]);
    await user.click(drinkCategories[5]);
  });
});

describe('Profile Component Tests', () => {
  const setup = (initialPath = '/profile') => {
    window.localStorage.setItem('user', JSON.stringify({ email: 'user@test.com' }));
    return render(
      <MemoryRouter initialEntries={ [initialPath] }>
        <Routes>
          <Route path="/profile" element={ <Profile /> } />
          <Route path="/" element={ <h1>Login Page</h1> } />
          <Route path="/done-recipes" element={ <h1>Done Recipes</h1> } />
          <Route path="/favorite-recipes" element={ <h1>Favorite Recipes</h1> } />
        </Routes>
      </MemoryRouter>,
    );
  };

  test('should display the user email from localStorage', () => {
    setup();
    expect(screen.getByTestId('profile-email')).toHaveTextContent('user@test.com');
  });

  test('should navigate to Done Recipes page when button clicked', () => {
    setup();
    fireEvent.click(screen.getByTestId('profile-done-btn'));
    expect(screen.getByText('Done Recipes')).toBeInTheDocument();
  });

  test('should navigate to Favorite Recipes page when button clicked', () => {
    setup();
    fireEvent.click(screen.getByTestId('profile-favorite-btn'));
    expect(screen.getByText('Favorite Recipes')).toBeInTheDocument();
  });

  test('should clear localStorage and navigate to login on logout', () => {
    setup();
    fireEvent.click(screen.getByTestId('profile-logout-btn'));
    expect(window.localStorage.getItem('user')).toBeNull();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
