import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicParams } from '@/api/hooks/review/types';
import { RebateBasePointParams } from '@/api/hooks/system/types';
import { useDictType, useGetRebateBasePoint } from '@/api/hooks/system/system';
import { PipValueForm } from './PipValueForm';
import { PipValueTable } from './PipValueTable';

export const PipValuePage = () => {
  const [otherParams, setOtherParams] = useState<Omit<RebateBasePointParams, keyof BasicParams>>({
    pointValueName: '',
    pointValueType: '',
    serverId: '',
    serverType: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: serverTypes } = useDictType('sys_mt_service_type');
  console.log('serverTypes', serverTypes);

  const { data: rebateBasePoint, isLoading: rebateBasePointLoading } = useGetRebateBasePoint({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: '',
    ...otherParams,
  });
  const reset = () => {
    setOtherParams({
      pointValueName: '',
      pointValueType: '',
      serverId: '',
      serverType: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('pipValueSettings.title')}</h1>
      <div>{t('pipValueSettings.warn')}</div>
      <div className="my-3.5 flex justify-end gap-2">
        <RrhButton variant="outline">{t('common.add')}</RrhButton>
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
          <PipValueForm
            serverTypes={serverTypes || []}
            setOtherParams={setOtherParams}
            loading={rebateBasePointLoading}
          />
        </RrhDrawer>
      </div>
      <PipValueTable
        data={rebateBasePoint?.rows || []}
        pageCount={Math.ceil(+(rebateBasePoint?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={rebateBasePointLoading}
      />
    </div>
  );
};
