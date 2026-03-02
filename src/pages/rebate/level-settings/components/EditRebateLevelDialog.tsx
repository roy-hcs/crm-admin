import { RrhDialog } from '@/components/common/RrhDialog';
import { useTranslation } from 'react-i18next';
import { RebateLevelForm } from './RebateLevelForm';
import { RebateLevelItem } from '@/api/hooks/rebate';
export const EditRebateLevelDialog = ({
  onSuccess,
  open,
  setOpen,
  rebateLevelItem,
}: {
  onSuccess: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  rebateLevelItem: RebateLevelItem | null;
}) => {
  const { t } = useTranslation();

  return (
    <RrhDialog
      open={open}
      onOpenChange={setOpen}
      title={t('common.modify', { field: t('RebateLevelSettings.rebateLevel') })}
      footerShow={false}
    >
      <RebateLevelForm
        onSuccess={onSuccess}
        onCancel={() => setOpen(false)}
        rebateLevelItem={rebateLevelItem}
      />
    </RrhDialog>
  );
};
