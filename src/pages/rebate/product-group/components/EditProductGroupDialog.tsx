import { RrhDialog } from '@/components/common/RrhDialog';
import { useTranslation } from 'react-i18next';
import { TypeGroupForm } from './TypeGroupForm';
import { DictTypeItem } from '@/api/hooks/system';
import { RebateBaseTypeItem } from '@/api/hooks/rebate';

export const EditProductGroupDialog = ({
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
  productGroupItem: RebateBaseTypeItem | null;
}) => {
  const { t } = useTranslation();

  return (
    <RrhDialog
      open={open}
      onOpenChange={setOpen}
      title={t('ProductGroup.editProductGroup')}
      footerShow={false}
    >
      <TypeGroupForm
        serverTypes={serverTypes}
        onSuccess={onSuccess}
        onCancel={() => setOpen(false)}
        productGroupItem={productGroupItem}
      />
    </RrhDialog>
  );
};
