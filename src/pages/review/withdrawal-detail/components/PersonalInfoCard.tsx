import { SumWithdrawalAmountRes, withdrawalDetailItem } from '@/api/hooks/review';
import { RrhCard } from '@/components/common/RrhCard';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { InfoItem } from '../../../../components/common/InfoItem';
import { RrhButton } from '@/components/common/RrhButton';
import { ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSumWithdrawAmount } from '@/api/hooks/review/review';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/table';
import { LabelItem } from '@/components/common/LabelItem';

export const PersonalInfoCard = ({
  withdrawalInfo,
  roleName,
  lastLoginTime,
}: {
  withdrawalInfo: withdrawalDetailItem;
  roleName: string;
  lastLoginTime: string;
}) => {
  const { t } = useTranslation();
  const [folded, setFolded] = useState(true);
  const [days, setDays] = useState('7');
  const { data: sumData, isLoading: sumLoading } = useSumWithdrawAmount({
    userId: withdrawalInfo?.userId,
    subTime: withdrawalInfo?.subTime,
    days: days,
  });
  const daysArr = ['7', '15', '30'];
  const columns: ColumnDef<SumWithdrawalAmountRes[number]>[] = [
    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        return <div>{row.original.status}</div>;
      },
    },
    {
      id: 'amountCumulative',
      header: t('review.amountCumulative'),
      cell: ({ row }) => {
        return <div>{row.original.sum}</div>;
      },
    },
    {
      id: 'orderCount',
      header: t('review.orderCount'),
      cell: ({ row }) => {
        return <div>{row.original.size}</div>;
      },
    },
  ];
  return (
    <RrhCard className="mb-3 md:mb-6">
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          folded ? 'max-h-16' : 'max-h-screen',
        )}
      >
        <div className="py-3">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a href="#">
                <h2 className="text-primary text-lg font-semibold">{withdrawalInfo.userName}</h2>
              </a>
              <Badge variant="secondary">{roleName}</Badge>
            </div>
            <RrhButton variant="outline" className="size-6" onClick={() => setFolded(!folded)}>
              <ChevronUp className={cn('size-4 duration-200', folded ? '' : 'rotate-180')} />
            </RrhButton>
          </div>
          <div className="text-muted-foreground line-clamp-1 overflow-ellipsis whitespace-nowrap">
            <span>{withdrawalInfo.userShowId}</span>
            {withdrawalInfo.userEmail && withdrawalInfo.userEmail && <span> | </span>}
            <span title={withdrawalInfo.userEmail}>{withdrawalInfo.userEmail}</span>
          </div>
        </div>
        <LabelItem label={t('review.latestLogin')} ContentDom={<InfoItem info={lastLoginTime} />} />
        <div className="py-3">
          <h3 className="text-lg font-semibold">{t('review.withdrawalAmountCumulative')}</h3>
          <div className="text-muted-foreground">{t('review.withdrawalAmountDesc')}</div>
        </div>
        <Tabs defaultValue="7" onValueChange={e => setDays(e)}>
          <TabsList className="w-full">
            {daysArr.map(day => (
              <TabsTrigger key={day} value={day}>
                {day}
                {t('common.day')}
              </TabsTrigger>
            ))}
          </TabsList>
          {daysArr.map(day => (
            <TabsContent value={day} key={day}>
              <DataTable
                tableWrapperCls="border-none"
                thCls="text-xs text-muted-foreground"
                columns={columns}
                data={sumData || []}
                loading={sumLoading}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </RrhCard>
  );
};
