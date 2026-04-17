import { RrhDialog } from '@/components/common/RrhDialog';
import { useTranslation } from 'react-i18next';
import { RebateSettingsTemplateForm } from './RebateSettingsTemplateForm';
import { useState } from 'react';
import { RrhButton } from '@/components/common/RrhButton';
import { Plus } from 'lucide-react';
export const AddRebateSettingsTemplateButton = ({
  type,
  onSuccess,
}: {
  type: number;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const afterSuccess = () => {
    setOpen(false);
    onSuccess();
  };
  return (
    <RrhDialog
      open={open}
      onOpenChange={setOpen}
      title={t('common.addField', { field: t('RebateTemplate.rebateTemplate') })}
      trigger={
        <RrhButton>
          <Plus />
          {t('common.add')}
        </RrhButton>
      }
      footerShow={false}
      className="pb-22"
    >
      <RebateSettingsTemplateForm
        onCancel={() => setOpen(false)}
        type={type}
        onSuccess={afterSuccess}
      />
    </RrhDialog>
  );
};
