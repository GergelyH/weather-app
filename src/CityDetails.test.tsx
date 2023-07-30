import { render, screen } from '@testing-library/react';
import CityDetails from './CityDetails';

it('renders the city name', () => {
    render(<CityDetails city={'Budapest'}/>);
    const cityElement = screen.getByText('Budapest');
    expect(cityElement).toBeInTheDocument();
})