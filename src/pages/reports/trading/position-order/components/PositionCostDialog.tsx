import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { usePositionAverageList } from '@/api/hooks/report/report';
import { PositionAverageItem, PositionOrderParams } from '@/api/hooks/report';
import { ToolTip } from '@/components/common/ToolTip';
import { CircleAlert } from 'lucide-react';

export const PositionCostDialog = ({
  serverId,
  otherParams,
  params,
}: {
  serverId?: string;
  params: PositionOrderParams['params'];
  otherParams: Omit<PositionOrderParams, 'params'>;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = usePositionAverageList(
    {
      orderByColumn: '',
      isAsc: 'asc',
      ...otherParams,
      params: {
        ...params,
      },
    },
    { enabled: !!serverId },
  );

  const columns = useMemo<ColumnDef<PositionAverageItem>[]>(
    () => [
      {
        id: 'asset',
        header: t('table.symbol'),
        accessorFn: row => row.asset || '-',
      },
      {
        id: 'lotsBuy',
        header: t('positionOrderPage.buyPositionVolume'),
        accessorFn: row => (row.lotsBuy || 0).toFixed(2),
      },
      {
        id: 'lotsBuy',
        header: t('positionOrderPage.buyPositionCost'),
        accessorFn: row => {
          return row.lotsBuy === 0
            ? 0
            : ((row.totalBuy || 0) / (row.lotsBuy || 0)).toFixed((row.digits || 0) + 3);
        },
      },
      {
        id: 'lotsSell',
        header: t('positionOrderPage.sellPositionVolume'),
        accessorFn: row => (row.lotsSell || 0).toFixed(2),
      },
      {
        id: 'totalSell',
        header: t('positionOrderPage.sellPositionCost'),
        accessorFn: row => {
          return row.lotsSell === 0
            ? 0
            : ((row.totalSell || 0) / (row.lotsSell || 0)).toFixed((row.digits || 0) + 3);
        },
      },
      {
        id: 'lotsBuy',
        header: () => (
          <div className="flex items-center gap-1">
            {t('positionOrderPage.netPositionVolume')}
            <ToolTip content={t('positionOrderPage.netPositionVolumeTips')}>
              <CircleAlert className="text-muted-foreground size-4" />
            </ToolTip>
          </div>
        ),
        accessorFn: row => {
          return ((row.lotsBuy || 0) - (row.lotsSell || 0)).toFixed(2);
        },
      },
    ],
    [t],
  );

  return (
    <RrhDialog
      trigger={<RrhButton variant="outline">{t('positionOrderPage.positionCost')}</RrhButton>}
      title={t('positionOrderPage.positionCost')}
      cancelText={t('common.close')}
      confirmShow={false}
      open={open}
      onOpenChange={setOpen}
      variant="large"
    >
      <div className="overflow-y-auto">
        <DataTable columns={columns} data={data?.rows || []} loading={isLoading} />
      </div>
    </RrhDialog>
  );
};
