import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicParams } from '@/api/hooks/review/types';
import { useDictType } from '@/api/hooks/system/system';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { PammProductsForm } from './PammProductsForm';
import { PammProductsTable } from './PammProductsTable';
import { PammProductListParams } from '@/api/hooks/pamm/type';
import { usePammProductList } from '@/api/hooks/pamm';

export const PammProductsPage = () => {
  const [otherParams, setOtherParams] = useState<Omit<PammProductListParams, keyof BasicParams>>({
    profitType: '',
    model: '',
    projectName: '',
    serverType: '',
    status: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: serverTypes } = useDictType('sys_mt_service_type');

  const { data: depositRebateSettings, isLoading: depositRebateSettingsLoading } =
    usePammProductList({
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      ...otherParams,
    });
  const reset = () => {
    setOtherParams({
      profitType: '',
      model: '',
      projectName: '',
      serverType: '',
      status: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('PammProduct.title')}</h1>
      <div className="text-sm">
        <div>{t('PammProduct.desc')}</div>
        <div>{t('PammProduct.descOne')}</div>
        <div>{t('PammProduct.descTwo')}</div>
      </div>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.projectName') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, projectName: e }));
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
            <PammProductsForm
              serverTypes={serverTypes || []}
              setOtherParams={setOtherParams}
              loading={depositRebateSettingsLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <PammProductsTable
        data={depositRebateSettings?.rows || []}
        pageCount={Math.ceil(+(depositRebateSettings?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={depositRebateSettingsLoading}
      />
    </div>
  );
};
