import { render, screen, fireEvent, queryByTestId, waitFor, waitForElementToBeRemoved } from '@testing-library/react';

import AddCity from "./AddCity";
import * as citySearch from "./CitySearch";

// jest.mock('./CitySearch', () => ({
//      calculateCitySearchResults: jest.fn(),
// }));

describe('AddCity', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('exact searched city appears', async () => {
        render(<AddCity />);

        const textField = screen.getByRole('textbox');
        fireEvent.change(textField, { target: { value: 'Vienna' } })

        const cityElement = await screen.findByText('Vienna');
        expect(cityElement).toBeInTheDocument();
    });

    test('search result is correct', async () => {
        render(<AddCity />);

        const textField = screen.getByRole('textbox');
        fireEvent.change(textField, { target: { value: 'ku' } })

        const capitalsToCheck = ['Kuwait City', 'Kuala Lumpur', "Nukuʻalofa", 'Baku'];
        for (let capital of capitalsToCheck) {
            const cityElement = await screen.findByText(capital);
            expect(cityElement).toBeInTheDocument();
        }
    })

    test('spinner disappears shortly after search', async () => {
        render(<AddCity />);

        const textField = screen.getByRole('textbox');
        fireEvent.change(textField, { target: { value: 'Vienna' } })
        
        await waitForElementToBeRemoved(() => screen.queryByTestId('spinner'));
    });


    test('save button appears only after city selection', async () => {
        render(<AddCity />);
        expect(screen.queryByTestId('save-button')).toBeNull();

        const textField = screen.getByRole('textbox');
        fireEvent.change(textField, { target: { value: 'ndo' } })

        const cityElement = await screen.findByText('London');
        expect(screen.queryByTestId('save-button')).toBeNull();

        fireEvent.click(cityElement);
        expect(cityElement).toHaveClass('selected');

    });

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

    test('loading state is rendered while waiting for search results', async () => {
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
    });
})