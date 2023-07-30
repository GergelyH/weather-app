import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';

import AddCity from "./AddCity";
import * as citySearch from "./CitySearch";
import userEvent from '@testing-library/user-event';

describe('AddCity', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test('exact searched city appears', async () => {
        render(<AddCity />);

        const textField = screen.getByRole('textbox');
        userEvent.type(textField, 'Vienna');

        const cityElement = await screen.findByText('Vienna');
        expect(cityElement).toBeInTheDocument();
    });

    test('search result is correct', async () => {
        render(<AddCity />);

        const textField = screen.getByRole('textbox');
        userEvent.type(textField, 'ku');

        const capitalsToCheck = ['Kuwait City', 'Kuala Lumpur', "Nukuʻalofa", 'Baku'];
        for (let capital of capitalsToCheck) {
            const cityElement = await screen.findByText(capital);
            expect(cityElement).toBeInTheDocument();
        }
    })

    test('maximum 8 search results are rendered', async () => {
        render(<AddCity />);

        const textField = screen.getByRole('textbox');
        userEvent.type(textField, 'e');

        const searchResults = await screen.findAllByTestId('search-result-city');
        expect(searchResults.length).toBeLessThanOrEqual(8);
    })

    test('spinner disappears shortly after search', async () => {
        render(<AddCity />);

        const textField = screen.getByRole('textbox');
        userEvent.type(textField, 'Vienna');
        
        await waitForElementToBeRemoved(() => screen.queryByTestId('spinner'));
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
        userEvent.type(textField, '1');

        const spinner = screen.getByTestId('spinner');
        expect(spinner).toBeInTheDocument();
        const searchResultCity = screen.queryByTestId('search-result-city');
        expect(searchResultCity).toBeNull();
        
        resolveFunction([]);
    });

    test('save button appears only after city selection', async () => {
        render(<AddCity />);
        expect(screen.queryByTestId('save-button')).toBeNull();

        const textField = screen.getByRole('textbox');
        userEvent.type(textField, 'ndo');

        const cityElement = await screen.findByText('London');
        expect(screen.queryByTestId('save-button')).toBeNull();

        userEvent.click(cityElement);
        expect(cityElement).toHaveClass('selected');

    });

    test('expanding the search unselects the currently selected item', async () => {
        render(<AddCity />);
        const textField = screen.getByRole('textbox');
        userEvent.type(textField, 'ndo');
        let cityElement = await screen.findByText('London');
        userEvent.click(cityElement);
        expect(cityElement).toHaveClass('selected');

        userEvent.type(textField, 'ndok');
        await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));
        expect(cityElement).not.toBeInTheDocument();

        userEvent.type(textField, 'ndo');
        cityElement = await screen.findByText('London');
        expect(cityElement).not.toHaveClass('selected');
    });

    test('deleting from the search term keeps item selection', async () => {
        render(<AddCity />);
        const textField = screen.getByRole('textbox');
        userEvent.type(textField, 'nd');
        let cityElement = await screen.findByText('London');
        userEvent.click(cityElement);
        expect(cityElement).toHaveClass('selected');

        userEvent.type(textField, 'n');
        cityElement = await screen.findByText('London');
        expect(cityElement).toHaveClass('selected');
    });
})
