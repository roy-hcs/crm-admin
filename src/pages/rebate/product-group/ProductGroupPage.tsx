import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicParams } from '@/api/hooks/review/types';
import { useDictType } from '@/api/hooks/system/system';
import { RebateBaseTypeParams, useRebateBaseTypeList } from '@/api/hooks/rebate';
import { ProductGroupForm } from './ProductGroupForm';
import { ProductGroupTable } from './ProductGroupTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';

export const ProductGroupPage = () => {
  const [otherParams, setOtherParams] = useState<Omit<RebateBaseTypeParams, keyof BasicParams>>({
    typeGroupName: '',
    serverId: '',
    serverType: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: serverTypes } = useDictType('sys_mt_service_type');
  console.log('serverTypes', serverTypes);

  const { data: rebateBasePoint, isLoading: rebateBasePointLoading } = useRebateBaseTypeList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });
  const reset = () => {
    setOtherParams({
      typeGroupName: '',
      serverId: '',
      serverType: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('ProductGroup.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.typeGroup') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, typeGroupName: e }));
            setPageNum(1);
          }}
        />
        <div className="flex justify-end gap-2">
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
            <ProductGroupForm
              serverTypes={serverTypes || []}
              setOtherParams={setOtherParams}
              loading={rebateBasePointLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <ProductGroupTable
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
