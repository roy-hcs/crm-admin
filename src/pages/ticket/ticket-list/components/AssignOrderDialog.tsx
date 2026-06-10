import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { useAssignOrder, useGetAllocatedUsers } from '@/api/hooks/ticket/ticket';
import { FormSelect } from '@/components/form/FormSelect';
import { SelectOption } from '@/api/types';
import { useUserStore } from '@/store/userStore';
import { AllocatedUsersItem } from '@/api/hooks/ticket/types';
import { RrhForm } from '@/components/form/RrhForm';

type FormValues = {
  roleId: string;
  userId: string;
};

export const AssignOrderDialog = ({
  onSuccess,
  ids,
  open,
  setOpen,
  roleOptions,
}: {
  onSuccess?: () => void;
  ids: string[];
  open: boolean;
  setOpen: (open: boolean) => void;
  roleOptions: SelectOption[];
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [allocatedList, setAllocatedList] = useState<SelectOption[]>([]);
  const form = useForm<FormValues>({
    defaultValues: {
      roleId: '',
      userId: '',
    },
  });
  const { mutateAsync: assign } = useAssignOrder();
  const { mutateAsync: getAllocatedUsers } = useGetAllocatedUsers();

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const param = {
        ids: ids.join(','),
        userId: data.userId,
      };
      const res = await assign(param);
      if (res.code === 0) {
        onCancel();
        toast.success(t('common.success'));
        onSuccess?.();
      } else {
        toast.error(res.msg);
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

  const roleId = form.watch('roleId');

  useEffect(() => {
    if (!open) return;
    // 获取下级用户
    let mounted = true;
    const fetchAllocatedUsers = async (roleId?: string) => {
      if (!roleId) {
        if (!mounted) return;
        if (user?.userId) {
          setAllocatedList([
            {
              label: user.userLastName + user.userName,
              value: user.userId,
            },
          ]);
          form.setValue('userId', user.userId || '');
        } else {
          setAllocatedList([]);
          form.setValue('userId', '');
        }
        return;
      }
      try {
        setLoading(true);
        form.setValue('userId', '');
        const res = await getAllocatedUsers({ roleId });
        if (!mounted) return;
        if (res?.code === 0 && res?.rows) {
          const options = res.rows.map((i: AllocatedUsersItem) => ({
            label: i.userLastName + i.userName,
            value: i.userId,
          }));
          setAllocatedList(options);
        } else {
          setAllocatedList([]);
        }
      } catch (error) {
        console.error(error);
        if (mounted) {
          setAllocatedList([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAllocatedUsers(roleId);
    return () => {
      mounted = false;
    };
  }, [open, getAllocatedUsers, form, roleId, user]);

  return (
    <RrhDialog
      title={t('ticketList.assignTicket')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isSubmitting}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
        <div className="text-foreground text-sm leading-5 font-medium">
          {t('ticketList.selectedTickets', { count: ids.length })}
        </div>
        <FormSelect
          name="roleId"
          label={t('ticketList.receiverId')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={roleOptions}
        />

        <FormSelect
          name="userId"
          label={''}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={allocatedList}
          loading={loading}
        />

        <div className="col-span-full -mx-6 flex justify-end px-6 py-6 sm:pb-0">
          <div className="flex justify-end gap-4">
            <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={onCancel}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton type="submit" className="px-4 py-2" disabled={isSubmitting}>
              {t('common.Confirm')}
            </RrhButton>
          </div>
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
