import { Form } from '@/components/ui/form';
import { FormProvider } from '@/contexts/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import {
  useAddAccountGroup,
  useCheckGroupNameSingle,
  useEditAccountGroup,
} from '@/api/hooks/account';
import { toast } from 'sonner';
import { FormInput } from '@/components/form/FormInput';

type FormValues = {
  name: string;
  sort: string;
};

type InitialValues = {
  id: string;
  name: string;
  sort: string;
};
/**
 * 新增/编辑 账户组组件
 */
export const AccountGroupDialog = ({
  mode,
  onSuccess,
  initialValues,
  open: openProp,
  onOpenChange,
}: {
  mode: 'add' | 'edit';
  onSuccess?: () => void;
  initialValues?: InitialValues;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;

  const { mutateAsync: checkGroupNameSingle } = useCheckGroupNameSingle();
  const { mutateAsync: addAccountGroup } = useAddAccountGroup();
  const { mutateAsync: editAccountGroup } = useEditAccountGroup();

  const initialName = initialValues?.name || '';
  const initialSort = initialValues?.sort || '';
  const id = initialValues?.id;

  const schema = useMemo(() => {
    return z.object({
      name: z.string().min(1, t('rules.required', { field: t('accountGroups.name') })),
      sort: z.string().min(1, t('rules.required', { field: t('table.sort') })),
    });
  }, [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialName,
      sort: initialSort,
    },
  });

  // 异步校验组名唯一性（在 onBlur 时触发防止请求过多）
  const validateName = async (value: string) => {
    try {
      if (!value || !String(value).trim()) {
        form.clearErrors('name');
        return true;
      }
      const params: { name: string; id?: string } = { name: value };
      if (mode === 'edit' && id) params.id = String(id);
      const res = await checkGroupNameSingle(params);
      if (res?.code === 0 && res?.data) {
        form.setError('name', { type: 'manual', message: t('accountGroups.nameAlreadyExists') });
        return false;
      }
      form.clearErrors('name');
      return true;
    } catch (error) {
      console.error('Error checking group name uniqueness:', error);
      return false;
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // 提交前再次校验，防止用户直接提交表单而不触发 onBlur
      const ok = await validateName(data.name);
      if (!ok) return;
      setIsSubmitting(true);
      const param = {
        name: data.name,
        sort: data.sort,
        id: '',
      };
      if (mode === 'edit' && id) {
        Object.assign(param, { id: String(id) });
      }
      const res = mode === 'add' ? await addAccountGroup(param) : await editAccountGroup(param);
      if (res?.code === 0) {
        successCallback();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const successCallback = () => {
    form.reset();
    toast.success(t('common.success'));
    setOpen(false);
    onSuccess?.();
  };

  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    form.reset();
  };

  const onConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <RrhDialog
      trigger={
        mode === 'add' ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('accountGroups.addAccountGroup')}
          </RrhButton>
        ) : (
          <button></button>
        )
      }
      title={
        mode === 'add' ? t('accountGroups.addAccountGroup') : t('accountGroups.editAccountGroup')
      }
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="small"
      type="submit"
      formLoading={isSubmitting}
    >
      <FormProvider form={form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
            <FormInput
              name="name"
              label={t('accountGroups.name')}
              verticalLabel
              placeholder={t('rules.limitLength', { field: 32 })}
              onBlur={e => validateName(String((e.target as HTMLInputElement).value))}
              maxLength={32}
            />
            <FormInput
              name="sort"
              label={t('table.sort')}
              verticalLabel
              placeholder={t('common.sortPlaceholder')}
            />
          </form>
        </Form>
      </FormProvider>
    </RrhDialog>
  );
};
