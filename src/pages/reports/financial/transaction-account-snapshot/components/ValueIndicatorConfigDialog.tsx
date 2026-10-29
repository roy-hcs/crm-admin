import { useSaveMeritIndexSetting } from '@/api/hooks/report/report';
import { useGetSysConfig } from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { FormulaExpression } from '../../../components/ValueIndicatorHelp';
import {
  VALUE_INDICATOR_FORMULA_KEY,
  VALUE_INDICATOR_SHOW_KEYS,
  type ValueIndicatorFormula,
} from '../../../components/valueIndicator';

const SHOW_FIELDS = [
  {
    field: 'dealAccountStatistic',
    labelKey: 'valueIndicatorConfig.fields.dealAccountStatistic',
  },
  { field: 'ibDataOverview', labelKey: 'valueIndicatorConfig.fields.ibDataOverview' },
  {
    field: 'ibPerformanceOverview',
    labelKey: 'valueIndicatorConfig.fields.ibPerformanceOverview',
  },
] as const;

type ShowField = (typeof SHOW_FIELDS)[number]['field'];
type ShowValue = '1' | '0';

const FORMULA_META: Record<
  ValueIndicatorFormula,
  { titleKey: string; tagKey: string; descKey: string }
> = {
  '1': {
    titleKey: 'valueIndicatorConfig.effectiveGrowth',
    tagKey: 'valueIndicatorConfig.effectiveGrowthTag',
    descKey: 'valueIndicatorConfig.effectiveGrowthDesc',
  },
  '2': {
    titleKey: 'valueIndicatorConfig.investmentReturns',
    tagKey: 'valueIndicatorConfig.investmentReturnsTag',
    descKey: 'valueIndicatorConfig.investmentReturnsDesc',
  },
};

const CASE_VALUES: Record<ValueIndicatorFormula, { labelKey: string; value: string }[]> = {
  '1': [
    { labelKey: 'valueIndicator.endingNetWorth', value: '13,200' },
    { labelKey: 'valueIndicator.beginningNetWorth', value: '10,000' },
    { labelKey: 'valueIndicator.periodWithdrawal', value: '1,000' },
    { labelKey: 'valueIndicator.creditNetChange', value: '200' },
    { labelKey: 'valueIndicator.adminAdjustment', value: '300' },
  ],
  '2': [
    { labelKey: 'valueIndicator.endingNetWorth', value: '13,800' },
    { labelKey: 'valueIndicator.beginningNetWorth', value: '10,000' },
    { labelKey: 'valueIndicator.periodDeposit', value: '4,000' },
    { labelKey: 'valueIndicator.periodWithdrawal', value: '1,000' },
    { labelKey: 'valueIndicator.creditNetChange', value: '200' },
  ],
};

const CASE_RESULT: Record<ValueIndicatorFormula, string> = {
  '1': '13,200 − 10,000 + 1,000 − 200 − 300 = 3,700 USD',
  '2': '13,800 − 10,000 − 4,000 + 1,000 − 200 = 600 USD',
};

const Segmented = ({
  value,
  onChange,
}: {
  value: ShowValue;
  onChange: (value: ShowValue) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-muted inline-flex rounded-full p-0.5">
      {(['1', '0'] as const).map(item => (
        <button
          key={item}
          type="button"
          className={cn(
            'cursor-pointer rounded-full px-4 py-1 text-xs transition-colors',
            value === item ? 'bg-primary text-white' : 'text-muted-foreground',
          )}
          onClick={() => {
            onChange(item);
          }}
        >
          {item === '1' ? t('valueIndicatorConfig.show') : t('valueIndicatorConfig.hide')}
        </button>
      ))}
    </div>
  );
};

export const ValueIndicatorConfigDialog = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync: save, isPending } = useSaveMeritIndexSetting();

  const { data: dealAccountStatisticCfg } = useGetSysConfig(
    VALUE_INDICATOR_SHOW_KEYS.dealAccountStatistic,
  );
  const { data: ibDataOverviewCfg } = useGetSysConfig(VALUE_INDICATOR_SHOW_KEYS.ibDataOverview);
  const { data: ibPerformanceOverviewCfg } = useGetSysConfig(
    VALUE_INDICATOR_SHOW_KEYS.ibPerformanceOverview,
  );
  const { data: formulaCfg } = useGetSysConfig(VALUE_INDICATOR_FORMULA_KEY);

  const [showSettings, setShowSettings] = useState<Record<ShowField, ShowValue>>({
    dealAccountStatistic: '1',
    ibDataOverview: '1',
    ibPerformanceOverview: '1',
  });
  const [formula, setFormula] = useState<ValueIndicatorFormula>('1');

  useEffect(() => {
    if (!open) return;
    const toShowValue = (value: number | string | undefined): ShowValue =>
      String(value ?? '') === '0' ? '0' : '1';
    setShowSettings({
      dealAccountStatistic: toShowValue(dealAccountStatisticCfg),
      ibDataOverview: toShowValue(ibDataOverviewCfg),
      ibPerformanceOverview: toShowValue(ibPerformanceOverviewCfg),
    });
    setFormula(String(formulaCfg ?? '') === '2' ? '2' : '1');
  }, [open, dealAccountStatisticCfg, ibDataOverviewCfg, ibPerformanceOverviewCfg, formulaCfg]);

  const onConfirm = async () => {
    try {
      const res = await save({
        dealAccountStatistic: showSettings.dealAccountStatistic,
        ibDataOverview: showSettings.ibDataOverview,
        ibPerformanceOverview: showSettings.ibPerformanceOverview,
        formula,
      });
      if (res.code === 0) {
        toast.success(t('common.success'));
        await queryClient.invalidateQueries({ queryKey: ['GetSysConfig'] });
        setOpen(false);
        return;
      }
      toast.error(res.msg);
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  return (
    <RrhDialog
      trigger={
        <RrhButton type="button" Icon={<Settings className="size-3.5" />}>
          {t('valueIndicatorConfig.button')}
        </RrhButton>
      }
      title={t('valueIndicatorConfig.button')}
      open={open}
      onOpenChange={setOpen}
      onConfirm={onConfirm}
      isConfirmDisabled={isPending}
      formLoading={isPending}
      variant="large"
      type="submit"
    >
      <div className="space-y-5 pb-2 text-sm">
        <div className="bg-primary/5 flex gap-2 rounded-md border p-3">
          <div className="flex-1">
            <div className="mb-1 font-medium">{t('valueIndicatorConfig.prereqTitle')}</div>
            <p className="text-muted-foreground text-xs leading-5">
              {t('valueIndicatorConfig.prereqDesc')}
            </p>
          </div>
        </div>

        <section>
          <div className="font-medium">{t('valueIndicatorConfig.fieldShowTitle')}</div>
          <p className="text-muted-foreground mb-2 text-xs">
            {t('valueIndicatorConfig.fieldShowSub')}
          </p>
          <div className="space-y-2">
            {SHOW_FIELDS.map(item => (
              <div
                key={item.field}
                className="flex items-center justify-between rounded-lg border px-4 py-2.5"
              >
                <span>{t(item.labelKey)}</span>
                <Segmented
                  value={showSettings[item.field]}
                  onChange={value => {
                    setShowSettings(prev => ({ ...prev, [item.field]: value }));
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="font-medium">{t('valueIndicatorConfig.formulaTitle')}</div>
          <p className="text-muted-foreground mb-2 text-xs">
            {t('valueIndicatorConfig.formulaSub')}
          </p>
          <div className="flex flex-col gap-3 md:flex-row">
            {(['1', '2'] as const).map(item => (
              <button
                key={item}
                type="button"
                className={cn(
                  'flex-1 cursor-pointer rounded-lg border-2 p-4 text-left transition-colors',
                  formula === item ? 'border-primary bg-primary/5' : 'border-muted',
                )}
                onClick={() => {
                  setFormula(item);
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{t(FORMULA_META[item].titleKey)}</span>
                  <span className="text-primary shrink-0 text-xs">
                    {t(FORMULA_META[item].tagKey)}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs leading-5">
                  {t(FORMULA_META[item].descKey)}
                </p>
                <div className="text-muted-foreground mt-2 mb-1 text-xs">
                  {t('valueIndicatorConfig.formulaLabel')}
                </div>
                <FormulaExpression formula={item} />
              </button>
            ))}
          </div>
        </section>

        <section className="bg-muted/30 rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="bg-primary rounded px-2 py-0.5 text-xs text-white">
              {t('valueIndicatorConfig.currentSelection')}
            </span>
            <span className="font-semibold">{t(FORMULA_META[formula].titleKey)}</span>
          </div>
          <div className="border-primary mb-3 border-l-2 pl-3 text-xs leading-5">
            {t('valueIndicatorConfig.calcBasisDesc')}
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold">{t('valueIndicatorConfig.caseCalc')}</span>
            <span className="text-muted-foreground text-xs">
              {t('valueIndicatorConfig.currencyNote')}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {CASE_VALUES[formula].map(item => (
              <div key={item.labelKey} className="rounded-md border bg-white p-2">
                <div className="text-muted-foreground text-xs">{t(item.labelKey)}</div>
                <div className="mt-0.5 text-sm font-medium">{item.value}</div>
              </div>
            ))}
          </div>
          <div className="bg-muted mt-2 rounded-md p-2">
            <div className="text-muted-foreground text-xs">
              {t('valueIndicatorConfig.calcDetail')}
            </div>
            <div className="mt-0.5 text-xs">{CASE_RESULT[formula]}</div>
          </div>
          <p className="text-muted-foreground mt-2 text-xs leading-5">
            {t(`valueIndicatorConfig.caseSummary.${formula}`)}
          </p>
        </section>
      </div>
    </RrhDialog>
  );
};
