import React from 'react';
import { render } from '@testing-library/react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppView from './index'; // Adjust path as needed
import { Text } from 'react-native';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

describe('AppView', () => {
  beforeEach(() => {
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ top: 20, bottom: 30, left: 0, right: 0 });
  });

  it('applies safe area insets correctly', () => {
    // Render the component with the SafeAreaProvider to make sure the insets are available
    const { getByTestId } = render(
      <AppView>
        <Text>Test Content</Text>
      </AppView>
    );

    const view = getByTestId('app-view');

    // Check that the safe area insets are applied (this would depend on the default behavior of your styles)
    expect(view.props.style).toContainEqual(
      expect.objectContaining({ paddingTop: expect.any(Number) }),
    );
    expect(view.props.style).toContainEqual(
      expect.objectContaining({ paddingBottom: expect.any(Number) }),
    );
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <AppView>
        <Text>Test Content</Text>
      </AppView>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies custom styles correctly', () => {
    const customStyle = { backgroundColor: 'lightgray', padding: 10 };

    const { getByTestId } = render(
      <AppView customViewStyle={customStyle}>
        <Text>Custom Style Test</Text>
      </AppView>
    );

    const view = getByTestId('app-view'); // Ensure you have a testID for the AppView component

    // Check if the custom style has been applied correctly
    expect(view.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: 'lightgray' }),
    );
    expect(view.props.style).toContainEqual(
      expect.objectContaining({ padding: 10 }),
    );
  });
});
