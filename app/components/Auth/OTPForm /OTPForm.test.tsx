import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import OTPForm from './index';
import { TextInput } from 'react-native';

jest.useFakeTimers();

const mockSetOtpInput = jest.fn();
const mockOnOtpSend = jest.fn();

const setup = (props = {}) => {
    return render(
        <OTPForm
            otpInput=""
            setOtpInput={mockSetOtpInput}
            otpError=""
            onOtpSend={mockOnOtpSend}
            otpSendLoading={false}
            mobileNumber="+1234567890"
            {...props}
        />
    );
};

describe('OTPForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all OTP input fields', () => {
        const { getAllByTestId } = setup();
        const inputs = getAllByTestId('otp-input');
        expect(inputs.length).toBe(6);
    });

    it('shows mobile number in prompt text', () => {
        const { getByText } = setup();
        expect(getByText(/Enter the 6-digit code sent via SMS at \+1234567890/)).toBeTruthy();
    });

    // it('allows user to type digits in inputs and calls setOtpInput', () => {
    //     const { getAllByTestId } = setup();
    //     const inputs = getAllByTestId('otp-input');

    //     fireEvent.changeText(inputs[0], '1');
    //     fireEvent.changeText(inputs[1], '2');
    //     fireEvent.changeText(inputs[2], '3');

    //     expect(mockSetOtpInput).toHaveBeenCalledWith('1');
    //     expect(mockSetOtpInput).toHaveBeenCalledWith('12');
    //     expect(mockSetOtpInput).toHaveBeenCalledWith('123');
    // });

    // test('moves focus to next input on character input', () => {
    //     const setOtpInput = jest.fn();
    //     const { getAllByTestId } = render(
    //         <OTPForm
    //             otpInput=""
    //             setOtpInput={setOtpInput}
    //             otpError=""
    //             onOtpSend={jest.fn()}
    //             otpSendLoading={false}
    //             mobileNumber="+1234567890"
    //         />
    //     );

    //     const inputs = getAllByTestId('otp-input');
    //     fireEvent.changeText(inputs[0], '4');

    //     // Check that second input becomes focusable / accessible
    //     fireEvent.changeText(inputs[1], '5');
    //     expect(setOtpInput).toHaveBeenLastCalledWith('45');
    // });

    // it('handles backspace by clearing input and moving focus', () => {
    //     const { getAllByTestId } = setup();
    //     const inputs = getAllByTestId('otp-input');

    //     fireEvent.changeText(inputs[1], '7');
    //     fireEvent(inputs[1], 'onKeyPress', { nativeEvent: { key: 'Backspace' } });

    //     // Focus should move to index 0
    //     const spy = jest.spyOn(inputs[0], 'focus');
    //     expect(spy).toHaveBeenCalled();
    // });

    // it('shows OTP error message when provided', () => {
    //     const { getByText } = setup({ otpError: 'Invalid OTP' });
    //     expect(getByText('Invalid OTP')).toBeTruthy();
    // });

    // it('calls onOtpSend when resend button is pressed after timeout', async () => {
    //     mockOnOtpSend.mockResolvedValue(true);
    //     const { getByText } = setup();

    //     await act(async () => {
    //         jest.advanceTimersByTime(60000);
    //     });

    //     const resendButton = getByText('Resend code via sms');
    //     fireEvent.press(resendButton);
    //     expect(mockOnOtpSend).toHaveBeenCalled();
    // });
});