import {ReactNode} from 'react';

export interface AppCheckboxProps {
  title?: ReactNode | string; // The label next to the checkbox (string or ReactNode)
  onChange: (checked: boolean) => void; // Callback when checkbox is toggled
  checked: boolean; // Optional initial value
  error?: string;
}
