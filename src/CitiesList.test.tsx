import { render, screen } from '@testing-library/react';
import CitiesList from './CitiesList';

test('Tests CitiesList rendering the input cities', () => {
    const cities = ['Vienna', 'Chicago'];
    render(<CitiesList cities={cities}/>);
    for(let city of cities){
        const cityElement = screen.getByText(new RegExp(`${city}`, 'i'));
        expect(cityElement).toBeInTheDocument();
    }
}) 