import React from 'react';
import { render } from '@testing-library/react-native';
import AppScrollView from './index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native';

// Mock the useSafeAreaInsets hook at the top
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: jest.fn(),
}));

describe('AppScrollView', () => {
    beforeEach(() => {
        (useSafeAreaInsets as jest.Mock).mockReturnValue({ top: 20, bottom: 30, left: 0, right: 0 });
    });

    it('renders child components correctly', () => {
        const { getByText } = render(
            <AppScrollView customStyle={{}} contentContainerStyle={{}}>
                <Text>Child Component</Text>
            </AppScrollView>
        );
        const childText = getByText('Child Component');
        expect(childText).toBeTruthy();
    });

    it('applies paddingTop and paddingBottom based on safe area insets', () => {
        const { getByTestId } = render(
            <AppScrollView customStyle={{}} contentContainerStyle={{}}>
                <Text>Child Component</Text>
            </AppScrollView>
        );

        const scrollView = getByTestId('app-scroll-view');
        expect(scrollView).toHaveStyle({ paddingTop: 20, paddingBottom: 30 });
    });

    it('applies custom styles', () => {
        const { getByTestId } = render(
            <AppScrollView customStyle={{ backgroundColor: 'blue' }} contentContainerStyle={{}}>
                <Text>Child Component</Text>
            </AppScrollView>
        );

        const scrollView = getByTestId('app-scroll-view');
        expect(scrollView).toHaveStyle({ backgroundColor: 'blue' });
    });

    it('applies contentContainerStyle correctly', () => {
        const { getByTestId } = render(
            <AppScrollView customStyle={{}} contentContainerStyle={{ padding: 20 }}>
                <Text>Child Component</Text>
            </AppScrollView>
        );

        const scrollView = getByTestId('app-scroll-view');
        expect(scrollView.props.contentContainerStyle).toContainEqual({ padding: 20 });
    });

    it('hides the vertical scroll indicator', () => {
        const { getByTestId } = render(
            <AppScrollView customStyle={{}} contentContainerStyle={{}}>
                <Text>Child Component</Text>
            </AppScrollView>
        );

        const scrollView = getByTestId('app-scroll-view');
        expect(scrollView.props.showsVerticalScrollIndicator).toBe(false);
    });
});
