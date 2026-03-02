import { DictTypeItem } from '@/api/hooks/system';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useTranslation } from 'react-i18next';
import { PointValueForm } from './PointValueForm';
import { RebateBasePointItem } from '@/api/hooks/rebate';

export const EditPipValueDialog = ({
  serverTypes,
  onSuccess,
  open,
  setOpen,
  productGroupItem,
}: {
  serverTypes: DictTypeItem[];
  onSuccess: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  productGroupItem: RebateBasePointItem | null;
}) => {
  const { t } = useTranslation();

  return (
    <RrhDialog
      open={open}
      onOpenChange={setOpen}
      title={t('common.modify', { field: t('table.pointValue') })}
      footerShow={false}
    >
      <PointValueForm
        serverTypes={serverTypes}
        onSuccess={onSuccess}
        onCancel={() => setOpen(false)}
        productGroupItem={productGroupItem}
      />
    </RrhDialog>
  );
};
