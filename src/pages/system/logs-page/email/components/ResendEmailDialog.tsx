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
  const {
    data: resendEmailMsgDetail,
    isLoading: getDetailLoading,
    isError,
  } = useGetResendEmailMsgDetail(
    {
      id: id,
      userMsgId: userMsgId,
    },
    {
      disabled: !open,
    },
  );
  const { mutateAsync: send, isPending: sendPending } = useResendEmail();

  const form = useForm<FormValues>({
    defaultValues: {
      sendEmail: '',
    },
  });

  useEffect(() => {
    if (!open || !userMsgId) return;

    if (resendEmailMsgDetail?.data?.allEmailConfig.length) {
      setEmailOptions(
        resendEmailMsgDetail.data.allEmailConfig.map(i => ({
          label: i.email,
          value: i.id,
        })),
      );
      form.setValue('sendEmail', resendEmailMsgDetail.data.allEmailConfig[0].id);
    } else {
      setEmailOptions([]);
    }
  }, [open, resendEmailMsgDetail, userMsgId, form, id]);

  useEffect(() => {
    if (isError) toast.error(t('common.AnErrorOccurred'));
  }, [isError, t]);

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
      title={t('table.reSend')}
      isConfirmDisabled={getDetailLoading || sendPending}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={form.handleSubmit(onSubmit)}
      variant="small"
      type="submit"
      formLoading={getDetailLoading || sendPending}
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
