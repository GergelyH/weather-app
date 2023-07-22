import {render, screen} from '@testing-library/react';
import City from './City';

test('Renders and check if the city name can be found', () => {
    const {getByText}  = render(<City name='Paris'/>);
    const element = getByText(/Paris/i);
    expect(element).toBeInTheDocument();
})