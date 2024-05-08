import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer" data-testid="footer">
      <NavLink to="/drinks">
        <img
          data-testid="drinks-bottom-btn"
          src="src/images/drinkIcon.svg"
          alt="Drinks"
        />
      </NavLink>

      <NavLink to="/meals">
        <img
          data-testid="meals-bottom-btn"
          src="src/images/mealIcon.svg"
          alt="Meals"
        />
      </NavLink>
    </footer>
  );
}

export default Footer;
