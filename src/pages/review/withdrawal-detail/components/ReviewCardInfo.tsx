import { withdrawalDetailItem, WithdrawalReviewDetailRes } from '@/api/hooks/review';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/ui/form';
import { InfoItem } from '../../../../components/common/InfoItem';
import { Switch } from '@/components/ui/switch';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';
import { Input } from '@/components/ui/input';
import { RrhButton } from '@/components/common/RrhButton';
import { LabelItem } from '@/components/common/LabelItem';

export const ReviewCardInfo = ({
  withdrawalInfo,
  reviewer,
}: {
  withdrawalInfo: withdrawalDetailItem;
  reviewer: WithdrawalReviewDetailRes['data']['reviewer'];
}) => {
  const { t } = useTranslation();
  const [orderNumberShow, setOrderNumberShow] = useState(false);
  const reviewInfo = useMemo(() => {
    let info = (withdrawalInfo?.marginlevel || '') + ',';
    if (withdrawalInfo?.minAdvanceScale && withdrawalInfo?.minAdvanceScale > 0) {
      info += t('common.higherThan') + ' ' + withdrawalInfo?.minAdvanceScale + '%';
    }
    if (withdrawalInfo?.maxAdvanceScale && withdrawalInfo?.maxAdvanceScale > 0) {
      info += t('common.lowerThan') + ' ' + withdrawalInfo?.maxAdvanceScale + '%';
    }
    info += ` (${t('common.queryTime') + ' ' + withdrawalInfo?.marginlevelTime})`;
    return info;
  }, [withdrawalInfo, t]);
  return (
    <>
      {withdrawalInfo.marginlevelTip === 1 && (
        <div className="text-muted-foreground text-sm">
          {t('review.advancePaymentRatio')}
          <span>{reviewInfo}</span>
        </div>
      )}
      <FormField
        name="reviewer"
        disabled
        render={() => (
          <LabelItem
            label={t('information.verifyUserName')}
            ContentDom={
              <InfoItem
                info={
                  reviewer.userId != null
                    ? reviewer.userLastName + ' ' + reviewer.userName
                    : reviewer.roleName
                }
              />
            }
          />
        )}
      />
      <FormField
        name="reviewStatus"
        render={({ field }) => (
          <LabelItem
            label={t('table.reviewStatus')}
            ContentDom={
              <div>
                <RrhRadioGroup
                  value={field.value ?? '1'}
                  onValueChange={field.onChange}
                  labelClassName="text-muted-foreground"
                  radioItems={[
                    {
                      value: '1',
                      label: t('common.verifyStatus.approved'),
                    },
                    {
                      value: '0',
                      label: t('common.verifyStatus.rejected'),
                    },
                  ]}
                />
              </div>
            }
          />
        )}
      />
      <FormField
        name="reviewRemarks"
        render={({ field }) => (
          <LabelItem
            label={t('table.remarks')}
            ContentDom={
              <div className="flex w-full flex-col gap-3">
                {withdrawalInfo.login && (
                  <>
                    <div className="text-muted-foreground text-sm">
                      {t('review.syncToTransactionPlatform')}
                    </div>
                    <Switch
                      checked={orderNumberShow}
                      onCheckedChange={() => setOrderNumberShow(!orderNumberShow)}
                    />
                    <Input value={withdrawalInfo.orderNum} disabled={!!withdrawalInfo.orderNum} />
                  </>
                )}
                <div>
                  <textarea
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                    placeholder={t('review.reviewRemarksPlaceholder')}
                  />
                </div>
              </div>
            }
          />
        )}
      />
      <div className="flex items-center gap-3">
        <RrhButton variant="outline">{t('common.Cancel')}</RrhButton>
        <RrhButton type="submit" variant="default">
          {t('common.Confirm')}
        </RrhButton>
      </div>
    </>
  );
};
