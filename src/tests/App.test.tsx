import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import Header from '../Components/Header/index';

const SEARCH_TOP_BTN = 'search-top-btn';

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
    const searchInput = getByTestId('search-input');
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
