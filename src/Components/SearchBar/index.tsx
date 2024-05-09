import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as ApiMeals from '../../Services/ApiMeals';
import * as ApiDrinks from '../../Services/ApiDrinks';

function SearchBar() {
  const [searchType, setSearchType] = useState('ingredient');
  const [inputValue, setInputValue] = useState('');
  const location = useLocation();
  const activePage = location.pathname.includes('/meals') ? 'meals' : 'drinks';

  const handleSearchTypeChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setSearchType(event.target.value);
  };

  const handleSearch = async () => {
    const firstLetter = 'first-letter';
    if (searchType === firstLetter && inputValue.length !== 1) {
      window.alert('Your search must have only 1 (one) character');
      return;
    }

    let searchFunction;

    if (activePage === 'meals') {
      switch (searchType) {
        case 'ingredient':
          searchFunction = ApiMeals.fetchMealsByIngredient;
          break;
        case 'name':
          searchFunction = ApiMeals.fetchMealsByName;
          break;
        case firstLetter:
          searchFunction = ApiMeals.fetchMealsByFirstLetter;
          break;
        default:
          break;
      }
    } else if (activePage === 'drinks') {
      switch (searchType) {
        case 'ingredient':
          searchFunction = ApiDrinks.fetchDrinksByIngredient;
          break;
        case 'name':
          searchFunction = ApiDrinks.fetchDrinksByName;
          break;
        case firstLetter:
          searchFunction = ApiDrinks.fetchDrinksByFirstLetter;
          break;
        default:
          break;
      }
    }

    if (searchFunction) {
      try {
        const searchData = await searchFunction(inputValue);
        console.log(searchData); // Criarei função para o retono amanhã
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSearchInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        data-testid="search-input"
        value={ inputValue }
        onChange={ handleSearchInputChange }
      />
      <div>
        <label>
          <input
            type="radio"
            value="ingredient"
            checked={ searchType === 'ingredient' }
            onChange={ handleSearchTypeChange }
            data-testid="ingredient-search-radio"
          />
          Por ingrediente
        </label>

        <label>
          <input
            type="radio"
            value="name"
            checked={ searchType === 'name' }
            onChange={ handleSearchTypeChange }
            data-testid="name-search-radio"
          />
          Por nome
        </label>

        <label>
          <input
            type="radio"
            value="first-letter"
            checked={ searchType === 'first-letter' }
            onChange={ handleSearchTypeChange }
            data-testid="first-letter-search-radio"
          />
          Por primeira letra
        </label>
      </div>

      <button
        onClick={ handleSearch }
        data-testid="exec-search-btn"
      >
        Buscar
      </button>
    </div>
  );
}

export default SearchBar;
