import { InternalTransferReviewDetailRes } from '@/api/hooks/review';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';
import { Input } from '@/components/ui/input';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhTextarea } from '@/components/common/RrhTextarea';
import { RrhCard } from '@/components/common/RrhCard';
import { LabelItem } from '@/components/common/LabelItem';
import { InfoItem } from '@/components/common/InfoItem';

export const ReviewInfoCard = ({
  detailData,
  reviewer,
}: {
  detailData: InternalTransferReviewDetailRes['data'];
  reviewer: InternalTransferReviewDetailRes['data']['reviewer'];
}) => {
  const { t } = useTranslation();
  const [orderNumberShow, setOrderNumberShow] = useState(false);
  const [statusValue, setStatusValue] = useState<string>('1');

  const marginlevelTipText = useMemo(() => {
    if (detailData.detail.marginlevelTip !== 1) return '';
    return `${t('internalTransferReview.checkTips', {
      field: `${detailData.detail.marginlevel.toFixed(2)}`,
    })}${
      detailData.detail.marginlevel > detailData.detail.minAdvanceScale
        ? t('internalTransferReview.higherThan', {
            field: `${detailData.detail.minAdvanceScale.toFixed(2)}%`,
          })
        : ''
    }${
      detailData.detail.marginlevel < detailData.detail.maxAdvanceScale
        ? t('internalTransferReview.lowerThan', {
            field: `${detailData.detail.maxAdvanceScale.toFixed(2)}%`,
          })
        : ''
    }${t('internalTransferReview.checkTimeTips', {
      field: detailData.detail.marginlevelTime,
    })}`;
  }, [detailData.detail, t]);

  return (
    <RrhCard title={t('table.audit')}>
      {marginlevelTipText && (
        <div className="text-muted-foreground text-sm">{marginlevelTipText}</div>
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
                  reviewer.userId !== null
                    ? `${reviewer.userLastName} ${reviewer.userName}`
                    : `${reviewer.roleName}`
                }
              />
            }
          />
        )}
      />

      <FormField
        name="status"
        render={({ field }) => (
          <LabelItem
            label={t('review.reviewStatus')}
            ContentDom={
              <RrhRadioGroup
                value={field.value}
                onValueChange={v => {
                  field.onChange(v);
                  setStatusValue(v);
                }}
                labelClassName="font-medium"
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
            }
          />
        )}
      />

      {statusValue !== '0' && (
        <FormField
          name="isNeedDeposit"
          render={({ field }) => (
            <LabelItem
              label={t('depositReview.depositFunds')}
              ContentDom={
                <div>
                  <RrhRadioGroup
                    value={field.value || '1'}
                    onValueChange={field.onChange}
                    labelClassName="font-medium"
                    radioItems={[
                      {
                        value: '1',
                        label: t('common.yes'),
                      },
                      {
                        value: '0',
                        label: t('common.no'),
                      },
                    ]}
                  />
                  <div className="text-muted-foreground mt-2 text-sm">
                    *{t('depositReview.isNeedDepositTips')}
                  </div>
                </div>
              }
            />
          )}
        />
      )}

      <FormField
        name="remark"
        render={({ field }) => (
          <LabelItem
            label={t('table.remarks')}
            ContentDom={
              <div className="flex w-full flex-col gap-3">
                <div>
                  <RrhTextarea
                    value={field.value}
                    onChange={field.onChange}
                    className="border-input w-full rounded-lg border px-3 py-1 text-sm"
                    placeholder={t('review.reviewRemarksPlaceholder')}
                    maxLength={500}
                  />
                </div>
                {detailData.detail.status !== 1 && (
                  <>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={orderNumberShow}
                        onCheckedChange={() => setOrderNumberShow(!orderNumberShow)}
                      />
                      <div className="text-muted-foreground text-sm">
                        {t('review.syncToTransactionPlatform')}
                      </div>
                    </div>
                  </>
                )}
              </div>
            }
          />
        )}
      />

      {orderNumberShow && (
        <FormField
          name="orderComment"
          render={({ field }) => (
            <LabelItem
              label=""
              ContentDom={
                <Input
                  value={field.value}
                  placeholder={t('depositReview.orderCommentPlaceholder')}
                  onChange={field.onChange}
                  maxLength={12}
                />
              }
            />
          )}
        />
      )}

      <div className="flex items-center gap-3">
        <RrhButton variant="outline">{t('common.Cancel')}</RrhButton>
        <RrhButton type="submit" variant="default">
          {t('common.Confirm')}
        </RrhButton>
      </div>
    </RrhCard>
  );
};
