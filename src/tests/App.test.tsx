import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import React from 'react';
import Header from '../Components/Header/index';
import Footer from '../Components/Footer';
import Login from '../Components/Login';
import Meals from '../Components/Meals';
import Profile from '../Components/Profile';
import Drinks from '../Components/Drinks';
import FavoriteRecipes from '../Components/FavoriteRecipes';
import mealsByIngredient from './mocks/mealsByIngredient';
import oneResultMeal from './mocks/oneResultMeal';
import mealByFLetter from './mocks/mealByFLetter';
import drinksByIngredient from './mocks/drinksByIngredient';
import oneResultDrink from './mocks/oneResultDrink';
import drinkByFLetter from './mocks/drinkByFLetter';
import SearchBar from '../Components/SearchBar';
import * as ApiMeals from '../Services/ApiMeals';
import * as ApiDrinks from '../Services/ApiDrinks';

const SEARCH_TOP_BTN = 'search-top-btn';
const SEARCH_INPUT = 'search-input';
const SEARCH_BTN = 'exec-search-btn';
const SEARCH_INGREDIENT_RADIO = 'ingredient-search-radio';
const SEARCH_NAME_RADIO = 'name-search-radio';
const SEARCH_FIRST_LETTER_RADIO = 'first-letter-search-radio';

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
  it('SearchBar renderiza corretamente na tela', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Header />
      </MemoryRouter>,
    );
    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    fireEvent.click(searchIcon);

    expect(getByTestId(searchInputLint)).toBeInTheDocument();
    expect(getByTestId(SEARCH_INGREDIENT_RADIO)).toBeInTheDocument();
    expect(getByTestId(SEARCH_NAME_RADIO)).toBeInTheDocument();
    expect(getByTestId(SEARCH_FIRST_LETTER_RADIO)).toBeInTheDocument();
    expect(getByTestId(SEARCH_BTN)).toBeInTheDocument();
  });
  it('SearchBar testas inputs e click nos radios', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Header />
      </MemoryRouter>,
    );
    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    fireEvent.click(searchIcon);

    const ingredientRadio = getByTestId(SEARCH_INGREDIENT_RADIO) as HTMLInputElement;
    const nameRadio = getByTestId(SEARCH_NAME_RADIO) as HTMLInputElement;
    const firstLetterRadio = getByTestId(SEARCH_FIRST_LETTER_RADIO) as HTMLInputElement;
    const searchInput = getByTestId(searchInputLint) as HTMLInputElement;

    fireEvent.click(nameRadio);
    expect(nameRadio).toBeChecked();

    fireEvent.click(firstLetterRadio);
    expect(firstLetterRadio).toBeChecked();

    fireEvent.click(ingredientRadio);
    expect(ingredientRadio).toBeChecked();

    fireEvent.change(searchInput, { target: { value: 'chicken' } });
    expect(searchInput.value).toBe('chicken');
  });
});

describe('SearchBar chamada de API Meals - Arthur', () => {
  afterEach(() => vi.clearAllMocks());

  it('SearchBar busca por ingrediente', async () => {
    const MockAPI = {
      ok: true,
      status: 200,
      json: async () => mealsByIngredient,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockAPI);

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Header />
      </MemoryRouter>,
    );
    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    fireEvent.click(searchIcon);

    fireEvent.click(getByTestId(SEARCH_INGREDIENT_RADIO));

    fireEvent.change(getByTestId(SEARCH_INPUT), { target: { value: 'chicken_breast' } });

    fireEvent.click(getByTestId(SEARCH_BTN));

    expect(mockFetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('Deve buscar corretamente por nome quando o radio Name é selecionado', async () => {
    const MockAPI = {
      ok: true,
      status: 200,
      json: async () => oneResultMeal,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockAPI);

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Header />
      </MemoryRouter>,
    );

    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    fireEvent.click(searchIcon);

    fireEvent.click(getByTestId(SEARCH_NAME_RADIO));

    fireEvent.change(getByTestId(SEARCH_INPUT), { target: { value: 'Arrabiata' } });

    fireEvent.click(getByTestId(SEARCH_BTN));

    expect(mockFetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata');
    expect(window.location.href).toBe('http://localhost:3000/');
  });

  it('Deve buscar corretamente pela primeira letra quando o radio First letter é selecionado', async () => {
    const MockAPI = {
      ok: true,
      status: 200,
      json: async () => mealByFLetter,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockAPI);

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Header />
      </MemoryRouter>,
    );
    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    fireEvent.click(searchIcon);

    fireEvent.click(getByTestId(SEARCH_FIRST_LETTER_RADIO));

    fireEvent.change(getByTestId(SEARCH_INPUT), { target: { value: 'a' } });

    fireEvent.click(getByTestId(SEARCH_BTN));

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

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/drinks'] }>
        <Header />
      </MemoryRouter>,
    );
    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    fireEvent.click(searchIcon);

    fireEvent.click(getByTestId(SEARCH_INGREDIENT_RADIO));

    fireEvent.change(getByTestId(SEARCH_INPUT), { target: { value: 'salt' } });

    fireEvent.click(getByTestId(SEARCH_BTN));

    expect(mockFetch).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=salt');
  });

  it('Deve buscar corretamente por nome na API de bebidas quando o radio Name é selecionado', async () => {
    const MockAPI = {
      ok: true,
      status: 200,
      json: async () => oneResultDrink,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockAPI);

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/drinks'] }>
        <Header />
      </MemoryRouter>,
    );
    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    fireEvent.click(searchIcon);

    fireEvent.click(getByTestId(SEARCH_NAME_RADIO));

    fireEvent.change(getByTestId(SEARCH_INPUT), { target: { value: 'Aquamarine' } });

    fireEvent.click(getByTestId(SEARCH_BTN));

    expect(mockFetch).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=Aquamarine');
  });

  it('Deve buscar corretamente pela primeira letra na API de bebidas quando o radio First letter é selecionado', async () => {
    const MockAPI = {
      ok: true,
      status: 200,
      json: async () => drinkByFLetter,
    } as Response;

    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue(MockAPI);
    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/drinks'] }>
        <Header />
      </MemoryRouter>,
    );
    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    fireEvent.click(searchIcon);

    fireEvent.click(getByTestId(SEARCH_FIRST_LETTER_RADIO));

    fireEvent.change(getByTestId(SEARCH_INPUT), { target: { value: 'y' } });

    fireEvent.click(getByTestId(SEARCH_BTN));

    expect(mockFetch).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=y');
  });
});

describe('SearchBar Alerts - Arthur', () => {
  afterEach(() => vi.clearAllMocks());
  it('Deve exibir um alerta quando a busca na API for feita com mais de uma letra e o radio First letter estiver selecionado', async () => {
    const mockFetch = vi.spyOn(global, 'fetch');
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Header />
      </MemoryRouter>,
    );
    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    fireEvent.click(searchIcon);

    fireEvent.click(getByTestId(SEARCH_FIRST_LETTER_RADIO));

    fireEvent.change(getByTestId(SEARCH_INPUT), { target: { value: 'aaa' } });

    fireEvent.click(getByTestId(SEARCH_BTN));

    expect(alertMock).toHaveBeenCalledWith('Your search must have only 1 (one) character');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('Deve exibir um alerta quando a busca na API for feita e não houver retorno', async () => {
    it('Deve exibir um alerta quando a busca na API for feita e não houver retorno', async () => {
      const mockFetchMeals = vi.spyOn(ApiMeals, 'fetchMealsByName').mockRejectedValue(new Error('Sorry, we haven\'t found any recipes for these filters'));
      const mockFetchDrinks = vi.spyOn(ApiDrinks, 'fetchDrinksByName').mockRejectedValueOnce(new Error('Sorry, we haven\'t found any recipes for these filters'));

      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

      const { getByTestId } = render(
        <MemoryRouter initialEntries={ ['/meals'] }>
          <SearchBar />
        </MemoryRouter>,
      );

      const searchInput = getByTestId(SEARCH_INPUT);
      fireEvent.change(searchInput, { target: { value: 'sicparvismagna' } });

      const searchButton = getByTestId(SEARCH_BTN);
      fireEvent.click(searchButton);
      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(expect.stringMatching(/Sorry, we haven't found any recipes for these filters/));
      });

      expect(mockFetchMeals).toHaveBeenCalled();
      expect(mockFetchDrinks).toHaveBeenCalled();
    });
  });

  it('Catch console error', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockRejectedValue('error');
    const consoleErrorSpy = vi.spyOn(console, 'error');

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Header />
      </MemoryRouter>,
    );
    mockFetch.mockRejectedValueOnce('error');

    const searchIcon = getByTestId(SEARCH_TOP_BTN);
    fireEvent.click(searchIcon);

    fireEvent.click(getByTestId(SEARCH_NAME_RADIO));

    fireEvent.change(getByTestId(SEARCH_INPUT), { target: { value: 'sicparvismagna' } });

    fireEvent.click(getByTestId(SEARCH_BTN));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});

describe('Login', () => {
  test('renders the login heading', () => {
    const { getByText } = render(<Login />);
    const headingElement = getByText('Login');
    expect(headingElement).toBeInTheDocument();
  });
});

describe('Meals', () => {
  test('renders the "Meals" heading', () => {
    const { getByText } = render(<Meals />);
    const headingElement = getByText('Meals');
    expect(headingElement).toBeInTheDocument();
  });
});

describe('Profile', () => {
  test('renders the profile heading', () => {
    const { getByText } = render(<Profile />);
    const headingElement = getByText('Profile');
    expect(headingElement).toBeInTheDocument();
  });
});

describe('Drinks', () => {
  test('renders the "Drinks" heading', () => {
    const { getByText } = render(<Drinks />);
    const headingElement = getByText('Drinks');
    expect(headingElement).toBeInTheDocument();
  });
});

describe('FavoriteRecipes', () => {
  test('renders the "FavoriteRecipes" heading', () => {
    const { getByText } = render(<FavoriteRecipes />);
    const headingElement = getByText('FavoriteRecipes');
    expect(headingElement).toBeInTheDocument();
  });
});
