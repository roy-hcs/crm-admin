import { RrhCard } from '@/components/common/RrhCard';
import { RrhStatusAlert } from '@/components/common/RrhStatusAlert';
import { useTranslation } from 'react-i18next';
import { RrhRenewDialog } from '@/components/common/RrhRenewDialog';
import { NetBonusRewardSubscription, useChangeNetBonusRewardStatus } from '@/api/hooks/marketing';

export function RewardActivationStatus({
  status,
  subscription,
  success,
}: {
  status: number;
  subscription?: NetBonusRewardSubscription;
  success: () => void;
}) {
  const { t } = useTranslation();
  const { mutateAsync: modifyStatus } = useChangeNetBonusRewardStatus();
  const hasSubscriptionPeriod = Boolean(subscription?.startTime && subscription?.endTime);

  return (
    <RrhCard>
      <div className="grid gap-3 md:gap-6">
        <div>{t('netBonusRewardConfig.netBonusReward')}</div>
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
        </div>
      </div>
    </RrhCard>
  );
}
