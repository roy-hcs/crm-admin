import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLoginTable } from './AdminLoginTable';
import { AdminLoginForm } from './AdminLoginForm';
import { useAdminLoginList, AdminLoginParams } from '@/api/hooks/system';

export const AdminLoginPage = () => {
  const [params, setParams] = useState<AdminLoginParams['params']>({
    userName: '',
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<AdminLoginParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
  >({
    ipaddr: '',
    status: '',
    loginLocation: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: walletBalanceList, isLoading: walletBalanceListLoading } = useAdminLoginList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params: {
      ...params,
    },
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      beginTime: '',
      endTime: '',
      userName: '',
    }));
    setOtherParams({
      ipaddr: '',
      status: '',
      loginLocation: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('system.adminLogin.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('system.adminLogin.name') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setParams(prev => ({ ...prev, userName: e }));
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
            <AdminLoginForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={walletBalanceListLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <AdminLoginTable
        data={walletBalanceList?.rows || []}
        pageCount={Math.ceil(+(walletBalanceList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={walletBalanceListLoading}
      />
    </div>
  );
};
