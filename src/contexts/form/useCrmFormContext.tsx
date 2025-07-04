import { useContext } from 'react';
import { FieldValues } from 'react-hook-form';
import { FormContext, FormContextValue } from './form-context';

export const useCrmFormContext = <T extends FieldValues>() => {
  const context = useContext(FormContext) as FormContextValue<T> | undefined;
  if (!context) {
    throw new Error('useCrmFormContext must be used within a FormProvider');
  }
  return context;
};
