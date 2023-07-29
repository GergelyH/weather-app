import { render, screen, fireEvent, queryByTestId } from '@testing-library/react';

import AddCity from "./AddCity";
import {calculateCitySearchResults} from "./CitySearch";

jest.mock('./CitySearch', () => ({
    calculateCitySearchResults: jest.fn(),
}));

describe('AddCity', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('can search for a city and it appears', () => {
        render(<AddCity />);

        const textField = screen.getByRole('textbox');
        fireEvent.change(textField, {target: {value: 'ienna'}})

        const cityElement = screen.getByText('Vienna');
        expect(cityElement).toBeInTheDocument();
    })

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

    test('expanding the search unselects the currently selected item', () => {
        render(<AddCity />);
        const textField = screen.getByRole('textbox');
        fireEvent.change(textField, {target: {value: 'ndo'}});
        let cityElement = screen.getByText('London');
        fireEvent.click(cityElement);
        expect(cityElement).toHaveClass('selected');
        
        fireEvent.change(textField, {target: {value: 'ndok'}});
        expect(cityElement).not.toBeInTheDocument();

        fireEvent.change(textField, {target: {value: 'ndo'}});
        cityElement = screen.getByText('London');
        expect(cityElement).not.toHaveClass('selected');
    });

    test('loading state is rendered when and only when the search results are being calculated', () =>{
        let resolveFunction;
        const promise = new Promise(resolve => {
          resolveFunction = resolve;
        });
        (calculateCitySearchResults as jest.Mock).mockImplementation(() => promise);

        render(<AddCity />);
        const textField = screen.getByRole('textbox');
        fireEvent.change(textField, {target: {value: 'l'}});
        
        const spinner = screen.getByTestId('spinner');
        expect(spinner).toBeInTheDocument();
    })
})