import { render, screen, fireEvent, queryByTestId, waitFor } from '@testing-library/react';

import AddCity from "./AddCity";
import * as citySearch from "./CitySearch";

// jest.mock('./CitySearch', () => ({
//      calculateCitySearchResults: jest.fn(),
// }));

describe('AddCity', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('can search for a city and it appears', async () => {
        render(<AddCity />);

        const textField = screen.getByRole('textbox');
        fireEvent.change(textField, { target: { value: 'ienna' } })

        const cityElement = await screen.findByText('Vienna');
        expect(cityElement).toBeInTheDocument();
    });

    test('shows the correct result list after search', async () => {
        render(<AddCity />);

        const textField = screen.getByRole('textbox');
        fireEvent.change(textField, { target: { value: 'ku' } })

        const capitalsToCheck = ['Kuwait City', 'Kuala Lumpur', "Nukuʻalofa", 'Baku'];
        for (let capital of capitalsToCheck) {
            const cityElement = await screen.findByText(capital);
            expect(cityElement).toBeInTheDocument();
        }
    })

    test('can only save a city after a successful search and city selection', async () => {
        render(<AddCity />);
        expect(screen.queryByTestId('save-button')).toBeNull();

        const textField = screen.getByRole('textbox');
        fireEvent.change(textField, { target: { value: 'ndo' } })

        const cityElement = await screen.findByText('London');
        expect(screen.queryByTestId('save-button')).toBeNull();

        fireEvent.click(cityElement);
        expect(cityElement).toHaveClass('selected');

        const saveButton = screen.getByTestId('save-button');
        fireEvent.click(saveButton);
    })

    test('expanding the search unselects the currently selected item', async () => {
        render(<AddCity />);
        const textField = screen.getByRole('textbox');
        fireEvent.change(textField, { target: { value: 'ndo' } });
        let cityElement = await screen.findByText('London');
        fireEvent.click(cityElement);
        expect(cityElement).toHaveClass('selected');

        fireEvent.change(textField, { target: { value: 'ndok' } });
        expect(cityElement).not.toBeInTheDocument();

        fireEvent.change(textField, { target: { value: 'ndo' } });
        cityElement = await screen.findByText('London');
        expect(cityElement).not.toHaveClass('selected');
    });

    test('loading state is rendered when and only when the search results are being calculated', async () => {
        let resolveFunction!: (value?: string[]) => void;
        const promise = new Promise(resolve => {
            resolveFunction = resolve;
        });
        const calculateCitySearchResults = jest.spyOn(citySearch, 'calculateCitySearchResults');
        (calculateCitySearchResults as jest.Mock).mockImplementation(() => promise);

        render(<AddCity />);
        
        const textField = screen.getByRole('textbox');
        fireEvent.change(textField, { target: { value: 'l' } });

        const spinner = screen.getByTestId('spinner');
        expect(spinner).toBeInTheDocument();
        const searchResultCity = screen.queryByTestId('search-result-city');
        expect(searchResultCity).toBeNull();
        
        resolveFunction(['Bern', 'Bukarest']);
        const cityElement = await screen.findByText('Bern');
        expect(cityElement).toBeInTheDocument();
        const spinnerQuery = screen.queryByTestId('spinner');
        expect(spinnerQuery).toBeNull();
    })
})