import { FormProvider } from '@/contexts/form';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { Form } from '../ui/form';
import { DetailedHTMLProps, FormHTMLAttributes } from 'react';

export const RrhForm = <T extends FieldValues>({
  form,
  children,
  ...props
}: {
  children: React.ReactNode;
  form: UseFormReturn<T>;
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) => {
  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form {...props}>{children}</form>
      </Form>
    </FormProvider>
  );
};
