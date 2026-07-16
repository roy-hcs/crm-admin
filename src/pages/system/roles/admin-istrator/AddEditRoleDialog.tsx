import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import {
  useAddRole,
  useCheckRoleNameUnique,
  useEditRole,
  useRoleMenuTreeData,
} from '@/api/hooks/system/system';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';
import { FormInput } from '@/components/form/FormInput';
import { SelectOption } from '@/api/types';
import { RoleItem } from '@/api/hooks/system';
import { RolePermissionTree } from '../common/RolePermissionTree';
import { RrhSelect } from '@/components/common/RrhSelect';
import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';
import { FormCrmUserSingleSelect } from '@/components/form/FormCrmUserSingleSelect';

type FormValues = {
  roleName: string;
  roleDescribe: string;
  menuIds: string;
  userAccount: string;
};

const addUserSchema = (t: TFunction<'translation', undefined>) => {
  return {
    roleName: z.string().min(1, t('rules.required', { field: t('rolesManagement.roleName') })),
    roleDescribe: z
      .string()
      .min(1, t('rules.required', { field: t('rolesManagement.roleDescribe') })),
    menuIds: z.string(),
    userAccount: z.string(),
  };
};

export const AddEditRoleDialog = ({
  onSuccess,
  roleList,
  mode,
  open: openProp,
  setOpen: onOpenChange,
  roleItem,
}: {
  onSuccess?: () => void;
  roleList: SelectOption[];
  mode: 'add' | 'edit' | 'view';
  open?: boolean;
  setOpen?: (open: boolean) => void;
  roleItem?: RoleItem;
}) => {
  const { t } = useTranslation();
  const [id, setId] = useState('');
  const [type, setType] = useState('1');
  const [radioValue, setRadioValue] = useState('1');
  const { data: roleMenuTreeData } = useRoleMenuTreeData(
    mode === 'add' ? id : roleItem?.roleId || '',
  );
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';

  const defaultValues: FormValues = {
    roleName: '',
    roleDescribe: '',
    menuIds: '',
    userAccount: '',
  };

  const { mutateAsync: checkRoleNameUnique, data: checkRoleNameRes } = useCheckRoleNameUnique();
  const { mutateAsync: add, isPending: isAddPending } = useAddRole();
  const { mutateAsync: edit, isPending: isEditPending } = useEditRole();
  const isSubmitting = isAddPending || isEditPending;

  const schema = useMemo(() => z.object(addUserSchema(t)), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (!open || mode !== 'add') return;
    form.setValue('menuIds', '');
  }, [open, mode, form]);

  useEffect(() => {
    if (checkRoleNameRes === 1) {
      form.setError('roleName', {
        type: 'manual',
        message: t('rolesManagement.roleNameAlreadyUsed'),
      });
    } else if (checkRoleNameRes !== undefined && checkRoleNameRes !== 1) {
      form.clearErrors('roleName');
    }
  }, [checkRoleNameRes, form, t]);

  const onSubmit = async (data: FormValues) => {
    try {
      const param = {
        roleName: data.roleName,
        roleDescribe: data.roleDescribe,
        status: '1',
        menuIds: type === '1' ? data.menuIds : '',
        roleSource: '1',
        userScope: '1',
        userAccount: type === '2' ? data.userAccount : '',
      };
      const res = isEditMode
        ? await edit({ ...param, roleId: roleItem?.roleId || '' })
        : await add(param);
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
    if (!open || !roleItem?.roleId || (mode !== 'edit' && mode !== 'view')) return;
    form.reset({
      roleName: roleItem.roleName || '',
      roleDescribe: roleItem.roleDescribe || '',
      menuIds: '',
      userAccount: roleItem.userAccount || '',
    });
  }, [open, mode, form, t, roleItem]);

  return (
    <RrhDialog
      trigger={
        mode === 'add' ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      title={
        mode === 'add'
          ? t('common.addField', { field: t('table.role') })
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
      formLoading={isSubmitting}
      confirmShow={!isViewMode}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput
          name="roleName"
          className="py-3"
          label={t('rolesManagement.roleName')}
          placeholder={t('rules.limitLength', { field: 32 })}
          maxLength={32}
          disabled={isViewMode}
          onBlur={async e => {
            if (isViewMode) return;
            if (!e.target.value) return;
            // 校验角色名称是否唯一
            await checkRoleNameUnique({
              roleName: e.target.value,
              roleId: isEditMode ? roleItem?.roleId : undefined,
            });
          }}
        />

        <FormInput
          name="roleDescribe"
          className="py-3"
          label={t('rolesManagement.roleDescribe')}
          placeholder={t('rules.limitLength', { field: 32 })}
          maxLength={32}
          disabled={isViewMode}
        />

        {mode === 'add' && (
          <div className="grid gap-2 py-3">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">{t('rolesManagement.roleId')}</div>
              <div className="text-muted-foreground text-xs leading-4">
                {t('rolesManagement.roleIdDesc')}
              </div>
            </div>
            <RrhSelect
              className="w-full"
              options={roleList}
              value={id}
              onValueChange={setId}
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
            />
          </div>
        )}

        <RrhSwitchGroup
          className="py-3"
          value={type}
          onValueChange={value => {
            setType(value);
          }}
          labelClassName="font-medium"
          switchItems={[
            {
              value: '1',
              label: t('rolesManagement.userScopeOptions.1'),
              disabled: isViewMode,
            },
            {
              value: '2',
              label: t('rolesManagement.userScopeOptions.2'),
              disabled: isViewMode,
            },
          ]}
        />

        {type === '1' && (
          <div className="rounded-md border p-3 py-3">
            <RolePermissionTree
              data={roleMenuTreeData || []}
              disabled={isViewMode}
              open={open}
              onChange={ids => {
                form.setValue('menuIds', ids.join(','));
              }}
            />
          </div>
        )}

        {type === '2' && (
          <RrhRadioGroup
            className="py-3"
            value={radioValue}
            onValueChange={value => {
              setRadioValue(value);
            }}
            radioItems={[
              {
                value: '1',
                label: t('rolesManagement.radioOptions.1'),
              },
              {
                value: '2',
                label: t('rolesManagement.radioOptions.2'),
              },
            ]}
          />
        )}

        {radioValue === '2' && type === '2' && (
          <FormCrmUserSingleSelect
            className="py-3"
            verticalLabel
            name="userAccount"
            label={t('CRMAccountPage.NameOrAccountId')}
            placeholder={t('customerTracking.nameOrAccountId')}
          />
        )}
      </RrhForm>
    </RrhDialog>
  );
};
