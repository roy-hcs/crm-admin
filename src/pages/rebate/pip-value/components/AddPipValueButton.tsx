import { DictTypeItem } from '@/api/hooks/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { PointValueForm } from './PointValueForm';
import { useTranslation } from 'react-i18next';

export const AddPipValueButton = ({
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
      title={t('common.addField', { field: t('table.pointValue') })}
      trigger={
        <RrhButton>
          <Plus />
          {t('common.add')}
        </RrhButton>
      }
      footerShow={false}
    >
      <PointValueForm
        serverTypes={serverTypes}
        onSuccess={onSuccess}
        onCancel={() => setOpen(false)}
      />
    </RrhDialog>
  );
};
