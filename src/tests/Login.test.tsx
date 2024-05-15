import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const testId = (id: string) => {
  return screen.getByTestId(id);
};

describe('Página de Login', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
  });

  test('Abre a página de Login', () => {
    const email = testId('email-input');
    const pass = testId('password-input');

    expect(email).toBeInTheDocument();
    expect(pass).toBeInTheDocument();
  });

  test('Botão começa desabilitado', () => {
    const loginBtn = testId('login-submit-btn');

    expect(loginBtn).toHaveProperty('disabled');
  });

  test('Botão funciona depois que os campos são preenchidos corretamente', async () => {
    const email = testId('email-input');
    const pass = testId('password-input');
    const loginBtn = testId('login-submit-btn');

    await userEvent.type(email, 'asd@asd.com');
    await userEvent.type(pass, '1234567');
    await userEvent.click(loginBtn);
  });
});
