import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormInput } from '@/components/form/FormInput';
import { useAddTempUser, useCheckUserEmailUnique } from '@/api/hooks/system/system';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { TFunction } from 'i18next';
import { RrhForm } from '@/components/form/RrhForm';
import { toast } from 'sonner';
import { FormSelect } from '@/components/form/FormSelect';
import { SelectOption } from '@/api/types';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import {
  applyInputNormalizer,
  normalizePositiveDecimalInput,
} from '@/pages/marketing/shared/formValueUtils';

type FormValues = {
  email: string;
  confirmEmail: string;
  duration: string;
  roleId: string;
};

const addTempUserSchema = (t: TFunction<'translation', undefined>) => {
  return z
    .object({
      email: z
        .string()
        .min(1, t('rules.required', { field: t('rules.email') }))
        .email(t('rules.invalidEmailFormat')),
      confirmEmail: z
        .string()
        .min(1, t('rules.required', { field: t('adminAccounts.confirmEmail') })),
      duration: z.string().min(1, t('rules.required', { field: t('adminAccounts.duration') })),
      roleId: z.string().min(1, t('rules.required', { field: t('table.accountRole') })),
    })
    .refine(data => data.email === data.confirmEmail, {
      message: t('adminAccounts.confirmEmailMustMatch'),
      path: ['confirmEmail'], // 错误将关联到 confirmEmail 字段
    });
};

export const AddTemporaryAdminDialog = ({
  onSuccess,
  roleList,
  open: openProp,
  setOpen: onOpenChange,
  trigger,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  trigger?: ReactNode;
  onSuccess?: () => void;
  roleList: SelectOption[];
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'one' | 'two'>('one');
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;

  const { mutateAsync: add, isPending } = useAddTempUser();
  const { mutateAsync: checkEmailUnique, data: checkEmailRes } = useCheckUserEmailUnique();

  const schema = useMemo(() => addTempUserSchema(t), [t]);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      confirmEmail: '',
      duration: '',
      roleId: '',
    },
  });

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

  const updateOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  const onCancel = () => {
    switch (step) {
      case 'one': {
        onClose(false);
        break;
      }
      case 'two': {
        setStep('one');
        break;
      }
    }
  };

  const onConfirm = async () => {
    switch (step) {
      case 'one':
        setStep('two');
        break;
      case 'two':
        form.handleSubmit(onSubmit)();
        break;
    }
  };

  const onClose = (nextOpen: boolean) => {
    updateOpen(nextOpen);
    setStep('one');
  };

  const onSubmit = async (data: FormValues) => {
    console.log('data', data);
    try {
      const param = {
        userType: 1,
        email: data.email,
        confirmEmail: data.confirmEmail,
        duration: data.duration,
        roleType: data.roleId,
        roleId: data.roleId,
        roleIds: '',
      };
      const res = await add(param);
      if (res.code === 0) {
        toast.success(t('common.success'));
        form.reset();
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  return (
    <RrhDialog
      title={t('common.addField', {
        field: t('adminAccounts.temporaryAdmin'),
      })}
      open={open}
      trigger={trigger}
      cancelText={step === 'one' ? t('common.Cancel') : t('common.previousStep')}
      confirmText={step === 'one' ? t('common.next') : t('common.Confirm')}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="middle"
      type="submit"
      isConfirmDisabled={isPending}
      formLoading={isPending}
    >
      <div>
        {step === 'one' && (
          <div className="grid gap-6">
            <div className="text-foreground text-base leading-6 font-medium">
              {t('adminAccounts.temporaryAdminabout.0')}
            </div>
            <div className="text-muted-foreground text-sm leading-6">
              <div>1.{t('adminAccounts.temporaryAdminabout.1')}</div>
              <div>2.{t('adminAccounts.temporaryAdminabout.2')}</div>
              <div>3.{t('adminAccounts.temporaryAdminabout.3')}</div>
              <div>4.{t('adminAccounts.temporaryAdminabout.4')}</div>
              <div>5.{t('adminAccounts.temporaryAdminabout.5')}</div>
            </div>
          </div>
        )}
        {step === 'two' && (
          <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormInput
              name="email"
              label={t('rules.email')}
              placeholder={t('rules.limitLength', { field: 50 })}
              maxLength={50}
              onBlur={async e => {
                if (!e.target.value) return;
                // 校验邮箱是否唯一
                await checkEmailUnique({ email: e.target.value, name: '' });
              }}
            />

            <FormInput
              name="confirmEmail"
              label={t('adminAccounts.confirmEmail')}
              placeholder={t('rules.limitLength', { field: 50 })}
              maxLength={50}
            />

            <FormSelect
              name="roleId"
              label={t('table.accountRole')}
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={roleList}
            />

            <FormInputWithUnit
              name="duration"
              unit={t('common.hour')}
              label={t('adminAccounts.duration')}
              labeTipsDom={
                <div className="text-muted-foreground text-xs leading-4">
                  {t('adminAccounts.durationDesc')}
                </div>
              }
              onInput={event =>
                applyInputNormalizer(event.currentTarget, value =>
                  normalizePositiveDecimalInput(value, 2),
                )
              }
            />
          </RrhForm>
        )}
      </div>
    </RrhDialog>
  );
};
