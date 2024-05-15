import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (emailToCheck: string) => {
    return /\S+@\S+\.\S+/.test(emailToCheck);
  };

  const isFormValid = () => {
    return isValidEmail(email) && password.length > 6;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormValid()) {
      localStorage.setItem('user', JSON.stringify({ email }));
      navigate('/meals');
    }
  };

  return (
    <div>
      <form onSubmit={ handleSubmit }>
        <input
          type="email"
          data-testid="email-input"
          placeholder="Email"
          value={ email }
          onChange={ (e: React.
            ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) }
        />
        <input
          type="password"
          data-testid="password-input"
          placeholder="Senha"
          value={ password }
          onChange={ (e: React.
            ChangeEvent<HTMLInputElement>) => setPassword(e.target.value) }
        />
        <button
          type="submit"
          data-testid="login-submit-btn"
          disabled={ !isFormValid() }
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
