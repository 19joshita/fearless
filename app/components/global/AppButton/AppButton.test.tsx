import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import AppButton from '.';
import {COLORS, FONT_VARIENTS} from '@theme';
import {View} from 'react-native';

describe('AppButton', () => {
  it('renders button with given text', () => {
    const {getByText} = render(
      <AppButton text="Click me" onHandlePress={() => {}} />,
    );
    const buttonText = getByText('Click me');
    expect(buttonText).toBeTruthy();
  });

  it('applies custom font size and color', () => {
    const {getByText} = render(
      <AppButton
        text="Click me"
        fontSize={FONT_VARIENTS.h3}
        color={COLORS.PRIMARY_COLOR}
        onHandlePress={() => {}}
      />,
    );
    const buttonText = getByText('Click me');
    expect(buttonText).toHaveStyle({
      fontSize: FONT_VARIENTS.h3,
      color: COLORS.PRIMARY_COLOR,
    });
  });

  it('displays ActivityIndicator when loading', () => {
    const {getByTestId} = render(
      <AppButton isLoading={true} onHandlePress={() => {}} text="Click me" />,
    );
    const activityIndicator = getByTestId('activity-indicator');
    expect(activityIndicator).toBeTruthy();
  });

  it('fires onHandlePress when pressed', () => {
    const mockPressHandler = jest.fn();
    const {getByText} = render(
      <AppButton text="Click me" onHandlePress={mockPressHandler} />,
    );
    const button = getByText('Click me');
    fireEvent.press(button);
    expect(mockPressHandler).toHaveBeenCalledTimes(1);
  });

  it('renders left and right icons if provided', () => {
    const {getByTestId} = render(
      <AppButton
        text="Click me"
        leftIcon={<View testID="left-icon" />}
        rightIcon={<View testID="right-icon" />}
        onHandlePress={() => {}}
      />,
    );
    const leftIcon = getByTestId('left-icon');
    const rightIcon = getByTestId('right-icon');
    expect(leftIcon).toBeTruthy();
    expect(rightIcon).toBeTruthy();
  });

  it('disables button when disabled prop is true', () => {
    const {getByText} = render(
      <AppButton text="Click me" disabled={true} onHandlePress={() => {}} />,
    );
    const button = getByText('Click me');
    expect(button).toBeDisabled();
  });
});
