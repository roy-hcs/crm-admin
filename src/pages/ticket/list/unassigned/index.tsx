import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UnassignedTable } from './UnassignedTable';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { UnassignedForm } from './UnassignedForm';
import { useTicketList } from '@/api/hooks/ticket/ticket';
import { CrmTicketParams } from '@/api/hooks/ticket/types';

export const UnassignedTab = () => {
  const [otherParams, setOtherParams] = useState<
    Omit<CrmTicketParams, 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
  >({
    isAll: '0',
    orderId: '',
    content: '',
    priority: '-1',
    startDate: '',
    endDate: '',
    belongUser: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: data, isLoading: loading } = useTicketList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });

  const reset = () => {
    setOtherParams({
      isAll: '0',
      orderId: '',
      content: '',
      priority: '-1',
      startDate: '',
      endDate: '',
      belongUser: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('ticketList.orderId') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, orderId: e }));
            setPageNum(1);
          }}
        />
        <div className="flex justify-end gap-2">
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
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
            <UnassignedForm setOtherParams={setOtherParams} loading={loading} />
          </RrhDrawer>
        </div>
      </div>
      <UnassignedTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={loading}
      />
    </div>
  );
};
