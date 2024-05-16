import React from 'react';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div>
      <h1 data-testid="profile-email">{user.email || 'No email'}</h1>
      <button data-testid="profile-done-btn">
        Done Recipes
      </button>
      <button data-testid="profile-favorite-btn">
        Favorite Recipes
      </button>
      <button data-testid="profile-logout-btn">
        Logout
      </button>
    </div>
  );
}

export default Profile;
