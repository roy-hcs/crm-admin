import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicParams } from '@/api/hooks/review/types';
import { useDictType } from '@/api/hooks/system/system';
import { RebateTraderDealListParams, useRebateTraderDealList } from '@/api/hooks/rebate';
import { TradingRebateSettingsForm } from './TradingRebateSettingsForm';
import { TradingRebateSettingsTable } from './TradingRebateSettingsTable';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';

export const TradingRebateSettingsPage = () => {
  const [otherParams, setOtherParams] = useState<
    Omit<RebateTraderDealListParams, keyof BasicParams>
  >({
    rebateType: '',
    model: '',
    ruleName: '',
    serverType: '',
    serverId: '',
    hasUsed: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: serverTypes } = useDictType('sys_mt_service_type');

  const { data: tradingRebateSettings, isLoading: tradingRebateSettingsLoading } =
    useRebateTraderDealList({
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: '',
      isAsc: 'asc',
      ...otherParams,
    });
  const reset = () => {
    setOtherParams({
      rebateType: '',
      model: '',
      ruleName: '',
      serverType: '',
      serverId: '',
      hasUsed: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('TradingRebateSettings.title')}</h1>
      <div>{t('TradingRebateSettings.warn')}</div>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.ruleName') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setOtherParams(prev => ({ ...prev, ruleName: e }));
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
            <TradingRebateSettingsForm
              serverTypes={serverTypes || []}
              setOtherParams={setOtherParams}
              loading={tradingRebateSettingsLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <TradingRebateSettingsTable
        data={tradingRebateSettings?.rows || []}
        pageCount={Math.ceil(+(tradingRebateSettings?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={tradingRebateSettingsLoading}
      />
    </div>
  );
};
