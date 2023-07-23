import { render } from '@testing-library/react';

import AddCity from "./AddCity";

test('Renders a input field', () => {
    const { getByRole } = render(<AddCity />);
    const textField = getByRole('textbox');
    expect(textField).toBeInTheDocument();
})

test('', () => {
    const { getByRole } = render(<AddCity />);
    const textField = getByRole('textbox');
    expect(textField).toBeInTheDocument();
})