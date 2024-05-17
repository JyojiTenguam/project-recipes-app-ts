import { render, screen } from '@testing-library/react';
import DoneRecipes from '../Components/DoneRecipes';

describe('DoneRecipes test - Junior', () => {
  it('Verifica se data-testid="filter-by-all-btn" do botão Todos está correto', () => {
    render(<DoneRecipes />);
    const todosButton = screen.getByTestId('filter-by-all-btn');
    expect(todosButton).toBeInTheDocument();
    expect(todosButton).toHaveAttribute('data-testid', 'filter-by-all-btn');
  });

  it('Verifica se o botão Meals está presente na tela', () => {
    render(<DoneRecipes />);
    const buttonMeals = screen.getByRole('button', {
      name: /meals/i,
    });
    expect(buttonMeals).toBeInTheDocument();
  });

  it('Verifica se os cards possuem os atributos corretos de uma comida', () => {});
});
