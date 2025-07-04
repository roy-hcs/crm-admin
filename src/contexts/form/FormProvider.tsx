import { FieldValues, UseFormReturn } from 'react-hook-form';
import { FormContext } from './form-context';

export const FormProvider = <T extends FieldValues>({
  children,
  form,
}: {
  children: React.ReactNode;
  form: UseFormReturn<T>;
}) => {
  return (
    <FormContext.Provider value={{ form: form as UseFormReturn<FieldValues> }}>
      {children}
    </FormContext.Provider>
  );
};
