import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Components/Footer';

describe('Footer Test by marcolas', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>,
    );
  });

  it('renderizar footer component', () => {
    expect(document.querySelector('[data-testid="footer"]')).toBeInTheDocument();
  });

  it('renderizar drinks button', () => {
    expect(document.querySelector('[data-testid="drinks-bottom-btn"]')).toBeInTheDocument();
  });

  it('renderizar meals button', () => {
    expect(document.querySelector('[data-testid="meals-bottom-btn"]')).toBeInTheDocument();
  });
});
