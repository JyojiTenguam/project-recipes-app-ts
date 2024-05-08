import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import profileIcon from '../../images/profileIcon.svg';
import searchIcon from '../../images/searchIcon.svg';

function Header() {
  const [showSearchIcon, setShowSearchIcon] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const location = useLocation();

  useEffect(() => {
    const searchPages = ['/meals', '/drinks'];
    const titleMap: { [key: string]: string } = {
      '/': '',
      '/meals': 'Meals',
      '/drinks': 'Drinks',
      '/profile': 'Profile',
      '/done-recipes': 'Done Recipes',
      '/favorite-recipes': 'Favorite Recipes',
    };
    console.log(location.pathname);
    setShowSearchIcon(searchPages.includes(location.pathname));
    setPageTitle(titleMap[location.pathname] || '');
  }, [location]);

  return (
    <header>
      <img src={ profileIcon } alt="Perfil" data-testid="profile-top-btn" />
      {showSearchIcon && <img
        src={ searchIcon }
        alt="Pesquisa"
        data-testid="search-top-btn"
      />}
      <h1 data-testid="page-title">{pageTitle}</h1>
    </header>
  );
}

export default Header;
