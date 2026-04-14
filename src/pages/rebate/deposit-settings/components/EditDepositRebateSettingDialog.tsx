import { RebateLevelRes, RebateTraderDealItem } from '@/api/hooks/rebate';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useTranslation } from 'react-i18next';
import { DictTypeResponse, ServerListResponse } from '@/api/hooks/system';
import { DealAccountGroupListResponse } from '@/api/hooks/account';
import { DepositRebateSettingsPopupForm } from './DepositRebateSettingsPopupForm';

export const EditDepositRebateSettingDialog = ({
  onSuccess,
  open,
  setOpen,
  rebateTraderDealItem,
  model,
  serverList,
  levelList,
  languageList,
  dealAccountGroupListRes,
}: {
  onSuccess: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  rebateTraderDealItem: RebateTraderDealItem | null;
  model?: number;
  serverList?: ServerListResponse;
  levelList?: RebateLevelRes;
  languageList?: DictTypeResponse;
  dealAccountGroupListRes?: DealAccountGroupListResponse;
}) => {
  const { t } = useTranslation();

  return (
    <RrhDialog
      open={open}
      onOpenChange={setOpen}
      title={t('common.modify', { field: t('trading.rebateTraderName') })}
      footerShow={false}
      className="pb-22"
    >
      <DepositRebateSettingsPopupForm
        onSuccess={onSuccess}
        item={rebateTraderDealItem}
        model={model}
        serverList={serverList}
        levelList={levelList}
        languageList={languageList}
        dealAccountGroupListRes={dealAccountGroupListRes}
      />
    </RrhDialog>
  );
};
