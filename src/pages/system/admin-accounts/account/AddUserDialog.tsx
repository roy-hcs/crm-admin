import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormSelect } from '@/components/form/FormSelect';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import {
  useAddUser,
  useCheckUserEmailUnique,
  useEditUser,
  useGetUserDetail,
} from '@/api/hooks/system/system';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';
import { FormInput } from '@/components/form/FormInput';
import { FormPhoneInput } from '@/components/form/FormPhoneInput';
import { SelectOption } from '@/api/types';
import { FormSwitch } from '@/components/form/FormSwitch';
import { useCheckUserPhone } from '@/api/hooks/common';
import { JSEncrypt as JSE } from 'jsencrypt';

type FormValues = {
  userLastName: string;
  userName: string;
  mzone: string;
  phonenumber: string;
  email: string;
  password: string;
  chatId: string;
  status: string;
  roleId: string;
};

const addUserSchema = (t: TFunction<'translation', undefined>, mode: 'add' | 'edit' | 'view') => {
  return {
    userLastName: z.string().min(1, t('rules.required', { field: t('rules.lastName') })),
    userName: z.string().min(1, t('rules.required', { field: t('rules.firstName') })),
    mzone: z.string(),
    phonenumber: z.string(),
    email: z
      .string()
      .min(1, t('rules.required', { field: t('rules.email') }))
      .email(t('rules.invalidEmailFormat')),
    password:
      mode === 'add'
        ? z
            .string()
            .min(8, t('rules.limitLength', { field: 8 }))
            .max(20, t('rules.limitLength', { field: 20 }))
            .regex(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
              t('rules.pattern', { field: t('rules.pwd') }),
            )
        : z
            .string()
            .regex(
              /^$|^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
              t('rules.pattern', { field: t('rules.pwd') }),
            ),
    chatId: z.string(),
    status: z.string(),
    roleId: z.string().min(1, t('rules.required', { field: t('table.accountRole') })),
  };
};

export const AddUserDialog = ({
  onSuccess,
  roleList,
  mode,
  userId = '',
  open: openProp,
  setOpen: onOpenChange,
}: {
  onSuccess?: () => void;
  roleList: SelectOption[];
  mode: 'add' | 'edit' | 'view';
  userId?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';

  const defaultValues: FormValues = {
    userLastName: '',
    userName: '',
    mzone: '+86-0',
    phonenumber: '',
    email: '',
    password: '',
    chatId: '',
    status: '1',
    roleId: '',
  };

  const { mutateAsync: checkEmailUnique, data: checkEmailRes } = useCheckUserEmailUnique();
  const { mutateAsync: checkPhoneUnique, data: checkPhoneRes } = useCheckUserPhone();
  const { mutateAsync: add, isPending: isAddPending } = useAddUser();
  const { mutateAsync: edit, isPending: isEditPending } = useEditUser();
  const { mutateAsync: getDetail, isPending: isDetailPending } = useGetUserDetail();
  const isSubmitting = isAddPending || isEditPending;

  const schema = useMemo(() => z.object(addUserSchema(t, mode)), [t, mode]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (checkPhoneRes === 1) {
      form.setError('phonenumber', {
        type: 'manual',
        message: t('rules.phoneAlreadyUsed'),
      });
    } else if (checkPhoneRes !== undefined && checkPhoneRes !== 1) {
      form.clearErrors('phonenumber');
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

  const onSubmit = async (data: FormValues) => {
    try {
      let pwd = '';
      if (data.password) {
        const encrypt = new JSE();
        encrypt.setPublicKey(localStorage.getItem('publicKey') || '');
        pwd = encrypt.encrypt(data.password) || '';
      }
      const param = {
        userType: 0,
        userLastName: data.userLastName,
        userName: data.userName,
        mzone: data.mzone?.split('-')?.[0].replace('+', '') || '',
        phonenumber: data.phonenumber,
        email: data.email,
        roleType: data.roleId,
        password: pwd,
        chatId: data.chatId,
        status: Number(data.status),
        roleIds: '',
        postIds: '',
        roleId: data.roleId,
      };
      const res = isEditMode ? await edit({ ...param, userId }) : await add(param);
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

  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset(defaultValues);
    }
  };

  useEffect(() => {
    if (!open || !userId || (mode !== 'edit' && mode !== 'view')) return;

    const loadUserDetail = async () => {
      const res = await getDetail({ userId });
      if (res.code !== 0 || !res.data?.user) {
        toast.error(res.msg || t('common.AnErrorOccurred'));
        return;
      }

      const user = res.data.user;
      const mzone = user.mzone ? `+${String(user.mzone).replace('+', '')}-0` : '+86-0';
      form.reset({
        userLastName: user.userLastName || '',
        userName: user.userName || '',
        mzone,
        phonenumber: user.phonenumber || '',
        email: user.email || '',
        password: '',
        chatId: user.chatId || '',
        status: user.status || '1',
        roleId: user.roleId || user.roles?.[0]?.roleId || '',
      });
    };

    void loadUserDetail();
  }, [open, mode, userId, getDetail, form, t]);

  return (
    <RrhDialog
      trigger={
        mode === 'add' ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('adminAccounts.account')}
          </RrhButton>
        ) : null
      }
      title={
        mode === 'add'
          ? t('common.addField', { field: t('common.users') })
          : mode === 'edit'
            ? t('common.Edit')
            : t('common.View')
      }
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={() => form.handleSubmit(onSubmit)()}
      variant="large"
      type="submit"
      formLoading={isSubmitting || isDetailPending}
      confirmShow={!isViewMode}
    >
      <RrhForm
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
      >
        <FormInput
          name="userLastName"
          label={t('rules.lastName')}
          placeholder={t('rules.limitLength', { field: 32 })}
          maxLength={32}
          disabled={isViewMode}
        />
        <FormInput
          name="userName"
          label={t('rules.firstName')}
          placeholder={t('rules.limitLength', { field: 32 })}
          maxLength={32}
          disabled={isViewMode}
        />

        <FormPhoneInput
          name="phonenumber"
          mzoneFieldName="mzone"
          label={t('CRMAccountPage.Mobile')}
          placeholder={`${t('CRMAccountPage.Mobile')}`}
          verticalLabel
          onBlur={async e => {
            if (isViewMode) return;
            if (!e.target.value) return;
            // 校验手机号是否唯一
            await checkPhoneUnique({
              phonenumber: e.target.value,
              mzone: form.getValues('mzone')?.split('-')?.[0].replace('+', '') || '',
              userId: isEditMode ? userId : undefined,
            });
          }}
        />

        <FormInput
          name="email"
          label={t('rules.email')}
          placeholder={t('rules.limitLength', { field: 50 })}
          maxLength={50}
          disabled={isViewMode}
          onBlur={async e => {
            if (isViewMode) return;
            if (!e.target.value) return;
            // 校验邮箱是否唯一
            await checkEmailUnique({
              email: e.target.value,
              name: '',
              userId: isEditMode ? userId : undefined,
            });
          }}
        />

        <FormSelect
          name="roleId"
          label={t('table.accountRole')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={roleList}
          disabled={isViewMode}
        />

        <FormSwitch name="status" label={t('table.status')} disabled={isViewMode} />

        {mode === 'add' && (
          <FormInput
            name="password"
            label={t('rules.pwd')}
            placeholder={t('rules.pwdPlaceholder')}
            disabled={isViewMode}
          />
        )}

        <FormInput
          name="chatId"
          label={t('adminAccounts.chatId')}
          placeholder={t('rules.limitLength', { field: 32 })}
          maxLength={32}
          disabled={isViewMode}
        />
      </RrhForm>
    </RrhDialog>
  );
};
