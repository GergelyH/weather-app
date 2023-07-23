import { useNavigate } from "react-router-dom";
import { render, screen, fireEvent } from '@testing-library/react';
import CitiesList from './CitiesList';

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockUseNavigate,
}));

it('renders the input cities', () => {
    const cities = ['Vienna', 'Chicago'];
    render(<CitiesList cities={cities}/>);
    for(let city of cities){
        const cityElement = screen.getByText(new RegExp(`${city}`, 'i'));
        expect(cityElement).toBeInTheDocument();
    }
}) 


it('call navigates to /add-city on button press', () => {
//     const mockHistoryPush = jest.fn();
//   useNavigate.mockReturnValue({
//     push: mockHistoryPush,
//   });
    const {getByRole} = render(<CitiesList cities={[]}/>);
    const buttonElement = getByRole('button');
    fireEvent.click(buttonElement);
    expect(mockUseNavigate).toHaveBeenCalledWith("/", {
        replace: true,
    });

})