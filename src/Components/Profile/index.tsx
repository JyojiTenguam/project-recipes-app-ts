import React from 'react';

function Profile() {
  return (
    <div>
      <h1>Profile</h1>
      <p data-testid="profile-email">email@example.com</p>
      <button type="button" data-testid="profile-done-btn">Done Recipes</button>
      <button type="button" data-testid="profile-favorite-btn">Favorite Recipes</button>
      <button type="button" data-testid="profile-logout-btn">Logout</button>
    </div>
  );
}

export default Profile;
