import React, { useState, useCallback, useMemo, Dispatch, SetStateAction } from 'react';
import { useMyTicketAllList } from '@/api/hooks/ticket/ticket';
import { MyTicketsTable } from './MyTicketsTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { useTranslation } from 'react-i18next';
import { CrmTicketParams, TicketTabsParamse } from '@/api/hooks/ticket/types';
import { BasicParams } from '@/api/types';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { MyTicketsForm } from './MyTicketsForm';

type Props = {
  mode: TicketTabsParamse;
  setOtherParams: Dispatch<SetStateAction<Omit<CrmTicketParams, keyof BasicParams>>>;
  otherParams: Omit<CrmTicketParams, keyof BasicParams>;
  onReset: () => void;
};

export const GenericTicketList: React.FC<Props> = ({
  mode,
  otherParams,
  setOtherParams,
  onReset,
}) => {
  const { t } = useTranslation();
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const params = useMemo(
    () => ({
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      ...otherParams,
    }),
    [pageNum, pageSize, otherParams],
  );

  const { data, isLoading: loading } = useMyTicketAllList(params, mode);

  const reset = useCallback(() => {
    onReset();
    setPageNum(0);
  }, [onReset]);

  const showStatus = useMemo(() => {
    switch (mode) {
      case 'all':
        return true;
      case 'unprocessed':
        return false;
      case 'processing':
        return false;
      case 'concerned':
        return true;
      case 'ccme':
        return true;
      case 'created':
        return true;
    }
  }, [mode]);

  return (
    <div>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('ticketList.orderId') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, orderId: e }));
            setPageNum(0);
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
            <MyTicketsForm
              setOtherParams={setOtherParams}
              loading={loading}
              showStatus={showStatus}
            />
          </RrhDrawer>
        </div>
      </div>

      <MyTicketsTable
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
