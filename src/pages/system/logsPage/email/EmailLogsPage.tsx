import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEmailList, EmailListParams } from '@/api/hooks/system';
import { BasicParams } from '@/api/hooks/review/types';
import { EmailLogsForm } from './EmailLogsForm';
import { EmailLogsTable } from './EmailLogsTable';
import dayjs from 'dayjs';

export const EmailLogsPage = () => {
  const [params, setParams] = useState<EmailListParams['params']>({
    sendEndTime: '',
    sendStartTime: dayjs(new Date()).format('YYYY-MM-DD'),
  });
  const [otherParams, setOtherParams] = useState<
    Omit<EmailListParams, 'params' | keyof BasicParams>
  >({
    title: '',
    acceptEmail: '',
    status: '',
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data, isLoading } = useEmailList({
    orderByColumn: '',
    isAsc: 'asc',
    pageNum: pageNum + 1,
    pageSize,
    ...otherParams,
    params: {
      ...params,
    },
  });
  const reset = () => {
    setParams({
      sendEndTime: '',
      sendStartTime: '',
    });
    setOtherParams({
      title: '',
      acceptEmail: '',
      status: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('emailLogsPage.title')}</h1>
      <div className="my-3.5 flex items-center justify-end gap-2">
        <RrhButton variant="outline">{t('emailLogsPage.reSendFailedEmailConfig')}</RrhButton>
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
          <EmailLogsForm
            setParams={setParams}
            setOtherParams={setOtherParams}
            loading={isLoading}
          />
        </RrhDrawer>
      </div>

      <EmailLogsTable
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
