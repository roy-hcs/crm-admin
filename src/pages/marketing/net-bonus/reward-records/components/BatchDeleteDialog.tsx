import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { toast } from 'sonner';
import { RrhForm } from '@/components/form/RrhForm';
import { useRemoveRecord } from '@/api/hooks/marketing';

type FormValues = {
  ids: string;
};

export const BatchDeleteDialog = ({
  onSuccess,
  open,
  setOpen,
  ids,
}: {
  onSuccess?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  ids: string[];
}) => {
  const { t } = useTranslation();
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      ids: '',
    },
  });
  const { mutateAsync: removeRecord, isPaused } = useRemoveRecord();

  const onSubmit = async () => {
    try {
      // setIsSubmitting(true);
      const params = {
        ids: ids.join(','),
      };

      const res = await removeRecord(params);

      if (res.code === 0) {
        toast.success(t('common.success'));
        onCancel();
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const onCancel = () => {
    form.reset({
      ids: '',
    });
    setOpen(false);
  };

  return (
    <RrhDialog
      title={t('table.batchDelete')}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isPaused}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
        <div className="text-foreground text-sm leading-5 font-medium">
          {t('netBonusRewardRecords.selectedRecords', {
            count: ids.length,
          })}
        </div>
        <div>{t('netBonusRewardRecords.deleteConfirm')}</div>

        <div className="col-span-full -mx-6 flex justify-end px-6 py-6 sm:pb-0">
          <div className="flex justify-end gap-4">
            <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={onCancel}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton type="submit" className="px-4 py-2" disabled={isPaused}>
              {t('common.Confirm')}
            </RrhButton>
          </div>
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
