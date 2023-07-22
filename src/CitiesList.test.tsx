import { render, screen } from '@testing-library/react';
import CitiesList from './CitiesList';

test('Tests CitiesList rendering with a p tag containing Budapest', () => {
    render(<CitiesList/>);
    const budapestElement = screen.getByText(/Budapest/i);
    expect(budapestElement).toBeInTheDocument();
    expect(budapestElement.tagName).toBe('P');
}) 