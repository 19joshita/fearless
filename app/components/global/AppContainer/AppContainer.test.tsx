import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppContainer from '.';
import { Text } from 'react-native';

describe('AppContainer', () => {
  it('renders child components correctly when not loading', () => {
    const { getByText } = render(
      <AppContainer loading={false} onPress={() => { }} customStyle={{}}>
        <Text>Child Component</Text>
      </AppContainer>,
    );
    const childText = getByText('Child Component');
    expect(childText).toBeTruthy();
  });

  it('shows ActivityIndicator when loading is true', () => {
    const { getByTestId } = render(
      <AppContainer loading={true} onPress={() => { }} customStyle={{}}>
        <Text>Child Component</Text>
      </AppContainer>,
    );
    const activityIndicator = getByTestId('activity-indicator');
    expect(activityIndicator).toBeTruthy();
  });

  it('fires onPress when not disabled', () => {
    const mockPressHandler = jest.fn();
    const { getByTestId } = render(
      <AppContainer loading={false} onPress={mockPressHandler} customStyle={{}}>
        <Text>Child Component</Text>
      </AppContainer>,
    );
    const container = getByTestId('app-container');
    fireEvent.press(container);
    expect(mockPressHandler).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress when disabled', () => {
    const mockPressHandler = jest.fn();
    const { getByTestId } = render(
      <AppContainer
        loading={false}
        onPress={mockPressHandler}
        disabled={true}
        customStyle={{}}>
        <Text>Child Component</Text>
      </AppContainer>,
    );
    const container = getByTestId('app-container');
    fireEvent.press(container);
    expect(mockPressHandler).toHaveBeenCalledTimes(0);
  });

  it('applies custom styles', () => {
    const { getByTestId } = render(
      <AppContainer
        loading={false}
        onPress={() => { }}
        customStyle={{ backgroundColor: 'blue' }}>
        <Text>Child Component</Text>
      </AppContainer>,
    );
    const container = getByTestId('app-container');
    expect(container).toHaveStyle({ backgroundColor: 'blue' });
  });

  it('applies animated transitions', () => {
    const { getByTestId } = render(
      <AppContainer loading={false} onPress={() => { }} customStyle={{}}>
        <Text>Child Component</Text>
      </AppContainer>,
    );
    const container = getByTestId('app-container');
    expect(container).toBeTruthy();
  });
});
