import { useLimitOrderList } from '@/api/hooks/report/report';
import { LimitOrderListParams } from '@/api/hooks/report/types';
import { useServerList } from '@/api/hooks/system/system';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LimitOrderForm, LimitOrderRef } from './LimitOrderForm';
import { LimitOrderTable } from './LimitOrderTable';
import { TableCell } from '@/components/ui/table';

export const LimitOrderPage = () => {
  const [params, setParams] = useState<LimitOrderListParams['params']>({
    positionFuzzyType: '',
    positionFuzzyName: '',
    positionFuzzyLogin: '',
    positionFuzzySymbol: '',
    positionFuzzyTicket: '',
    accounts: '',
    positionDealBJStartTime: '',
    positionDealBJEndTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<LimitOrderListParams, 'params'>>({
    server: '',
    serverGroupList: '',
    accounts: '',
  });
  const formRef = useRef<LimitOrderRef>(null);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: serverList, isLoading: serverListLoading } = useServerList();
  useEffect(() => {
    if (serverList && serverList.rows && serverList.rows.length > 0) {
      setOtherParams(prev => ({
        ...prev,
        server: serverList.rows[0].id,
      }));
    }
  }, [serverList]);
  const selectedServer = useMemo(() => {
    return serverList?.rows?.find(item => otherParams.server === item.id);
  }, [otherParams.server, serverList?.rows]);
  const { data: positionOrderList, isLoading: positionOrderListLoading } = useLimitOrderList(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      ...otherParams,
      params: {
        ...params,
      },
    },
    { enabled: otherParams.server !== '' },
  );

  return (
    <div>
      <h1 className="text-title">{t('limitOrderPage.limitOrder')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setParams(prev => ({ ...prev, positionFuzzyTicket: e }));
            setPageNum(1);
          }}
        />
        <div className="flex justify-end gap-2">
          <RrhDrawer
            headerShow={false}
            asChild
            direction="right"
            footerShow={false}
            Trigger={
              <RrhButton variant="ghost" className="size-8">
                <Funnel />
              </RrhButton>
            }
          >
            <LimitOrderForm
              ref={formRef}
              serverListLoading={serverListLoading}
              serverList={serverList?.rows || []}
              setParams={setParams}
              setOtherParams={setOtherParams}
            />
          </RrhDrawer>
        </div>
      </div>
      <LimitOrderTable
        data={positionOrderList?.rows || []}
        pageCount={Math.ceil(+(positionOrderList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={positionOrderListLoading}
        selectedServer={selectedServer}
        CustomRow={
          <>
            <TableCell colSpan={5}>{t('table.total')}</TableCell>
            <TableCell colSpan={4}>
              {(
                positionOrderList?.totalList.reduce((pre, cur) => pre + cur.totalVolume, 0) || 0
              ).toFixed(2)}
            </TableCell>
            <TableCell colSpan={1}>
              {positionOrderList?.totalList.map(item => {
                return (
                  <div key={item.currency}>
                    {item.totalProfit} {item.currency}
                  </div>
                );
              })}
            </TableCell>
            <TableCell colSpan={1}>
              {positionOrderList?.totalList.map(item => {
                return (
                  <div key={item.currency}>
                    {item.totalSwaps} {item.currency}
                  </div>
                );
              })}
            </TableCell>
          </>
        }
      />
    </div>
  );
};
