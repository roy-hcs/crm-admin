import { DictTypeItem } from '@/api/hooks/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { TypeGroupForm } from './TypeGroupForm';
export const AddProductGroupButton = ({
  serverTypes,
  onSuccess,
}: {
  serverTypes: DictTypeItem[];
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <RrhDialog
      open={open}
      onOpenChange={setOpen}
      title={t('ProductGroup.addProductGroup')}
      trigger={
        <RrhButton>
          <Plus />
          {t('common.add')}
        </RrhButton>
      }
      footerShow={false}
    >
      <TypeGroupForm
        serverTypes={serverTypes}
        onSuccess={onSuccess}
        onCancel={() => setOpen(false)}
      />
    </RrhDialog>
  );
};
