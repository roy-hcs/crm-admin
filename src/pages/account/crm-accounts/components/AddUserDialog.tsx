import { FormInput } from '@/components/form/FormInput';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormSelect } from '@/components/form/FormSelect';
import { colorPreferenceOptions, crmAccountTypeOptions, roleOptions } from '@/lib/const';
import { FormPhoneInput } from '@/components/form/FormPhoneInput';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useDictType } from '@/api/hooks/system';
import { useCheckEmailUnique, useCheckPhoneUnique } from '@/api/hooks/common';
import { useAddCrmUser } from '@/api/hooks/account';
import { JSEncrypt as JSE } from 'jsencrypt';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import { RrhForm } from '@/components/form/RrhForm';

const addUserSchema = (t: TFunction<'translation', undefined>) => {
  return {
    lastName: z.string().min(1, t('rules.required', { field: t('rules.lastName') })),
    name: z
      .string()
      .min(1, t('rules.required', { field: t('rules.firstName') }))
      .max(32, t('rules.limitLength', { field: 32 })),
    mzone: z.string(),
    mobile: z
      .string()
      .min(1, t('rules.required', { field: t('rules.mobile') }))
      .regex(/^\d{11}$/, t('rules.pattern', { field: t('rules.mobile') }))
      .or(z.literal('')),
    email: z
      .string()
      .min(1, t('rules.required', { field: t('rules.email') }))
      .email(t('rules.pattern', { field: t('rules.email') })),
    inviter: z.string().optional(),
    pwd: z
      .string()
      .min(8, t('rules.limitLength', { field: 8 }))
      .max(20, t('rules.limitLength', { field: 20 }))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
        t('rules.pattern', { field: t('rules.pwd') }),
      )
      .or(z.literal('')),
    preferenceLanguage: z
      .string()
      .min(1, t('rules.required', { field: t('rules.preferenceLanguage') })),
    accountType: z.string().min(1, t('rules.required', { field: t('rules.accountType') })),
    roleId: z.string().min(1, t('rules.required', { field: t('rules.roleId') })),
    colorPreference: z.string().min(1, t('rules.required', { field: t('rules.colorPreference') })),
    status: z.string().min(1, t('rules.required', { field: t('rules.status') })),
  };
};

export const AddUserDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { data: languageList } = useDictType('sys_language');
  const { t } = useTranslation();

  const form = useForm({
    resolver: zodResolver(z.object(addUserSchema(t))),
    defaultValues: {
      lastName: '',
      name: '',
      mzone: '+86-0',
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
  const { mutateAsync: checkEmailUnique, data: checkEmailRes } = useCheckEmailUnique();
  const { mutateAsync: checkPhoneUnique, data: checkPhoneRes } = useCheckPhoneUnique();
  const { mutateAsync: addUserMutation } = useAddCrmUser();
  useEffect(() => {
    if (checkPhoneRes === 1) {
      form.setError('mobile', {
        type: 'manual',
        message: t('rules.phoneAlreadyUsed'),
      });
    } else if (checkPhoneRes !== undefined && checkPhoneRes !== 1) {
      form.clearErrors('mobile');
    }
  }, [checkPhoneRes, form, t]);

  useEffect(() => {
    if (checkEmailRes === 1) {
      form.setError('email', {
        type: 'manual',
        message: t('rules.emailAlreadyUsed'),
      });
    } else if (checkEmailRes !== undefined && checkEmailRes !== 1) {
      form.clearErrors('email');
    }
  }, [checkEmailRes, form, t]);

  const onSubmit = async (data: { [key: string]: string }) => {
    try {
      setIsSubmitting(true);
      // 提交前再次验证邮箱和手机号的唯一性
      const [emailResult, phoneResult] = await Promise.all([
        checkEmailUnique({ email: data.email }),
        data.mobile
          ? checkPhoneUnique({ mobile: data.mobile, phone: data.mobile })
          : Promise.resolve(0),
      ]);
      // 密码需要加密后使用
      let pwd = '';
      if (data.pwd) {
        const encrypt = new JSE();
        encrypt.setPublicKey(localStorage.getItem('publicKey') || '');
        pwd = encrypt.encrypt(data.pwd) || '';
      }
      // 检查验证结果
      let hasError = false;
      if (emailResult === 1) {
        form.setError('email', {
          type: 'manual',
          message: t('rules.emailAlreadyUsed'),
        });
        hasError = true;
      }
      if (phoneResult === 1) {
        form.setError('mobile', {
          type: 'manual',
          message: t('rules.phoneAlreadyUsed'),
        });
        hasError = true;
      }

      if (hasError) {
        setIsSubmitting(false);
        return; // 有验证错误，停止提交
      }
      const mzone = data.mzone.split('-')?.[0].replace('+', '') || '';
      const res = await addUserMutation({
        deptId: '',
        lastName: data.lastName,
        name: data.name,
        fullName: '', // ai拆解名字的功能恢复之后才启用该字段
        mzone,
        mobile: data.mobile,
        email: data.email,
        inviter: data.inviter,
        pwd,
        preferenceLanguage: data.preferenceLanguage,
        accountType: data.accountType,
        roleId: data.roleId,
        colorPreference: data.colorPreference,
        source: '3',
        status: data.status,
      });
      if (res.code === 0) {
        form.reset();
        setIsSubmitting(false);
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
      modal={false}
      trigger={
        <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
          {t('CRMAccountPage.AddClient')}
        </RrhButton>
      }
      title={t('CRMAccountPage.AddClient')}
      cancelText={t('common.Cancel')}
      confirmText={t('common.Confirm')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="large"
      formLoading={isSubmitting}
      className="pb-22"
    >
      <RrhForm
        form={form}
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
      >
        <div>
          <FormInput
            name="lastName"
            label={`${t('CRMAccountPage.lastName')}`}
            verticalLabel
            placeholder={t('rules.limitLength', { field: 32 })}
          />
          {/* 等api可用之后再使用该功能 */}
          {/* <div className="mt-2 cursor-pointer text-xs underline">
                {t('CRMAccountPage.aiSplitFullName')}
              </div> */}
        </div>

        <FormInput
          name="name"
          label={`${t('CRMAccountPage.firstName')}`}
          verticalLabel
          placeholder={t('rules.limitLength', { field: 32 })}
        />
        <FormPhoneInput
          name="mobile"
          mzoneFieldName="mzone"
          label={`${t('CRMAccountPage.Mobile')} (${t('common.optional')})`}
          placeholder={`${t('CRMAccountPage.Mobile')}`}
          verticalLabel
          onBlur={async e => {
            await checkPhoneUnique({ mobile: e.target.value, phone: e.target.value });
          }}
        />
        <FormInput
          name="email"
          label={`${t('loginPage.email')}`}
          verticalLabel
          placeholder={`${t('common.pleaseInput', { field: t('loginPage.email') })}`}
          onBlur={async e => {
            await checkEmailUnique({ email: e.target.value });
          }}
        />
        <SelectUpperDropdown
          rawLabel={`${t('CRMAccountPage.Superior')} (${t('common.optional')})`}
          name="inviter"
        />
        <div>
          <FormInput
            name="pwd"
            label={`${t('loginPage.password')} (${t('common.optional')})`}
            verticalLabel
            placeholder={`${t('rules.pwdPlaceholder')}`}
          />
          <div className="mt-2 text-xs">{t('rules.pwdTips')}</div>
        </div>
        <FormSelect
          name="preferenceLanguage"
          label={`${t('rules.preferenceLanguage')}`}
          verticalLabel
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={(languageList || []).map(i => ({
            label: i.dictLabel,
            value: i.dictValue,
          }))}
        />
        <FormSelect
          name="accountType"
          label={`${t('CRMAccountPage.CRMAccountType')}`}
          verticalLabel
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={crmAccountTypeOptions.map(i => ({ label: t(i.label), value: i.value }))}
        />
        <FormSelect
          name="roleId"
          label={`${t('table.role')}`}
          verticalLabel
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={roleOptions.map(i => ({ label: t(i.label), value: i.value }))}
        />
        <FormSelect
          name="colorPreference"
          label={`${t('CRMAccountPage.ColorPreferences')}`}
          verticalLabel
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={colorPreferenceOptions.map(i => ({ label: t(i.label), value: i.value }))}
          renderItem={option => {
            return (
              <div className="flex items-center gap-2">
                <TrendingUp className={option.value === '1' ? 'text-green-600' : 'text-red-600'} />
                <span>{option.label}</span>
              </div>
            );
          }}
        />

        <div className="bg-background border-muted absolute inset-x-0 bottom-0 col-span-full flex justify-between rounded-b-lg border-t p-4 sm:p-6">
          <FormField
            name="status"
            render={({ field }) => (
              <FormItem>
                <div className="flex h-9 items-center gap-3">
                  <div className="flex basis-9/12 items-center">
                    <Switch
                      checked={field.value === '1'}
                      onCheckedChange={checked => field.onChange(checked ? '1' : '0')}
                    />
                  </div>
                  <FormLabel className="basis-3/12 whitespace-nowrap">
                    {t('CRMAccountPage.status')}
                  </FormLabel>
                </div>
              </FormItem>
            )}
            control={form.control}
          />
          <div className="flex justify-end gap-4">
            <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={onCancel}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton type="submit" className="px-4 py-2">
              {t('common.Confirm')}
            </RrhButton>
          </div>
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
