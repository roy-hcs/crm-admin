import { LeverageReviewDetailRes } from '@/api/hooks/review';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/ui/form';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhTextarea } from '@/components/common/RrhTextarea';
import { RrhCard } from '@/components/common/RrhCard';
import { LabelItem } from '@/components/common/LabelItem';
import { InfoItem } from '@/components/common/InfoItem';

export const CheckInfoCard = ({
  reviewer,
}: {
  reviewer: LeverageReviewDetailRes['data']['reviewer'];
}) => {
  const { t } = useTranslation();

  return (
    <RrhCard title={t('review.review')}>
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
                    ? reviewer.userLastName + ' ' + reviewer.userName
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

      <FormField
        name="remark"
        render={({ field }) => (
          <LabelItem
            label={t('table.remarks')}
            ContentDom={
              <RrhTextarea
                value={field.value}
                onChange={field.onChange}
                className="border-input w-full rounded-lg border px-3 py-1 text-sm"
                placeholder={t('review.reviewRemarksPlaceholder')}
                maxLength={500}
              />
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
    </RrhCard>
  );
};
