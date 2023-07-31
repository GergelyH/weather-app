import { render, screen } from '@testing-library/react';
import CityDetailsPage from './CityDetailsPage';

it('renders the city name', () => {
    render(<CityDetailsPage city={'Budapest'}/>);
    const cityElement = screen.getByText('Budapest');
    expect(cityElement).toBeInTheDocument();
})