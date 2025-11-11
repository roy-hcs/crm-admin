import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AllTable } from './AllTable';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { AllForm } from './AllForm';
import { useTicketList } from '@/api/hooks/ticket/ticket';
import { CrmTicketParams } from '@/api/hooks/ticket/types';
import { useUserList } from '@/api/hooks/system';

export const AllTab = () => {
  const [otherParams, setOtherParams] = useState<
    Omit<CrmTicketParams, 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
  >({
    isAll: '1',
    orderId: '',
    content: '',
    priority: '-1',
    startDate: '',
    endDate: '',
    status: '-1',
    receiverId: '',
    belongUser: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: userData, isLoading: userDataLoading } = useUserList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    userName: '',
    roleId: '',
    status: '',
    phonenumber: '',
    email: '',
    onlineStatus: '',
    params: {
      beginTime: '',
      endTime: '',
    },
  });
  const { data: data, isLoading: loading } = useTicketList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });

  const reset = () => {
    setOtherParams({
      isAll: '1',
      orderId: '',
      content: '',
      priority: '-1',
      startDate: '',
      endDate: '',
      status: '-1',
      receiverId: '',
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
            <AllForm
              setOtherParams={setOtherParams}
              userData={userData?.rows || []}
              loading={loading || userDataLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <AllTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={loading || userDataLoading}
      />
    </div>
  );
};
