import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AgentApplyListParams } from '@/api/hooks/review/types';
import { useAgentApplyList } from '@/api/hooks/review/review';
import { ReviewAgentTable } from './ReviewAgentTable';
import { ReviewAgentForm } from './ReviewAgentForm';

export const ReviewAgentPage = () => {
  const [params, setParams] = useState<AgentApplyListParams['params']>({
    beginTime: '',
    endTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<AgentApplyListParams, 'params'>>({
    name: '',
    mobile: '',
    email: '',
    verifyStatus: '',
    applySource: '',
    verifyUserName: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: agentApplyList, isLoading: agentApplyListLoading } = useAgentApplyList(
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
    { enabled: true },
  );
  const reset = () => {
    setParams({
      beginTime: '',
      endTime: '',
    });
    setOtherParams({
      name: '',
      mobile: '',
      email: '',
      verifyStatus: '',
      applySource: '',
      verifyUserName: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('reviewAgent.title')}</h1>
      <div className="my-3.5 flex justify-end gap-2">
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
          <ReviewAgentForm
            setParams={setParams}
            setOtherParams={setOtherParams}
            loading={agentApplyListLoading}
          />
        </RrhDrawer>
      </div>
      <ReviewAgentTable
        data={agentApplyList?.rows || []}
        pageCount={Math.ceil(+(agentApplyList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={agentApplyListLoading}
      />
    </div>
  );
};
