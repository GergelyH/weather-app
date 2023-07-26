import { render, screen, fireEvent, queryByTestId } from '@testing-library/react';

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

test('can only save a city after a successful search and city selection', () => {
    render(<AddCity />);
    expect(screen.queryByTestId('save-button')).toBeNull();
    const textField = screen.getByRole('textbox');
    fireEvent.change(textField, {target: {value: 'ndo'}})
    expect(screen.queryByTestId('save-button')).toBeNull();
    const cityElement = screen.getByText('London');
    fireEvent.click(cityElement);
    expect(cityElement).toHaveClass('selected');
    const saveButton = screen.getByTestId('save-button');
    fireEvent.click(saveButton);
})