import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { toast } from 'sonner';
import { MenuListItem } from '@/api/hooks/system';
import { useAddManagementMenu, useEditManagementMenu } from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhForm } from '@/components/form/RrhForm';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormSwitchGroup } from '@/components/form/FormSwitchGroup';

const schemaBuilder = (t: TFunction<'translation', undefined>) =>
  z.object({
    parentId: z.string().min(1, t('rules.required', { field: t('menuManagement.parentMenu') })),
    menuType: z.string().min(1, t('rules.required', { field: t('menuManagement.menuType') })),
    menuName: z.string().min(1, t('rules.required', { field: t('menuManagement.menuName') })),
    url: z.string(),
    target: z.string().min(1, t('rules.required', { field: t('menuManagement.target') })),
    perms: z.string(),
    orderNum: z
      .string()
      .min(1, t('rules.required', { field: t('menuManagement.orderNum') }))
      .regex(/^\d+$/, t('rules.limitLength', { field: t('menuManagement.orderNum') })),
    icon: z.string(),
    visible: z.string().min(1, t('rules.required', { field: t('table.visible') })),
  });

type FormValues = z.infer<ReturnType<typeof schemaBuilder>>;

function getDefaultValues(initialParentId?: string): FormValues {
  return {
    parentId: initialParentId ?? '0',
    menuType: '',
    menuName: '',
    url: '',
    target: 'menuItem',
    perms: '',
    orderNum: '',
    icon: '',
    visible: '0',
  };
}

export const AddEditManagementMenuDialog = ({
  mode,
  onSuccess,
  menuItem,
  parentOptions,
  initialParentId,
  open: openProp,
  setOpen: setOpenProp,
}: {
  mode: 'add' | 'edit';
  onSuccess?: () => void;
  menuItem?: MenuListItem;
  parentOptions: Array<{ label: string; value: string }>;
  initialParentId?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = setOpenProp ?? setOpenLocal;
  const isControlled = openProp !== undefined || setOpenProp !== undefined;
  const isEditMode = mode === 'edit';

  const schema = useMemo(() => schemaBuilder(t), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(initialParentId),
  });

  const { mutateAsync: addMenu, isPending: isAddPending } = useAddManagementMenu();
  const { mutateAsync: editMenu, isPending: isEditPending } = useEditManagementMenu();
  const isSubmitting = isAddPending || isEditPending;

  useEffect(() => {
    if (!open) return;

    if (isEditMode && menuItem) {
      form.reset({
        parentId: menuItem.parentId || '0',
        menuType: menuItem.menuType || '',
        menuName: menuItem.menuName || '',
        url: menuItem.url || '',
        target: menuItem.target || 'menuItem',
        perms: menuItem.perms || '',
        orderNum: menuItem.orderNum || '',
        icon: '',
        visible: menuItem.visible || '0',
      });
      return;
    }

    form.reset({
      ...getDefaultValues(initialParentId),
    });
  }, [open, isEditMode, menuItem, initialParentId, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const res = isEditMode
        ? await editMenu({
            ...values,
            menuId: menuItem?.menuId || '',
          })
        : await addMenu(values);

      if (res.code === 0) {
        toast.success(t('common.success'));
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  const menuTypeOptions = useMemo(
    () => [
      { label: t('table.category'), value: 'M' },
      { label: t('table.menu'), value: 'C' },
      { label: t('table.button'), value: 'F' },
    ],
    [t],
  );

  const visibleOptions = useMemo(
    () => [
      { label: t('table.show'), value: '0' },
      { label: t('table.hide'), value: '1' },
    ],
    [t],
  );

  return (
    <RrhDialog
      trigger={
        mode === 'add' && !isControlled ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      title={
        mode === 'add'
          ? t('common.addField', { field: t('menuManagement.title') })
          : t('common.Edit')
      }
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      onConfirm={() => form.handleSubmit(onSubmit)()}
      variant="large"
      type="submit"
      formLoading={isSubmitting}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 py-3">
        <FormSelect
          name="parentId"
          label={t('menuManagement.parentMenu')}
          options={parentOptions}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
        />
        <FormSwitchGroup
          name="menuType"
          label={t('menuManagement.menuType')}
          switchItems={menuTypeOptions}
        />
        <FormInput
          name="menuName"
          label={t('menuManagement.menuName')}
          placeholder={t('common.pleaseInput', { field: t('menuManagement.menuName') })}
          maxLength={64}
        />
        <FormInput
          name="url"
          label={t('table.requestUrl')}
          placeholder={t('common.pleaseInput', { field: t('table.requestUrl') })}
        />

        <FormSelect
          name="target"
          label={t('menuManagement.target')}
          options={[
            { label: t('menuManagement.targetOptions.1'), value: 'menuItem' },
            { label: t('menuManagement.targetOptions.2'), value: 'menuBlank' },
          ]}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
        />

        <FormInput
          name="perms"
          label={t('table.scope')}
          placeholder={t('common.pleaseInput', { field: t('table.scope') })}
          maxLength={255}
          labeTipsDom={
            <div className="text-muted-foreground text-xs leading-4">
              {t('menuManagement.permission')}
            </div>
          }
        />

        <FormInput
          name="orderNum"
          label={t('menuManagement.orderNum')}
          placeholder={t('common.pleaseInput', { field: t('menuManagement.orderNum') })}
          maxLength={10}
        />

        <FormSelect
          name="visible"
          label={t('table.visible')}
          options={visibleOptions}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
        />
      </RrhForm>
    </RrhDialog>
  );
};
