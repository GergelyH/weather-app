import { render, screen, fireEvent } from '@testing-library/react';

import AddCity from "./AddCity";

test('Renders a input field', () => {
    const { getByRole } = render(<AddCity />);
    const textField = getByRole('textbox');
    expect(textField).toBeInTheDocument();
})

test('can search for a city and it appears', () => {
    render(<AddCity />);
    const textField = screen.getByRole('textbox');
    fireEvent.change(textField, {target: {value: 'ienna'}})
    const cityElement = screen.getByText(/Vienna/);
    expect(cityElement).toBeInTheDocument();
})