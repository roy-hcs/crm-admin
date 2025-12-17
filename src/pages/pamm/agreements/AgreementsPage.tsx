import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicParams } from '@/api/hooks/review/types';
import { useDictType } from '@/api/hooks/system/system';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { usePammProductList, usePammProtocolList } from '@/api/hooks/pamm';
import { PammProtocolListParams } from '@/api/hooks/pamm/type';
import { AgreementsForm } from './AgreementsForm';
import { AgreementsTable } from './AgreementsTable';

export const AgreementsPage = () => {
  const [otherParams, setOtherParams] = useState<Omit<PammProtocolListParams, keyof BasicParams>>({
    name: '',
    projectId: '',
    applicableScenarios: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: scenariosType } = useDictType('pamm_protocol_scenario');

  const { data: depositRebateSettings, isLoading: depositRebateSettingsLoading } =
    usePammProtocolList({
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      ...otherParams,
    });
  const productListParams = {
    pageSize: 0,
    pageNum: 1,
    orderByColumn: '',
    isAsc: 'asc',
    status: '1',
    projectName: '',
    model: '',
    profitType: '',
    serverType: '',
  };

  const { data: firstProductList } = usePammProductList(productListParams);
  const total = firstProductList?.total ? Number(firstProductList.total) : 0;
  const { data: productList } = usePammProductList(
    { ...productListParams, pageSize: total },
    { enabled: !!total },
  );
  const reset = () => {
    setOtherParams({
      name: '',
      projectId: '',
      applicableScenarios: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('PammAgreements.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.protocolName') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, name: e }));
            setPageNum(0);
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
            <AgreementsForm
              scenariosType={scenariosType || []}
              setOtherParams={setOtherParams}
              loading={depositRebateSettingsLoading}
              productList={
                productList?.rows.map(item => ({
                  label: item.projectName,
                  value: item.id,
                })) || []
              }
            />
          </RrhDrawer>
        </div>
      </div>
      <AgreementsTable
        data={depositRebateSettings?.rows || []}
        pageCount={Math.ceil(+(depositRebateSettings?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={depositRebateSettingsLoading}
        scenariosType={scenariosType || []}
      />
    </div>
  );
};
