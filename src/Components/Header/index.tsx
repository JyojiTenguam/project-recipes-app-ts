import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import profileIcon from '../../images/profileIcon.svg';
import searchIcon from '../../images/searchIcon.svg';
import SearchBar from '../SearchBar';

function Header() {
  const [showSearchIcon, setShowSearchIcon] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchClick = () => {
    setShowSearchBar(!showSearchBar);
  };

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
    setShowSearchIcon(searchPages.includes(location.pathname));
    setPageTitle(titleMap[location.pathname] || '');
  }, [location]);

  return (
    <header>
      <button onClick={ () => navigate('/profile') }>
        <img
          src={ profileIcon }
          alt="Perfil"
          data-testid="profile-top-btn"
        />
      </button>
      {showSearchIcon && (
        <button onClick={ handleSearchClick }>
          <img
            src={ searchIcon }
            alt="Pesquisa"
            data-testid="search-top-btn"
          />
        </button>
      )}
      {showSearchBar && <SearchBar />}
      <h1 data-testid="page-title">{pageTitle}</h1>
    </header>
  );
}

export default Header;
