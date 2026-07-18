import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppTextInput from './index';
import { Text } from 'react-native';

describe('AppTextInput Component', () => {
    it('renders correctly with minimal props', () => {
        const { getByPlaceholderText } = render(<AppTextInput placeholder="Enter text" />);
        expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('displays label when provided', () => {
        const { getByText } = render(<AppTextInput label="Username" />);
        expect(getByText('Username')).toBeTruthy();
    });

    it('triggers setInput on text change', () => {
        const mockSetInput = jest.fn();
        const { getByPlaceholderText } = render(
            <AppTextInput placeholder="Type" setInput={mockSetInput} />
        );
        fireEvent.changeText(getByPlaceholderText('Type'), 'Hello');
        expect(mockSetInput).toHaveBeenCalledWith('Hello');
    });

    it('calls setfocus on focus and blur', () => {
        const mockSetFocus = jest.fn();
        const { getByPlaceholderText } = render(
            <AppTextInput placeholder="Focus test" setfocus={mockSetFocus} />
        );
        const input = getByPlaceholderText('Focus test');
        fireEvent(input, 'focus');
        fireEvent(input, 'blur');
        expect(mockSetFocus).toHaveBeenCalledWith(true);
        expect(mockSetFocus).toHaveBeenCalledWith(false);
    });

    it('renders left and right icons when passed', () => {
        const left = <Text>Left</Text>;
        const right = <Text>Right</Text>;
        const { getByText } = render(
            <AppTextInput leftIcon={left} rightIcon={right} />
        );
        expect(getByText('Left')).toBeTruthy();
        expect(getByText('Right')).toBeTruthy();
    });

    it('handles secureTextEntry prop', () => {
        const { getByPlaceholderText } = render(
            <AppTextInput placeholder="Password" secureTextEntry />
        );
        expect(getByPlaceholderText('Password').props.secureTextEntry).toBe(true);
    });

    it('renders error message when isError is passed', () => {
        const { getByText } = render(<AppTextInput isError="Invalid input" />);
        expect(getByText('Invalid input')).toBeTruthy();
    });

    it('handles editable prop', () => {
        const { getByPlaceholderText } = render(
            <AppTextInput placeholder="Edit Test" editable={false} />
        );
        expect(getByPlaceholderText('Edit Test').props.editable).toBe(false);
    });

    it('supports maxLength', () => {
        const { getByPlaceholderText } = render(
            <AppTextInput placeholder="Max Test" maxLength={5} />
        );
        expect(getByPlaceholderText('Max Test').props.maxLength).toBe(5);
    });

    it('calls onRightIconPress when right icon is pressed', () => {
        const mockPress = jest.fn();
        const right = <Text>R</Text>;
        const { getByText } = render(
            <AppTextInput rightIcon={right} onRightIconPress={mockPress} />
        );
        fireEvent.press(getByText('R'));
        expect(mockPress).toHaveBeenCalled();
    });

    it('calls onKeyPress when key is pressed', () => {
        const mockKeyPress = jest.fn();
        const { getByPlaceholderText } = render(
            <AppTextInput placeholder="KeyPress" onKeyPress={mockKeyPress} />
        );
        fireEvent(getByPlaceholderText('KeyPress'), 'keyPress', {
            nativeEvent: { key: 'Enter' },
        });
        expect(mockKeyPress).toHaveBeenCalled();
    });
});
