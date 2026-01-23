import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useRemoveAccountGroup } from '@/api/hooks/account';
import { toast } from 'sonner';
import { CircleAlert } from 'lucide-react';

type InitialValues = {
  id: string;
  name: string;
};

export const DeleteGroupDialog = ({
  initialValues,
  onSuccess,
  open,
  setOpen,
}: {
  initialValues?: InitialValues;
  onSuccess?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const name = initialValues?.name;
  const id = initialValues?.id;

  const { mutateAsync: removeAccountGroup } = useRemoveAccountGroup();

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const param = {
        ids: id || '',
      };
      const res = await removeAccountGroup(param);
      if (res.code === 0) {
        toast.success(t('common.success'));
        setOpen(false);
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
    setOpen(false);
  };

  return (
    <RrhDialog
      trigger={<button></button>}
      title={t('common.SystemPrompt')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isSubmitting}
    >
      <div>
        <div className="bg-destructive/5 flex items-center gap-1 rounded-md p-2">
          <CircleAlert className="text-destructive h-4 w-4" />
          <span className="text-destructive text-sm leading-5 font-medium">
            {t('accountGroups.deleteTips', { name: name })}
          </span>
        </div>
        <div className="col-span-full -mx-6 flex justify-end px-6 pt-6 pb-6 sm:pb-0">
          <div className="flex justify-end gap-4">
            <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={onCancel}>
              {t('common.Cancel')}
            </RrhButton>
            <RrhButton type="button" className="px-4 py-2" onClick={onSubmit}>
              {t('common.Confirm')}
            </RrhButton>
          </div>
        </div>
      </div>
    </RrhDialog>
  );
};
