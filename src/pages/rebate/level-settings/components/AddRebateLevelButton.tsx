import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RebateLevelForm } from './RebateLevelForm';

export const AddRebateLevelButton = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <RrhDialog
      open={open}
      onOpenChange={setOpen}
      title={t('common.addField', { field: t('RebateLevelSettings.rebateLevel') })}
      trigger={
        <RrhButton>
          <Plus />
          {t('common.add')}
        </RrhButton>
      }
      footerShow={false}
    >
      <RebateLevelForm onSuccess={onSuccess} onCancel={() => setOpen(false)} />
    </RrhDialog>
  );
};
