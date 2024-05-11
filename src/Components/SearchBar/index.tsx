import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as ApiMeals from '../../Services/ApiMeals';
import * as ApiDrinks from '../../Services/ApiDrinks';
import { DrinkType, MealType } from '../../utils/types';

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

  const searchFunctions = {
    meals: {
      ingredient: ApiMeals.fetchMealsByIngredient,
      name: ApiMeals.fetchMealsByName,
      [firstLetter]: ApiMeals.fetchMealsByFirstLetter,
    },
    drinks: {
      ingredient: ApiDrinks.fetchDrinksByIngredient,
      name: ApiDrinks.fetchDrinksByName,
      [firstLetter]: ApiDrinks.fetchDrinksByFirstLetter,
    },
  };

  const handleSearch = async () => {
    if (searchType === firstLetter && inputValue.length !== 1) {
      window.alert('Your search must have only 1 (one) character');
      return;
    }
    const seda = searchFunctions[activePage as keyof typeof searchFunctions];
    const searchFunction = seda[searchType as keyof typeof seda];

    if (searchFunction) {
      try {
        const searchData = await searchFunction(inputValue);
        if (searchData === null || searchData.length === 0) {
          window.alert("Sorry, we haven't found any recipes for these filters");
        } else if (searchData && searchData.length === 1) {
          const id = ('idMeal' in searchData[0]) ? searchData[0].idMeal
            : searchData[0].idDrink;
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
      {/* {searchResult && searchResult.map((result, i) => (
        <div key={ i }>
          {('strMeal' in result) && (
            <p>
              {result.idMeal}
              {result.strMeal}
              {result.strIngredient1}
            </p>
          )}
          {('strDrink' in result) && (
            <p>
              {result.idDrink}
              {result.strDrink}
            </p>
          )}
        </div>
      ))} */}
    </div>
  );
}

export default SearchBar;
