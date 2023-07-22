import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('render CitiesList', () => {
  const { getByTestId } = render(<App />);
  const childElement = getByTestId('cities-list');
  expect(childElement).toBeInTheDocument();
});
