import { RiskAccountRow, RiskChainNode } from '@/api/hooks/review';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useTranslation } from 'react-i18next';
import { RiskChainTab } from './riskControlUtils';

const ChainColumn = ({
  kind,
  title,
  row,
  nodes,
}: {
  kind: RiskChainTab;
  title: string;
  row: RiskAccountRow;
  nodes: RiskChainNode[] | null;
}) => {
  const { t } = useTranslation();
  const list = nodes || [];

  const nodeLabel = (index: number) => {
    if (index === 0) {
      return kind === 'direct'
        ? t('riskControlPage.labelDirectBroker')
        : t('riskControlPage.labelCrmSuperior');
    }
    return t('riskControlPage.labelLevelSuffix', { n: index + 1 });
  };

  return (
    <div className="border-border/60 rounded-lg border p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="text-sm font-semibold">{title}</h5>
        <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
          {t('riskControlPage.fullChainLayerBadge', { n: list.length })}
        </span>
      </div>

      <div className="flex items-start gap-2 py-1.5">
        <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold">
          C
        </span>
        <div className="min-w-0">
          <div className="text-muted-foreground text-[11px]">
            {t('riskControlPage.fullChainCurrentCustomer')}
          </div>
          <div className="truncate text-sm font-semibold">{row.customerName}</div>
          <div className="text-muted-foreground truncate text-[11px]">{row.crmShowId}</div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="text-muted-foreground py-2 text-xs">{t('riskControlPage.chainEmpty')}</div>
      ) : (
        list.map((node, index) => (
          <div key={`${node.showId}-${index}`} className="flex items-start gap-2 py-1.5">
            <span className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold">
              {index + 1}
            </span>
            <div className="min-w-0">
              <div className="text-muted-foreground text-[11px]">{nodeLabel(index)}</div>
              <div className="truncate text-sm font-semibold">{node.name}</div>
              <div className="text-muted-foreground truncate text-[11px]">{node.email}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export const RiskFullChainDialog = ({
  open,
  onOpenChange,
  row,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: RiskAccountRow | null;
}) => {
  const { t } = useTranslation();
  const subtitle = row ? `${row.customerName || ''} · CRM ${row.crmShowId || ''}` : '';

  return (
    <RrhDialog
      title={t('riskControlPage.fullChainTitle')}
      description={subtitle}
      open={open}
      onOpenChange={onOpenChange}
      variant="adaptive"
      confirmShow={false}
      cancelText={t('common.close')}
    >
      {row ? (
        <div className="grid gap-3 pb-2 md:grid-cols-2">
          <ChainColumn
            kind="direct"
            title={t('riskControlPage.chainDirectTab')}
            row={row}
            nodes={row.directChain}
          />
          <ChainColumn
            kind="crm"
            title={t('riskControlPage.chainCrmTab')}
            row={row}
            nodes={row.crmChain}
          />
        </div>
      ) : (
        <div className="text-muted-foreground py-6 text-center text-sm">
          {t('riskControlPage.detailNoData')}
        </div>
      )}
    </RrhDialog>
  );
};
