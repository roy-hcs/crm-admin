import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useForm } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { toast } from 'sonner';
import { FormInput } from '@/components/form/FormInput';
import {
  useAddServerTypeAssociation,
  useCrmMtServerTypeAssociationAddInfo,
} from '@/api/hooks/setting/setting';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  applyInputNormalizer,
  normalizePositiveDecimalInput,
} from '@/pages/marketing/shared/formValueUtils';
import { CrmMtServerTypeAssociationItem } from '@/api/hooks/setting/types';
import { FormSwitch } from '@/components/form/FormSwitch';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { Plus } from 'lucide-react';
import { FormSwitchGroup } from '@/components/form/FormSwitchGroup';
import { FormCrmRoleMultiSelect } from '@/components/form/FormCrmRoleMultiSelect';
import { FormCrmUserMultiSelect } from '@/components/form/FormCrmUserMultiSelect';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';

type FormValues = {
  name: string;
  typeId: string;
  defaultMtGroup: string;
  lever: string[];
  openCreditBalance: string;
  useableRange: string;
  roleIds: string[];
  userIds: string[];
  accounts: string[];
  status: string;
};

export const AddEditAccountTypeDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  item,
  name,
  serverId,
  onSuccess,
  mode,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  item?: CrmMtServerTypeAssociationItem;
  name: string;
  serverId?: string;
  onSuccess?: () => void;
  mode: 'add' | 'edit';
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;

  const currentServerId = item?.serverId || serverId || '';

  const { data, isLoading } = useCrmMtServerTypeAssociationAddInfo(currentServerId, {
    enabled: !!currentServerId,
  });

  const serverTypes = useMemo(() => {
    if (!data?.data?.serverTypes) return [];
    return data.data.serverTypes.map(type => ({
      label: type.accountType,
      value: type.id,
    }));
  }, [data]);

  const groupOptions = useMemo(() => {
    if (!data?.data?.serverGroup) return [];
    return data.data.serverGroup.map(group => ({
      label: group,
      value: group,
    }));
  }, [data]);

  const leverOptions = useMemo(() => {
    if (!data?.data?.allLever) return [];
    return data.data.allLever.map(lever => ({
      label: lever,
      value: lever,
    }));
  }, [data]);

  const { mutateAsync: save, isPending: isSavePending } = useAddServerTypeAssociation();

  const parseMultiValue = (value?: string | string[] | null): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .map(String)
        .map(v => v.trim())
        .filter(Boolean);
    }
    return String(value)
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);
  };

  const schema = useMemo(
    () =>
      z
        .object({
          name: z.string(),
          typeId: z.string().min(1, t('rules.required', { field: t('common.accountType') })),
          defaultMtGroup: z
            .string()
            .min(1, t('rules.required', { field: t('serversSettingPage.defaultMtGroup') })),
          lever: z
            .array(z.string())
            .min(1, t('rules.required', { field: t('table.leverage') || 'Leverage' })),
          openCreditBalance: z.string(),
          useableRange: z
            .string()
            .min(1, t('rules.required', { field: t('rewardConfigPage.title') })),
          roleIds: z.array(z.string()),
          userIds: z.array(z.string()),
          accounts: z.array(z.string()),
          status: z.string().min(1, t('rules.required', { field: t('table.status') })),
        })
        .superRefine((values, ctx) => {
          if (values.useableRange === '2' && values.roleIds.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['roleIds'],
              message: t('rules.required', {
                field: t('rewardConfigPage.accountLimitTypeOptions.1'),
              }),
            });
          }

          if (values.useableRange === '3' && values.userIds.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['userIds'],
              message: t('rules.required', {
                field: t('rewardConfigPage.accountLimitTypeOptions.3'),
              }),
            });
          }

          if (values.useableRange === '4' && values.accounts.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['accounts'],
              message: t('rules.required', {
                field: t('rewardConfigPage.accountLimitTypeOptions.4'),
              }),
            });
          }
        }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      typeId: '',
      defaultMtGroup: '',
      lever: [],
      openCreditBalance: '',
      useableRange: '1',
      roleIds: [],
      userIds: [],
      accounts: [],
      status: '1',
    },
  });

  const useableRangValue = form.watch('useableRange');

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && item) {
      form.reset({
        name: name || '',
        typeId: item.typeId || '',
        defaultMtGroup: item.defaultMtGroup || '',
        lever: parseMultiValue(item.lever),
        openCreditBalance: item.openCreditBalance ? String(item.openCreditBalance) : '',
        useableRange: String(item.useableRange || '1'),
        roleIds: parseMultiValue(item.roleIds),
        userIds: parseMultiValue(item.userIds),
        accounts: parseMultiValue(item.accounts),
        status: String(item.status ?? 1),
      });
      return;
    }

    form.reset({
      name: name || '',
      typeId: '',
      defaultMtGroup: '',
      lever: [],
      openCreditBalance: '',
      useableRange: '1',
      roleIds: [],
      userIds: [],
      accounts: [],
      status: '1',
    });
  }, [open, mode, item, form, name]);

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
    if (!currentServerId) {
      toast.error(t('common.AnErrorOccurred'));
      return;
    }

    try {
      const res = await save({
        ...(mode === 'edit' && item?.id ? { id: item.id } : {}),
        serverId: currentServerId,
        typeId: data.typeId,
        defaultMtGroup: data.defaultMtGroup,
        lever: data.lever,
        openCreditBalance: data.openCreditBalance,
        useableRange: data.useableRange,
        roleIds: data.useableRange === '2' ? data.roleIds : [],
        userIds: data.useableRange === '3' ? data.userIds : [],
        accounts: data.useableRange === '4' ? data.accounts : [],
        status: Number(data.status),
      });

      if (res.code === 0) {
        toast.success(t('common.success'));
        onClose(false);
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
      title={
        mode === 'add'
          ? t('common.addField', { field: t('common.accountType') })
          : t('common.modify', { field: t('common.accountType') })
      }
      trigger={
        mode === 'add' ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      isConfirmDisabled={isSavePending || isLoading}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={form.handleSubmit(onSubmit)}
      variant="large"
      type="submit"
      formLoading={isSavePending || isLoading}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormInput name="name" label={t('table.server')} placeholder="" disabled />

        <FormSelect
          name="typeId"
          label={t('common.accountType')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={serverTypes}
        />

        <FormSelect
          name="defaultMtGroup"
          label={t('serversSettingPage.defaultMtGroup')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={groupOptions}
        />

        <FormMultiSelect
          name="lever"
          label={t('common.level')}
          placeholder={t('common.pleaseSelect')}
          options={leverOptions}
        />

        <FormInput
          name="openCreditBalance"
          label={t('table.openCreditBalance')}
          placeholder={t('serversSettingPage.openCreditBalancePlaceholder')}
          onInput={event =>
            applyInputNormalizer(event.currentTarget, value =>
              normalizePositiveDecimalInput(value, 2),
            )
          }
        />

        <FormSwitchGroup
          name="useableRange"
          label={t('rewardConfigPage.accountLimitType')}
          switchItems={[
            {
              value: '1',
              label: t('rewardConfigPage.accountLimitTypeOptions.0'),
            },
            {
              value: '2',
              label: t('rewardConfigPage.accountLimitTypeOptions.1'),
            },
            {
              value: '3',
              label: t('rewardConfigPage.accountLimitTypeOptions.3'),
            },
            {
              value: '4',
              label: t('rewardConfigPage.accountLimitTypeOptions.4'),
            },
          ]}
        />

        {useableRangValue === '2' && (
          <FormCrmRoleMultiSelect<FormValues>
            verticalLabel
            name="roleIds"
            label={t('rewardConfigPage.accountLimitTypeOptions.1')}
          />
        )}
        {useableRangValue === '3' && (
          <FormCrmUserMultiSelect<FormValues>
            verticalLabel
            name="userIds"
            label={t('rewardConfigPage.accountLimitTypeOptions.3')}
          />
        )}
        {useableRangValue === '4' && (
          <FormCrmUserMultiSelect<FormValues>
            verticalLabel
            name="accounts"
            label={t('rewardConfigPage.accountLimitTypeOptions.4')}
          />
        )}

        <FormSwitch name="status" label={t('table.status')} />
      </RrhForm>
    </RrhDialog>
  );
};
