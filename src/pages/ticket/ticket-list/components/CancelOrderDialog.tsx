

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { useClearAssignee } from '@/api/hooks/ticket/ticket';
import { RrhForm } from '@/components/form/RrhForm';

type FormValues = {
  broker: string;
};

export const CancelOrderDialog = ({
  onSuccess,
  ids,
  open,
  setOpen,
}: {
  onSuccess?: () => void;
  ids: string[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      broker: '',
    },
  });
  const { mutateAsync: clear } = useClearAssignee();

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const param = {
        ids: ids.join(','),
      };
      const res = await clear(param);
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

  return (
    <RrhDialog
      title={t('ticketList.cancelAssign')}
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
            <div className="text-muted-foreground text-sm">{t('ticketList.clearAssignee')}</div>
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
