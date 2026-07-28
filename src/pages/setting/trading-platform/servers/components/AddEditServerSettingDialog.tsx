import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useForm } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { toast } from 'sonner';
import { RrhButton } from '@/components/common/RrhButton';
import { Plus } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { CrmMtServiceListItem } from '@/api/hooks/setting/types';
import { FormSelect } from '@/components/form/FormSelect';
import { serverMap } from '@/lib/constant';
import { typeOptions } from '@/lib/const';
import { useAddServerSetting, useEditServerSetting } from '@/api/hooks/setting/setting';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLoginConfig } from '@/api/hooks/users/users';
import Utf8 from 'crypto-js/enc-utf8';
import { AES } from 'crypto-js';
import Pkcs7 from 'crypto-js/pad-pkcs7';
import ECB from 'crypto-js/mode-ecb';
import Hex from 'crypto-js/enc-hex';
import { FormPwdInput } from '@/components/form/FormPwdInput';
import {
  applyInputNormalizer,
  normalizePositiveIntegerInput,
} from '@/pages/marketing/shared/formValueUtils';

type FormValues = {
  serviceType: string;
  serviceProperty: string;
  aliasName: string;
  serviceHost: string;
  managerAccount: string;
  managerSecret: string;
  accountStart: string;
  accountEnd: string;
  sort: string;
};

export const AddEditServerSettingDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  mode,
  item,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  mode: 'add' | 'edit';
  item?: CrmMtServiceListItem;
}) => {
  const { t } = useTranslation();
  const { data: loginConfig } = useLoginConfig();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [secretKey, setSecretKey] = useState('');

  const serviceType = useMemo(() => {
    const arr = Object.entries(serverMap).map(([value, label]) => ({
      value,
      label,
    }));
    return arr;
  }, []);
  const { mutateAsync: add, isPending } = useAddServerSetting();
  const { mutateAsync: edit, isPending: isEditPending } = useEditServerSetting();

  const encryptPassword = useCallback((password: string, secretKey: string): string => {
    const key = Utf8.parse(secretKey);
    const source = Utf8.parse(password.trim());
    const encrypted = AES.encrypt(source, key, {
      mode: ECB,
      padding: Pkcs7,
    });
    return Hex.stringify(encrypted.ciphertext);
  }, []);

  const schema = useMemo(
    () =>
      z.object({
        serviceType: z
          .string()
          .min(1, t('rules.required', { field: t('table.transactionPlatform') })),
        serviceProperty: z.string().min(1, t('rules.required', { field: t('common.type') })),
        aliasName: z.string().min(1, t('rules.required', { field: t('table.serverName') })),
        serviceHost: z.string().min(1, t('rules.required', { field: t('table.serviceHost') })),
        managerAccount: z
          .string()
          .min(1, t('rules.required', { field: t('serversSettingPage.managerAccount') })),
        managerSecret: z
          .string()
          .min(1, t('rules.required', { field: t('serversSettingPage.managerSecret') })),
        accountStart: z
          .string()
          .min(1, t('rules.required', { field: t('serversSettingPage.accountStart') })),
        accountEnd: z
          .string()
          .min(1, t('rules.required', { field: t('serversSettingPage.accountEnd') })),
        sort: z.string().min(1, t('rules.required', { field: t('table.sort') })),
      }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceType: '',
      serviceProperty: '',
      aliasName: '',
      serviceHost: '',
      managerAccount: '',
      managerSecret: '',
      accountStart: '',
      accountEnd: '',
      sort: '',
    },
  });

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && item) {
      form.reset({
        serviceType: String(item.serviceType ?? ''),
        serviceProperty: String(item.serviceProperty ?? ''),
        aliasName: item.aliasName || '',
        serviceHost: item.serviceHost || '',
        managerAccount: item.managerAccount || '',
        managerSecret: '',
        accountStart: String(item.accountStart ?? ''),
        accountEnd: String(item.accountEnd ?? ''),
        sort: String(item.sort ?? ''),
      });
      return;
    }

    form.reset({
      serviceType: '',
      serviceProperty: '',
      aliasName: '',
      serviceHost: '',
      managerAccount: '',
      managerSecret: '',
      accountStart: '',
      accountEnd: '',
      sort: '',
    });
  }, [open, mode, item, form]);

  useEffect(() => {
    if (loginConfig?.code === 0) {
      setSecretKey(loginConfig.data || '');
    }
  }, [loginConfig]);

  const onCancel = () => {
    onClose(false);
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const encryptedManagerSecret = encryptPassword(data.managerSecret, secretKey);
      const params = {
        serviceType: data.serviceType,
        serviceProperty: data.serviceProperty,
        aliasName: data.aliasName,
        serviceHost: data.serviceHost,
        managerAccount: data.managerAccount,
        managerSecret: encryptedManagerSecret,
        accountStart: Number(data.accountStart),
        accountEnd: Number(data.accountEnd),
        reportingHost: '',
        reportingDbName: '',
        reportingAccount: '',
        reportingSecret: '',
        generateType: 1,
        sort: Number(data.sort),
      };
      const res =
        mode === 'add'
          ? await add(params)
          : await edit({
              ...params,
              id: item?.id || '',
            });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onClose(false);
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  return (
    <RrhDialog
      title={
        mode === 'add'
          ? t('common.addField', {
              field: t('serversSettingPage.title'),
            })
          : t('common.modify', {
              field: t('serversSettingPage.title'),
            })
      }
      trigger={
        mode === 'add' ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      isConfirmDisabled={isPending || isEditPending}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={form.handleSubmit(onSubmit)}
      variant="large"
      type="submit"
      formLoading={isPending || isEditPending}
    >
      <RrhForm
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
      >
        <FormSelect
          name="serviceType"
          label={t('table.transactionPlatform')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={serviceType}
          disabled={mode === 'edit'}
        />
        <FormSelect
          name="serviceProperty"
          label={t('common.type')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={typeOptions.map(i => ({
            value: i.value,
            label: t(i.label),
          }))}
          disabled={mode === 'edit'}
        />
        <FormInput
          name="aliasName"
          label={t('table.serverName')}
          placeholder={t('common.pleaseInput', { field: t('table.serverName') })}
        />

        <FormInput
          name="serviceHost"
          label={t('table.serviceHost')}
          placeholder={t('common.pleaseInput', { field: t('table.serviceHost') })}
        />

        <FormInput
          name="managerAccount"
          label={t('serversSettingPage.managerAccount')}
          placeholder={t('common.pleaseInput', { field: t('serversSettingPage.managerAccount') })}
        />

        <FormPwdInput
          name="managerSecret"
          label={t('serversSettingPage.managerSecret')}
          placeholder={t('common.pleaseInput', { field: t('serversSettingPage.managerSecret') })}
        />

        <FormInput
          name="accountStart"
          label={t('serversSettingPage.accountStart')}
          placeholder={t('common.pleaseInput', { field: t('serversSettingPage.accountStart') })}
          onInput={event =>
            applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
          }
        />

        <FormInput
          name="accountEnd"
          label={t('serversSettingPage.accountEnd')}
          placeholder={t('common.pleaseInput', { field: t('serversSettingPage.accountEnd') })}
          onInput={event =>
            applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
          }
        />

        <FormInput
          name="sort"
          label={t('table.sort')}
          placeholder={t('common.pleaseInput', { field: t('table.sort') })}
          onInput={event =>
            applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
          }
        />
      </RrhForm>
    </RrhDialog>
  );
};
