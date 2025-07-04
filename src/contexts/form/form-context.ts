import { createContext } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

export interface FormContextValue<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
}

export const FormContext = createContext<FormContextValue | undefined>(undefined);
