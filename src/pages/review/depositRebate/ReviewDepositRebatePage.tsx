import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useServerList } from '@/api/hooks/system/system';
import { useTranslation } from 'react-i18next';
import { RebateCommissionListParams } from '@/api/hooks/review/types';
import { useRebateCommissionList, useRebateCommissionRuleList } from '@/api/hooks/review/review';
import { ReviewDepositRebateForm } from './ReviewDepositRebateForm';
import { ReviewDepositRebateTable } from './ReviewDepositRebateTable';

export const ReviewDepositRebatePage = () => {
  const [params, setParams] = useState<RebateCommissionListParams['params']>({
    startTraderTime: '',
    endTraderTime: '',
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<RebateCommissionListParams, 'params'>>({
    serverId: '',
    serverGroupList: '',
    mtOrder: '',
    trderAccount: '',
    rebateStatus: '',
    id: '',
    rebateTraderId: '',
    accountGroupList: '',
    verifyUserName: '',
    conditionName: '',
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);

  const { data: serverList, isLoading: serverListLoading } = useServerList();
  const { data: rebateRuleList } = useRebateCommissionRuleList(3);
  console.log('rebateRuleList', rebateRuleList);
  useEffect(() => {
    if (serverList && serverList.rows && serverList.rows.length > 0) {
      setOtherParams(prev => ({
        ...prev,
        serverId: serverList.rows[0].id,
        serverType: serverList.rows[0].serviceType.toString(),
      }));
    }
  }, [serverList]);
  // 该页面存在特殊的服务器选项‘钱包’，选择钱包时，serverId传空，但此时依然允许发起请求，所以修改enabled的逻辑，改为监听serverId变化，一次有值后允许发起请求，不再拦截。主要是为了避免初次加载时发起serverId为空的请求
  useEffect(() => {
    if (otherParams.serverId) {
      setEnabled(true);
    }
  }, [otherParams.serverId]);
  const { data, isLoading } = useRebateCommissionList(
    {
      orderByColumn: '',
      isAsc: 'asc',
      pageNum: pageNum + 1,
      pageSize,
      ...otherParams,
      rebateType: 3,
      params: {
        ...params,
      },
    },
    {
      enabled,
    },
  );
  const reset = () => {
    setParams({
      startTraderTime: '',
      endTraderTime: '',
      beginTime: '',
      endTime: '',
    });
    setOtherParams({
      serverId: serverList?.rows[0].id || '',
      serverGroupList: '',
      mtOrder: '',
      trderAccount: '',
      rebateStatus: '',
      id: '',
      rebateTraderId: '',
      accountGroupList: '',
      verifyUserName: '',
      conditionName: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('depositRebateReview.title')}</h1>
      <div className="my-3.5 flex justify-end gap-2">
        <RrhButton variant="outline">{t('table.export')}</RrhButton>
        <RrhButton variant="outline">{t('table.batchDelete')}</RrhButton>
        <RrhButton variant="outline">{t('table.batchAudit')}</RrhButton>
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
          <ReviewDepositRebateForm
            serverListLoading={serverListLoading}
            serverList={serverList?.rows || []}
            setParams={setParams}
            setOtherParams={setOtherParams}
            rebateRuleList={rebateRuleList || []}
            loading={isLoading}
          />
        </RrhDrawer>
      </div>

      <ReviewDepositRebateTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={isLoading}
      />
    </div>
  );
};
