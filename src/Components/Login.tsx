import React from 'react';

function Login() {
  return (
    <div>
      <form>
        <input
          type="email"
          data-testid="email-input"
          placeholder="Email"
        />
        <input
          type="password"
          data-testid="password-input"
          placeholder="Senha"
        />
        <button
          type="submit"
          data-testid="login-submit-btn"
          disabled
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
