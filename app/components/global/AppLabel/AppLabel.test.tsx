import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppLabel from './index';

describe('AppLabel', () => {
    it('renders the given text', () => {
        const { getByText } = render(<AppLabel text="Hello World" />);
        expect(getByText('Hello World')).toBeTruthy();
    });

    it('applies custom font size and color', () => {
        const { getByText } = render(
            <AppLabel text="Styled Text" textStyle={{ fontSize: 20, color: 'red' }} />
        );

        const textElement = getByText('Styled Text');
        const style = textElement.props.style;
        const flattenedStyle = Array.isArray(style)
            ? Object.assign({}, ...style)
            : style;

        expect(flattenedStyle.fontSize).toBe(20);
        expect(flattenedStyle.color).toBe('red');
    });

    it('calls onPress when pressed', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(
            <AppLabel text="Press me" onPress={onPressMock} />
        );

        fireEvent.press(getByText('Press me'));
        expect(onPressMock).toHaveBeenCalled();
    });
});
