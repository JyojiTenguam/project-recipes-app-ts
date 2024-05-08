import React, { useState } from 'react';

function SearchBar() {
  const [searchType, setSearchType] = useState('ingredient');

  const handleSearchTypeChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setSearchType(event.target.value);
  };

  const handleSearch = () => {

  };

  return (
    <div>
      <input type="text" data-testid="search-input" />
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
