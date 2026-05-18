import { useEditUserRemark } from '@/api/hooks/system/system';
import { RrhDialog } from '@/components/common/RrhDialog';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const EditRemarkDialog = ({
  open,
  setOpen,
  remark,
  userId,
  onSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  remark: string;
  userId: string;
  onSuccess: () => void;
}) => {
  const [remarkInfo, setRemarkInfo] = useState('');
  const { mutate: editUserRemark } = useEditUserRemark();
  const { t } = useTranslation();
  useEffect(() => {
    setRemarkInfo(remark);
  }, [remark]);
  const handleConfirm = () => {
    if (!userId || remarkInfo === remark) {
      setOpen(false);
      return;
    }
    editUserRemark(
      { id: userId, adminRemark: remarkInfo },
      {
        onSuccess: () => {
          setOpen(false);
          onSuccess();
        },
      },
    );
  };
  return (
    <RrhDialog
      title={t('table.remarks')}
      trigger={null}
      open={open}
      onOpenChange={setOpen}
      onConfirm={handleConfirm}
    >
      <Input value={remarkInfo} className="my-2" onChange={e => setRemarkInfo(e.target.value)} />
    </RrhDialog>
  );
};
