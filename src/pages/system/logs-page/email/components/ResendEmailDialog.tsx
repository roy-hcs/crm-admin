import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useGetResendEmailMsgDetail, useResendEmail } from '@/api/hooks/system/system';
import { useForm } from 'react-hook-form';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhForm } from '@/components/form/RrhForm';
import { SelectOption } from '@/api/types';
import { toast } from 'sonner';

type FormValues = {
  sendEmail: string;
};

export const ResendEmailDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  userMsgId,
  id,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  userMsgId: string;
  id: string;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [emailOptions, setEmailOptions] = useState<SelectOption[]>([]);
  const { mutateAsync: getDetail, isPending } = useGetResendEmailMsgDetail();
  const { mutateAsync: send, isPending: sendPending } = useResendEmail();

  const form = useForm<FormValues>({
    defaultValues: {
      sendEmail: '',
    },
  });

  useEffect(() => {
    if (!open || !userMsgId) return;

    (async () => {
      const res = await getDetail({
        id,
        userMsgId,
      });
      if (res.code === 0 && res?.data?.allEmailConfig.length) {
        setEmailOptions(
          res.data.allEmailConfig.map(i => ({
            label: i.email,
            value: i.id,
          })),
        );
        form.setValue('sendEmail', res.data.allEmailConfig[0].id);
      } else {
        setEmailOptions([]);
      }
    })();
  }, [open, getDetail, userMsgId, form, id]);

  const onCancel = () => {
    setOpen(false);
  };

  const onClose = (open: boolean) => {
    setOpen(open);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const params = {
        id: id,
        userMsgId: userMsgId,
        sendEmail: data.sendEmail,
      };
      const res = await send(params);
      if (res.code === 0) {
        toast.success(t('common.success'));
        setOpen(false);
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  return (
    <RrhDialog
      title={t('emailLogsPage.emailPreview')}
      isConfirmDisabled={isPending || sendPending}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={form.handleSubmit(onSubmit)}
      variant="small"
      type="submit"
      formLoading={isPending || sendPending}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
        <FormSelect
          name="sendEmail"
          label={t('table.sendEmailAddress')}
          placeholder={t('common.pleaseSelect')}
          options={emailOptions}
          showRowValue={false}
        />
      </RrhForm>
    </RrhDialog>
  );
};
