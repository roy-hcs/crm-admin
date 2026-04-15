import { useCalculateRebateFee } from '@/api/hooks/rebate';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';
import { Calculator } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const CalculateRebateDialog = ({
  timestamp,
  model,
  total,
}: {
  timestamp: number;
  model: number;
  total: string;
}) => {
  const { t } = useTranslation();
  const { mutate: calculateRebateFee } = useCalculateRebateFee();
  const [matchRule, setMatchRule] = useState<string>('1');
  return (
    <RrhDialog
      title={t('common.SystemPrompt')}
      trigger={
        <RrhButton>
          <Calculator />
          {t('FeeRebateSettings.calculateRebate')}
        </RrhButton>
      }
      onConfirm={() => calculateRebateFee({ timestamp, matchRuleType: matchRule, id: 3 })}
    >
      <div className="flex flex-col gap-2">
        <div className="text-base">
          {t('FeeRebateSettings.calculateRebateDesc', { field: total })}
        </div>
        {model === 1 && (
          <RrhRadioGroup
            value={matchRule}
            onValueChange={setMatchRule}
            radioItems={[
              {
                value: '1',
                label: t('FeeRebateSettings.theLatestRule'),
              },
              {
                value: '2',
                label: t('FeeRebateSettings.theHistoryRule'),
              },
            ]}
          />
        )}
        <div className="text-muted-foreground text-xs">
          {t('FeeRebateSettings.calculateRebateTip')}
        </div>
      </div>
    </RrhDialog>
  );
};
