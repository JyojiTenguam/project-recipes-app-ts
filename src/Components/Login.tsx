import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (inputEmail: string) => {
    return inputEmail.includes('@') && inputEmail.includes('.');
  };

  const isValid = validateEmail(email) && password.length > 6;

  return (
    <div>
      <form>
        <input
          type="email"
          data-testid="email-input"
          placeholder="Email"
          value={ email }
          onChange={ (e) => setEmail(e.target.value) }
        />
        <input
          type="password"
          data-testid="password-input"
          placeholder="Senha"
          value={ password }
          onChange={ (e) => setPassword(e.target.value) }
        />
        <button
          type="submit"
          data-testid="login-submit-btn"
          disabled={ !isValid }
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
