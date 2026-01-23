import { RrhDialog } from '@/components/common/RrhDialog';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { RrhButton } from '@/components/common/RrhButton';
import { useDeleteWallet } from '@/api/hooks/account';

export const DeleteWalletDialog = ({
  open,
  setOpen,
  id,
  title,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
  title: string;
}) => {
  const { t } = useTranslation();
  const { mutateAsync: deleteWallet } = useDeleteWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await deleteWallet({
        ids: id,
      });
      if (res.code === 0) {
        toast.success(t('common.success'));
        setOpen(false);
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    setOpen(false);
  };

  return (
    <RrhDialog
      title={title}
      trigger={<button></button>}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      variant="small"
      formLoading={isSubmitting}
    >
      <div>
        <div className="bg-destructive/5 flex items-center gap-1 rounded-md p-2">
          <CircleAlert className="text-destructive size-4" />
          <span className="text-destructive text-sm leading-5 font-medium">
            {t('walletAccountsPage.deleteTips')}
          </span>
        </div>
        <div className="col-span-full -mx-6 flex justify-end px-6 py-6 sm:pb-0">
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
