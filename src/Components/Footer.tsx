import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer" data-testid="footer">
      <img
        data-testid="drinks-bottom-btn"
        src="src/images/drinkIcon.svg"
        alt="Drinks"
      />

      <img
        data-testid="meals-bottom-btn"
        src="src/images/mealIcon.svg"
        alt="Meals"
      />

    </footer>
  );
}

export default Footer;
