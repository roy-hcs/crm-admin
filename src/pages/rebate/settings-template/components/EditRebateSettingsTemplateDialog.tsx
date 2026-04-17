import { RrhDialog } from '@/components/common/RrhDialog';
import { RebateSettingsTemplateForm } from './RebateSettingsTemplateForm';
import { RebateSettingsTemplate } from '@/api/hooks/rebate';
import { useTranslation } from 'react-i18next';

export const EditRebateSettingsTemplateDialog = ({
  onSuccess,
  open,
  setOpen,
  currentTemplate,
  type,
}: {
  onSuccess: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  currentTemplate?: RebateSettingsTemplate;
  type: number;
}) => {
  const { t } = useTranslation();
  const afterSuccess = () => {
    setOpen(false);
    onSuccess();
  };
  return (
    <RrhDialog
      title={t('common.modify', { field: t('RebateTemplate.rebateTemplate') })}
      open={open}
      onOpenChange={setOpen}
      footerShow={false}
      className="pb-22"
    >
      <RebateSettingsTemplateForm
        onCancel={() => setOpen(false)}
        currentTemplate={currentTemplate}
        onSuccess={afterSuccess}
        type={type}
      />
    </RrhDialog>
  );
};
