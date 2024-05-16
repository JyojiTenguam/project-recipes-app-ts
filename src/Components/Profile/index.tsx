import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div>
      <h1 data-testid="profile-email">{user.email}</h1>
      <button
        data-testid="profile-done-btn"
        onClick={ () => navigate('/done-recipes') }
      >
        Done Recipes
      </button>
      <button
        data-testid="profile-favorite-btn"
        onClick={ () => navigate('/favorite-recipes') }
      >
        Favorite Recipes
      </button>
      <button
        data-testid="profile-logout-btn"
        onClick={ () => {
          localStorage.clear();
          navigate('/');
        } }
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
