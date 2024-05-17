import { render, screen, fireEvent } from '@testing-library/react';
import FavoriteRecipes from '../Components/FavoriteRecipes';

describe('FavoriteRecipes test - Junior', () => {
  const filterAllBtn = 'filter-by-all-btn';
  const filterMealBtn = 'filter-by-meal-btn';
  const filterDrinkBtn = 'filter-by-drink-btn';

  it('Verifica se o botão "Todos" está presente e possui o data-testid correto', () => {
    render(<FavoriteRecipes />);
    const allButton = screen.getByTestId(filterAllBtn);
    expect(allButton).toBeInTheDocument();
    expect(allButton).toHaveAttribute('data-testid', filterAllBtn);
  });

  it('Verifica se o botão Meals está presente na tela', () => {
    render(<FavoriteRecipes />);
    const buttonMeals = screen.getByRole('button', { name: /meals/i });
    expect(buttonMeals).toBeInTheDocument();
  });

  it('Verifica se renderiza os botões de filtro.', () => {
    render(<FavoriteRecipes />);
    expect(screen.getByTestId(filterAllBtn)).toBeInTheDocument();
    expect(screen.getByTestId(filterMealBtn)).toBeInTheDocument();
    expect(screen.getByTestId(filterDrinkBtn)).toBeInTheDocument();
  });

  it('Verifica se filtra as receitas pelo tipo.', () => {
    render(<FavoriteRecipes />);
    fireEvent.click(screen.getByTestId(filterMealBtn));
    fireEvent.click(screen.getByTestId(filterDrinkBtn));
    fireEvent.click(screen.getByTestId(filterAllBtn));
  });
});
