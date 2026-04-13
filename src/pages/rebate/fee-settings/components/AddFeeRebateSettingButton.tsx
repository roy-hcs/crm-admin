import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { DictTypeResponse, ServerListResponse } from '@/api/hooks/system';
import { RebateLevelRes } from '@/api/hooks/rebate';
import { DealAccountGroupListResponse } from '@/api/hooks/account';
import { FeeRebateSettingForm } from './FeeRebateSettingForm';
export const AddFeeRebateSettingButton = ({
  onSuccess,
  model,
  serverList,
  levelList,
  languageList,
  dealAccountGroupListRes,
}: {
  onSuccess: () => void;
  model?: number;
  serverList?: ServerListResponse;
  levelList?: RebateLevelRes;
  languageList?: DictTypeResponse;
  dealAccountGroupListRes?: DealAccountGroupListResponse;
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
      title={t('common.addField', { field: t('trading.rebateTraderName') })}
      trigger={
        <RrhButton>
          <Plus />
          {t('common.add')}
        </RrhButton>
      }
      footerShow={false}
      className="pb-22"
    >
      <FeeRebateSettingForm
        onSuccess={afterSuccess}
        model={model}
        serverList={serverList}
        levelList={levelList}
        languageList={languageList}
        dealAccountGroupListRes={dealAccountGroupListRes}
      />
    </RrhDialog>
  );
};
