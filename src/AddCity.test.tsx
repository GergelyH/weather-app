import { render, screen, fireEvent } from '@testing-library/react';

import AddCity from "./AddCity";

test('shows the correct result list after search', () => {
    render(<AddCity />);
    const textField = screen.getByRole('textbox');
    fireEvent.change(textField, {target: {value: 'ku'}})
    const capitalsToCheck = ['Kuwait City', 'Kuala Lumpur', "Nukuʻalofa", 'Baku'];
    for(let capital of capitalsToCheck){
        const cityElement = screen.getByText(capital);
        expect(cityElement).toBeInTheDocument();
    }
})

test('can search for a city and it appears', () => {
    render(<AddCity />);
    const textField = screen.getByRole('textbox');
    fireEvent.change(textField, {target: {value: 'ienna'}})
    const cityElement = screen.getByText('Vienna');
    expect(cityElement).toBeInTheDocument();
})