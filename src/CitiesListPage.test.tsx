import { BrowserRouter } from "react-router-dom";
import { render, screen } from '@testing-library/react';
import CitiesListPage from './CitiesListPage';
import userEvent from "@testing-library/user-event";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...(jest.requireActual("react-router") as any),
  useNavigate: () => mockedUsedNavigate
}));

it('renders the input cities', () => {
    const cities = ['Vienna', 'Chicago'];
    render(
        <BrowserRouter>
            <CitiesListPage cities={cities}/>
        </BrowserRouter>
    );
    for(let city of cities){
        const cityElement = screen.getByText(new RegExp(`${city}`, 'i'));
        expect(cityElement).toBeInTheDocument();
    }
}) 

it('call navigates to /add-city on button press', async () => {
    const {getByRole} = render(
        <BrowserRouter>
            <CitiesListPage cities={['Asd']}/>
        </BrowserRouter>
    );
    const buttonElement = screen.getByRole('button', {name: '+'});
    await userEvent.click(buttonElement);
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/add-city');
})