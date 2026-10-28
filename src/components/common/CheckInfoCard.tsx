import { useTranslation } from 'react-i18next';
import { useWatch } from 'react-hook-form';
import { FormField } from '@/components/ui/form';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhTextarea } from '@/components/common/RrhTextarea';
import { RrhCard } from '@/components/common/RrhCard';
import { LabelItem } from '@/components/common/LabelItem';
import { InfoItem } from '@/components/common/InfoItem';

export const CheckInfoCard = ({
  back,
  roleName,
  remarkMaxLength = 500,
  showIsNeedDeposit = false,
  submitDisabled = false,
  submitDisabledTip,
}: {
  back: () => void;
  roleName?: string;
  remarkMaxLength?: number;
  showIsNeedDeposit?: boolean;
  submitDisabled?: boolean;
  submitDisabledTip?: string;
}) => {
  const { t } = useTranslation();
  const status = useWatch({ name: 'status' }) as string | undefined;

  const cancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    back();
  };

  return (
    <RrhCard title={t('table.audit')}>
      {roleName && (
        <FormField
          name="reviewer"
          disabled
          render={() => (
            <LabelItem
              label={t('information.verifyUserName')}
              ContentDom={<InfoItem info={roleName} />}
            />
          )}
        />
      )}
      <FormField
        name="status"
        render={({ field }) => (
          <LabelItem
            label={t('table.reviewStatus')}
            ContentDom={
              <RrhRadioGroup
                value={field.value || '1'}
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

      {showIsNeedDeposit && status !== '0' && (
        <FormField
          name="isNeedDeposit"
          render={({ field }) => (
            <LabelItem
              label={t('depositReview.depositFunds')}
              ContentDom={
                <RrhRadioGroup
                  value={field.value || '1'}
                  onValueChange={field.onChange}
                  labelClassName="font-medium"
                  radioItems={[
                    { value: '1', label: t('common.yes') },
                    { value: '0', label: t('common.no') },
                  ]}
                />
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
              <RrhTextarea
                value={field.value}
                onChange={field.onChange}
                className="border-input w-full rounded-lg border px-3 py-1 text-sm"
                placeholder={t('review.reviewRemarksPlaceholderCount', { max: remarkMaxLength })}
                maxLength={remarkMaxLength}
              />
            }
          />
        )}
      />

      <div className="flex items-center gap-3">
        <RrhButton variant="outline" onClick={cancel}>
          {t('common.Cancel')}
        </RrhButton>
        <RrhButton
          type="submit"
          variant="default"
          disabled={submitDisabled}
          title={submitDisabled ? submitDisabledTip : undefined}
        >
          {t('common.Confirm')}
        </RrhButton>
      </div>
    </RrhCard>
  );
};
