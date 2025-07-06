declare module 'react-phone-input-2' {
  import { ComponentType } from 'react';

  interface PhoneInputProps {
    country?: string;
    value?: string;
    onChange: (phone: string) => void;
    inputClass?: string;
    containerClass?: string;
    buttonClass?: string;
    placeholder?: string;
    inputProps?: {
      autoComplete?: string;
      name?: string;
      'aria-label'?: string;
      [key: string]: any;
    };
  }

  const PhoneInput: ComponentType<PhoneInputProps>;
  export default PhoneInput;
} 