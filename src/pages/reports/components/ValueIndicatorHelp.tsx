import { RrhDialog } from '@/components/common/RrhDialog';
import { cn } from '@/lib/utils';
import { CircleHelp } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type ValueIndicatorFormula, useValueIndicatorFormula } from './valueIndicator';

const Term = ({ children, primary }: { children: React.ReactNode; primary?: boolean }) => (
  <span
    className={cn(
      'rounded px-2 py-0.5 whitespace-nowrap',
      primary ? 'bg-primary font-semibold text-white' : 'bg-primary/10 text-primary',
    )}
  >
    {children}
  </span>
);

const Op = ({ children }: { children: React.ReactNode }) => (
  <span className="text-foreground font-bold">{children}</span>
);

export const FormulaExpression = ({ formula }: { formula: ValueIndicatorFormula }) => {
  const { t } = useTranslation();
  const isInvestment = formula === '2';

  return (
    <div className="flex flex-wrap items-center gap-1 text-xs">
      <Term primary>{t('valueIndicator.title')}</Term>
      <Op>=</Op>
      <Term>{t('valueIndicator.endingNetWorth')}</Term>
      <Op>−</Op>
      <Term>{t('valueIndicator.beginningNetWorth')}</Term>
      {isInvestment && (
        <>
          <Op>−</Op>
          <Term>{t('valueIndicator.periodDeposit')}</Term>
        </>
      )}
      <Op>+</Op>
      <Term>{t('valueIndicator.periodWithdrawal')}</Term>
      <Op>−</Op>
      <Term>{t('valueIndicator.creditNetChange')}</Term>
      {!isInvestment && (
        <>
          <Op>−</Op>
          <Term>{t('valueIndicator.adminAdjustment')}</Term>
        </>
      )}
    </div>
  );
};

const FORMULA_TERMS = [
  {
    nameKey: 'valueIndicator.endingNetWorth',
    descKey: 'valueIndicator.endingNetWorthDesc',
    op: '',
  },
  {
    nameKey: 'valueIndicator.beginningNetWorth',
    descKey: 'valueIndicator.beginningNetWorthDesc',
    op: '−',
  },
  {
    nameKey: 'valueIndicator.periodDeposit',
    descKey: 'valueIndicator.periodDepositDesc',
    op: '−',
    onlyInvestment: true,
  },
  {
    nameKey: 'valueIndicator.periodWithdrawal',
    descKey: 'valueIndicator.periodWithdrawalDesc',
    op: '+',
  },
  {
    nameKey: 'valueIndicator.creditNetChange',
    descKey: 'valueIndicator.creditNetChangeDesc',
    op: '−',
  },
  {
    nameKey: 'valueIndicator.adminAdjustment',
    descKey: 'valueIndicator.adminAdjustmentDesc',
    op: '−',
    onlyEffectiveGrowth: true,
  },
] as const;

export const ValueIndicatorHeader = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const formula = useValueIndicatorFormula();
  const isInvestment = formula === '2';

  return (
    <>
      <span className="inline-flex items-center gap-1">
        {t('valueIndicator.title')}
        <CircleHelp
          className="size-3.5 cursor-pointer"
          onClick={() => {
            setOpen(true);
          }}
        />
      </span>
      <RrhDialog
        open={open}
        onOpenChange={setOpen}
        title={t('valueIndicator.dialogTitle')}
        variant="middle"
        type="view"
        cancelShow={false}
        confirmText={t('valueIndicator.gotIt')}
      >
        <div className="space-y-4 pb-2 text-sm">
          <div className="bg-primary/5 rounded-md border p-3 text-xs leading-5">
            <div className="text-foreground mb-1 font-medium">{t('valueIndicator.tipTitle')}</div>
            <p className="text-muted-foreground">{t('valueIndicator.tip')}</p>
          </div>
          <section>
            <div className="mb-2 font-medium">{t('valueIndicator.currentMethod')}</div>
            <div className="text-primary font-semibold">
              {isInvestment
                ? t('valueIndicator.investmentReturns')
                : t('valueIndicator.effectiveGrowth')}
            </div>
            <p className="text-muted-foreground mt-1 text-xs leading-5">
              {isInvestment
                ? t('valueIndicator.investmentReturnsDesc')
                : t('valueIndicator.effectiveGrowthDesc')}
            </p>
          </section>
          <section>
            <div className="mb-2 font-medium">{t('valueIndicator.formulaTitle')}</div>
            <FormulaExpression formula={formula} />
          </section>
          <section>
            <div className="mb-2 font-medium">{t('valueIndicator.formulaExplain')}</div>
            <div className="space-y-2 text-xs leading-5">
              {FORMULA_TERMS.filter(item => {
                if ('onlyInvestment' in item) return isInvestment;
                if ('onlyEffectiveGrowth' in item) return !isInvestment;
                return true;
              }).map(item => (
                <div key={item.nameKey}>
                  <span className="text-primary font-medium">
                    {item.op} {t(item.nameKey)}
                  </span>
                  <span className="text-muted-foreground ml-2">{t(item.descKey)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </RrhDialog>
    </>
  );
};
