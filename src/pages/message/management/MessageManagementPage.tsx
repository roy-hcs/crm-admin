import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetMsgList, GetMsgListParams } from '@/api/hooks/message';
import { MessageManagementForm } from './MessageManagementForm';
import { MessageManagementTable } from './MessageManagementTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';

export const MessageManagementPage = () => {
  const [params, setParams] = useState<GetMsgListParams['params']>({
    fuzzyName: '',
    fuzzyTitle: '',
    sendEndTime: '',
    sendStartTime: '',
  });
  const [otherParams, setOtherParams] = useState<Omit<GetMsgListParams, 'params'>>({
    type: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: msgList, isLoading: msgListLoading } = useGetMsgList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: '',
    ...otherParams,
    params: {
      ...params,
    },
  });
  const reset = () => {
    setParams({
      fuzzyName: '',
      fuzzyTitle: '',
      sendEndTime: '',
      sendStartTime: '',
    });
    setOtherParams({
      type: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('messageManagement.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.title') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setParams(prev => ({ ...prev, fuzzyTitle: e }));
            setPageNum(0);
          }}
        />
        <div className="flex justify-end gap-2">
          <RrhButton onClick={reset}>{t('common.add')}</RrhButton>
          <RrhButton variant="outline">{t('messageManagement.messageTempate')}</RrhButton>
          <RrhButton variant="ghost" className="size-8 cursor-pointer" onClick={reset}>
            <RefreshCcw className="size-3.5" />
          </RrhButton>
          <RrhDrawer
            headerShow={false}
            asChild
            responsiveDirection={{
              mobile: 'bottom',
              desktop: 'right',
            }}
            footerShow={false}
            Trigger={
              <RrhButton variant="ghost" className="size-8">
                <Funnel />
              </RrhButton>
            }
          >
            <MessageManagementForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={msgListLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <MessageManagementTable
        data={msgList?.rows || []}
        pageCount={Math.ceil(+(msgList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={msgListLoading}
      />
    </div>
  );
};
