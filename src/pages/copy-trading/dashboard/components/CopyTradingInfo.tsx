import { RrhCard } from '@/components/common/RrhCard';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { useTranslation } from 'react-i18next';
import { PointsSubscription } from '@/api/hooks/pointsMall';
import { RrhRenewDialog } from '@/components/common/RrhRenewDialog';
import { useEditCopyTradingStatus } from '@/api/hooks/copyTrading';
import { RrhButton } from '@/components/common/RrhButton';
import { useTabActions } from '@/hooks/useTabActions';

export function CopyTradingInfo({
  status,
  subscription,
  success,
}: {
  status: number;
  subscription: PointsSubscription;
  success: () => void;
}) {
  const { t } = useTranslation();
  const { mutateAsync: modifyStatus } = useEditCopyTradingStatus();
  const hasSubscriptionPeriod = Boolean(subscription?.startTime && subscription?.endTime);
  const { openTab } = useTabActions();

  const toSetting = () => {
    openTab({
      key: '/copy-trading/settings',
      title: t('dashboard.setting'),
      path: '/copy-trading/settings',
    });
  };

  const toAgreementSetting = () => {
    openTab({
      key: '/copy-trading/agreement-settings',
      title: t('dashboard.agreementSetting'),
      path: '/copy-trading/agreement-settings',
    });
  };

  return (
    <RrhCard>
      <div className="grid gap-3 md:gap-6">
        <div>{t('dashboard.copyTradingMultiAccountManager')}</div>
        <div className="flex items-center justify-between">
          <div className="text-foreground text-sm leading-5 font-medium">
            {t('pointsMallSettings.enableStatus')}
          </div>
          <RrhStatusAlert<{
            status: number;
          }>
            params={{
              status: status === 1 ? 0 : 1,
            }}
            tipsText={status === 1 ? t('ads.confirm.stop') : t('ads.confirm.open')}
            checked={status === 1}
            confirmFunction={modifyStatus}
            onSuccess={success}
          />
        </div>
        <div className="bg-primary-foreground text-muted-foreground grid gap-1 rounded-md p-3 text-xs leading-4">
          {t('dashboard.copyTradingDisabled')}
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-2">
            <div className="text-muted-foreground text-sm leading-5">
              {t('pointsMallSettings.subscriptionPeriod')}
            </div>
            <div>
              {subscription?.status === 0 ? (
                <span className="text-foreground text-2xl leading-6 font-semibold">
                  {t('pointsMallSettings.notSubscribe')}
                </span>
              ) : (
                <div className="flex gap-1">
                  <span className="text-foreground text-2xl leading-6 font-semibold">
                    {subscription?.remainingDays}
                  </span>
                  <span className="text-foreground text-sm leading-6">{t('common.day')}</span>
                </div>
              )}
            </div>
            {subscription?.status === 1 && (
              <div>
                {hasSubscriptionPeriod
                  ? `${subscription?.startTime} - ${subscription?.endTime}`
                  : '--'}
              </div>
            )}
          </div>
          <div>
            <RrhRenewDialog />
          </div>
          <div className="flex gap-2">
            <RrhButton onClick={toSetting} variant="outline" type="button">
              {t('dashboard.setting')}
            </RrhButton>
            <RrhButton onClick={toAgreementSetting} variant="outline" type="button">
              {t('dashboard.agreementSetting')}
            </RrhButton>
          </div>
        </div>
      </div>
    </RrhCard>
  );
}
