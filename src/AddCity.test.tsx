import { cleanup, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import AddCity from './AddCity';
import * as citySearch from "./CitySearch";
import userEvent from '@testing-library/user-event';

describe('AddCity', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        render(
            <BrowserRouter>
                <AddCity />
            </BrowserRouter>
        );
    });
    
    afterEach(cleanup);

    test('exact searched city appears', async () => {
        const textField = screen.getByRole('textbox');
        userEvent.type(textField, 'Vienna');

        const cityElement = await screen.findByText('Vienna');
        expect(cityElement).toBeInTheDocument();
    });

    test('search result is correct', async () => {
        const textField = screen.getByRole('textbox');
        userEvent.type(textField, 'ku');

        const capitalsToCheck = ['Kuwait City', 'Kuala Lumpur', "Nukuʻalofa", 'Baku'];
        for (let capital of capitalsToCheck) {
            const cityElement = await screen.findByText(capital);
            expect(cityElement).toBeInTheDocument();
        }
    })

    test('maximum 8 search results are rendered', async () => {
        const textField = screen.getByRole('textbox');
        userEvent.type(textField, 'e');

        const searchResults = await screen.findAllByTestId('search-result-city');
        expect(searchResults.length).toBeLessThanOrEqual(8);
    })

    test('spinner disappears shortly after search', async () => {
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

        const textField = screen.getByRole('textbox');
        userEvent.type(textField, '1');

        const spinner = screen.getByTestId('spinner');
        expect(spinner).toBeInTheDocument();
        const searchResultCity = screen.queryByTestId('search-result-city');
        expect(searchResultCity).toBeNull();

        resolveFunction([]);
    });

    test('save button appears only after city selection', async () => {
        expect(screen.queryByTestId('save-button')).toBeNull();

        const textField = screen.getByRole('textbox');
        userEvent.type(textField, 'ndo')

        const cityElement = await screen.findByText('London');
        expect(screen.queryByTestId('save-button')).toBeNull();

        await userEvent.click(cityElement);
        expect(cityElement).toHaveClass('selected');

    });

    test('expanding the search unselects the currently selected item', async () => {
        const textField = screen.getByRole('textbox');
        userEvent.type(textField, 'ndo');
        let cityElement = await screen.findByText('London');
        await userEvent.click(cityElement);
        expect(cityElement).toHaveClass('selected');

        await userEvent.type(textField, 'k');
        await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));
        expect(cityElement).not.toBeInTheDocument();

        await userEvent.type(textField, '{backspace}');
        cityElement = await screen.findByText('London');
        expect(cityElement).not.toHaveClass('selected');
    });

    test('deleting from the search term keeps item selection', async () => {
        const textField = screen.getByRole('textbox');
        await userEvent.type(textField, 'nd');
        let cityElement = await screen.findByText('London');
        await userEvent.click(cityElement);
        expect(cityElement).toHaveClass('selected');

        userEvent.type(textField, '{backspace}');
        cityElement = await screen.findByText('London');
        expect(cityElement).toHaveClass('selected');
    });

    test('clicking back button calls navigate', async () => {
        const mockNavigate = jest.fn();
        jest.mock('react-router-dom', () => ({
          ...jest.requireActual('react-router-dom'),
          useNavigate: () => mockNavigate,
        }));

        const backArrow = screen.getByTestId('back-button');
        await userEvent.click(backArrow);
        
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    })
})
