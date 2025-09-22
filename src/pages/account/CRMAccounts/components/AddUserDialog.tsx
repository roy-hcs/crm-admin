import { FormInput } from '@/components/form/FormInput';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { FormProvider } from '@/contexts/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { SelectUpperPopup } from './SelectUpperPopup';
import { FormSelect } from '@/components/form/FormSelect';
import { colorPreferenceOptions, crmAccountTypeOptions, roleOptions } from '@/lib/const';
// import { RrhSelect } from '@/components/common/RrhSelect';
// import mobileZone from '@/data/mzone.json';
import { FormPhoneInput } from '@/components/form/FormPhoneInput';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { TFunction } from 'i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';

// create a zod schema for the form data
const addUserSchema = (t: TFunction<'translation', undefined>) => {
  return {
    lastName: z.string().min(1, t('rules.required', { field: t('rules.lastName') })),
    name: z.string().min(1, t('rules.required', { field: t('rules.firstName') })),
    mobile: z
      .string()
      .min(1, t('rules.required', { field: t('rules.mobile') }))
      .regex(/^\d{11}$/, t('rules.pattern', { field: t('rules.mobile') })),
    email: z.string().email(t('rules.email')).optional(),
    inviter: z.string().optional(),
    pwd: z.string().min(1, t('rules.required', { field: t('rules.pwd') })),
    preferenceLanguage: z
      .string()
      .min(1, t('rules.required', { field: t('rules.preferenceLanguage') })),
    accountType: z.string().min(1, t('rules.required', { field: t('rules.accountType') })),
    roleId: z.string().min(1, t('rules.required', { field: t('rules.roleId') })),
    colorPreference: z.string().min(1, t('rules.required', { field: t('rules.colorPreference') })),
    status: z.string().min(1, t('rules.required', { field: t('rules.status') })),
  };
};

export const AddUserDialog = () => {
  const [open, setOpen] = useState(false);
  // const [mzone, setMzone] = useState('+86');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  // const mobileZoneOptions = mobileZone.mzone.map(item => {
  //   return {
  //     label: `${item.area} ${item.code}`,
  //     value: `+${item.code}`,
  //   };
  // });
  const { t } = useTranslation();

  const form = useForm({
    resolver: zodResolver(z.object(addUserSchema(t))),
    defaultValues: {
      lastName: '',
      name: '',
      mobile: '',
      email: '',
      inviter: '',
      pwd: '',
      preferenceLanguage: 'zh-CN',
      accountType: '',
      roleId: '',
      colorPreference: '',
      status: '1',
    },
  });
  const onSubmit = async (data: { [key: string]: string }) => {
    console.log('on submit---', data);
    try {
      setIsSubmitting(true);
      // Make your API request here
      // const response = await api.createUser(data);
      console.log('Form submitted:', data);

      // If the request is successful, close the dialog
      // setOpen(false);
    } catch (error) {
      // If the request fails, keep the dialog open and show error
      console.error('Error submitting form:', error);
      // You can set an error state and display it in your form
    } finally {
      setIsSubmitting(false);
    }
  };
  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <RrhDialog
      trigger={
        <Button
          variant="outline"
          className="flex cursor-pointer items-center gap-1 border px-4 text-sm text-[#1E1E1E]"
        >
          <Plus className="size-3.5" />
          <span>{t('CRMAccountPage.AddClient')}</span>
        </Button>
      }
      title={t('CRMAccountPage.AddClient')}
      className="flex min-h-1/2 min-w-1/2 flex-col"
      cancelText={t('common.Cancel')}
      confirmText={t('common.Confirm')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
    >
      <div>
        <FormProvider form={form}>
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2"
            >
              <FormInput
                name="lastName"
                label={`${t('CRMAccountPage.lastName')}:`}
                placeholder={t('common.pleaseInput', { field: t('CRMAccountPage.lastName') })}
              />
              <FormInput
                name="name"
                label={`${t('CRMAccountPage.firstName')}:`}
                placeholder={t('common.pleaseInput', { field: t('CRMAccountPage.firstName') })}
              />
              <FormPhoneInput
                name="mobile"
                label={`${t('CRMAccountPage.Mobile')}:`}
                placeholder={`${t('CRMAccountPage.Mobile')}`}
                className="col-span-1 md:col-span-2"
              />
              <FormInput
                name="email"
                label={`${t('loginPage.email')}:`}
                placeholder={`${t('common.pleaseInput', { field: t('loginPage.email') })}`}
              />
              <FormField
                name="inviter"
                render={({ field }) => {
                  return <SelectUpperPopup field={field} />;
                }}
              />
              <FormInput
                name="pwd"
                label={`${t('loginPage.password')}:`}
                placeholder={`${t('common.pleaseInput', { field: t('loginPage.password') })}`}
              />
              <FormInput
                name="preferenceLanguage"
                label={`${t('rules.preferenceLanguage')}:`}
                placeholder={`${t('common.pleaseInput', { field: t('rules.preferenceLanguage') })}`}
              />
              <FormSelect
                name="roleId"
                label={`${t('CRMAccountPage.CRMAccountType')}:`}
                placeholder={`${t('common.pleaseSelect')}`}
                options={crmAccountTypeOptions}
              />
              <FormSelect
                name="roleId"
                label={`${t('CRMAccountPage.Role')}:`}
                placeholder={`${t('common.pleaseSelect')}`}
                options={roleOptions}
              />
              <FormSelect
                name="roleId"
                label={`${t('CRMAccountPage.ColorPreferences')}:`}
                placeholder={t('common.pleaseSelect')}
                options={colorPreferenceOptions}
              />
              <FormField
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex h-9 items-center">
                      <FormLabel className="basis-3/12">{t('CRMAccountPage.status')}:</FormLabel>
                      <div className="flex basis-9/12 items-center">
                        <Switch
                          checked={field.value === '1'}
                          onCheckedChange={checked => field.onChange(checked ? '1' : '0')}
                        />
                      </div>
                    </div>
                  </FormItem>
                )}
                control={form.control}
              />
              <div className="col-span-full flex justify-end gap-4">
                <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={onCancel}>
                  {t('common.Cancel')}
                </RrhButton>
                <RrhButton type="submit" className="px-4 py-2">
                  {t('common.Confirm')}
                </RrhButton>
              </div>
            </form>
          </Form>
        </FormProvider>
      </div>
    </RrhDialog>
  );
};
