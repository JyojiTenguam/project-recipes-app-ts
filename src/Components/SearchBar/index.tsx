import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as ApiMeals from '../../Services/ApiMeals';
import * as ApiDrinks from '../../Services/ApiDrinks';
import { DrinkType, MealType } from '../../types';

function SearchBar() {
  const [searchType, setSearchType] = useState('ingredient');
  const [inputValue, setInputValue] = useState('');
  const [searchResult, setSearchResult] = useState<MealType[] | DrinkType[]>([]);
  const location = useLocation();
  const activePage = location.pathname.includes('/meals') ? 'meals' : 'drinks';
  const firstLetter = 'first-letter';

  const handleSearchTypeChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setSearchType(event.target.value);
  };

  const setSearchFunction = () => {
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
    return searchFunction;
  };

  const handleSearch = async () => {
    if (searchType === firstLetter && inputValue.length !== 1) {
      window.alert('Your search must have only 1 (one) character');
      return;
    }
    const searchFunction = setSearchFunction();
    if (searchFunction) {
      try {
        const searchData = await searchFunction(inputValue);
        if (searchData === null || searchData.length === 0) {
          window.alert("Sorry, we haven't found any recipes for these filters");
        } else if (searchData && searchData.length === 1) {
          const id = searchData[0].idMeal || searchData[0].idDrink;
          setSearchResult([]);
          window.location.href = `/${activePage}/${id}`;
        } else {
          setSearchResult(searchData);
        }
      } catch (error) {
        console.error(error);
      }
    }
    console.log(searchResult);
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
      {/* { searchResult && searchResult.map((drink) => (
        <p key={ drink.idDrink }>
          {drink.idDrink}
        </p>
      )) } */}
    </div>
  );
}

export default SearchBar;
