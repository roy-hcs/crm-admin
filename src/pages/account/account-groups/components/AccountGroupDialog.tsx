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
    return z
      .object({
        name: z.string().min(1, t('rules.required', { field: t('accountGroups.name') })),
        sort: z.string().min(1, t('rules.required', { field: t('table.sort') })),
      })
      .superRefine(async (data, ctx) => {
        if (!data.name) return;
        // 如果是编辑且名称未改变，则跳过唯一性检查
        if (mode === 'edit' && data.name === initialName) return;
        try {
          const res = await checkGroupNameSingle({ name: data.name });
          if (res?.code === 0 && res?.data) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('accountGroups.nameAlreadyExists'),
              path: ['name'],
            });
          }
        } catch (error) {
          console.error('Error checking group name uniqueness:', error);
        }
      });
  }, [t, mode, initialName, checkGroupNameSingle]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialName,
      sort: initialSort,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const param = {
        name: data.name,
        sort: data.sort,
        id: '',
      };
      if (mode === 'edit' && id) {
        const res = await editAccountGroup({
          ...param,
          id: id,
        });
        if (res.code === 0) {
          successCallback();
        } else {
          toast.error(res.msg);
        }
      } else {
        const res = await addAccountGroup(param);
        if (res.code === 0) {
          successCallback();
        } else {
          toast.error(res.msg);
        }
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
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
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
            />
            <FormInput
              name="sort"
              label={t('table.sort')}
              verticalLabel
              placeholder={t('accountGroups.sortPlaceholder')}
            />

            <div className="col-span-full -mx-6 flex justify-end gap-4 px-6 py-6 sm:pb-0">
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
    </RrhDialog>
  );
};
