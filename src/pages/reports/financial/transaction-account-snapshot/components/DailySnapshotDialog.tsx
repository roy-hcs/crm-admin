import { useSaveLogGeneratedTime } from '@/api/hooks/report/report';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhForm } from '@/components/form/RrhForm';

import { CircleAlert, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type FormValues = {
  time: string;
};

export const DailySnapshotDialog = ({
  onSuccess,
  logGeneratedTime,
}: {
  onSuccess?: () => void;
  logGeneratedTime: string | number;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { mutateAsync: save, isPending } = useSaveLogGeneratedTime();

  const form = useForm<FormValues>({
    defaultValues: {
      time: `${logGeneratedTime || ''}`,
    },
  });

  const onClose = () => {
    setOpen(false);
  };

  const onCancel = () => {
    onClose();
  };

  const onConfirm = async () => {
    try {
      const values = form.getValues();

      const res = await save({
        time: values.time,
      });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onSuccess?.();
        onClose();
        return;
      }

      toast.error(res.msg);
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  // 返回一个时间选项数组，每个选项表示一天中的一个时间点，间隔为30分钟
  function generateTimeOptions() {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const label = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        times.push({ label, value: label });
      }
    }
    return times;
  }

  useEffect(() => {
    if (!open) return;
    form.reset({
      time: `${logGeneratedTime || ''}`,
    });
  }, [open, logGeneratedTime, form]);

  return (
    <RrhDialog
      trigger={
        <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
          {t('transactionAccountSnapshotPage.everyDaySnapshot')}
        </RrhButton>
      }
      title={t('transactionAccountSnapshotPage.everyDaySnapshot')}
      isConfirmDisabled={isPending}
      open={open}
      onOpenChange={setOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      cancelShow={true}
      formLoading={isPending}
    >
      <RrhForm form={form} className="grid gap-6">
        <div className="bg-primary/5 flex items-center gap-1 rounded-md p-2">
          <CircleAlert className="text-primary size-4" />
          <span className="text-primary text-sm leading-5 font-medium">
            {t('transactionAccountSnapshotPage.snapshotTips')}
          </span>
        </div>
        <FormSelect
          name="time"
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={generateTimeOptions()}
        />
      </RrhForm>
    </RrhDialog>
  );
};
