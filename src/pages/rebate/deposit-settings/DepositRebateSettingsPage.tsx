import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicParams } from '@/api/hooks/review/types';
import { useDictType } from '@/api/hooks/system/system';
import { RebateDepositSettingsListParams, useRebateDepositSettingsList } from '@/api/hooks/rebate';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { DepositRebateSettingsForm } from './DepositRebateSettingsForm';
import { DepositRebateSettingsTable } from './DepositRebateSettingsTable';

export const DepositRebateSettingsPage = () => {
  const [otherParams, setOtherParams] = useState<
    Omit<RebateDepositSettingsListParams, keyof BasicParams>
  >({
    rebateType: '3',
    model: '1',
    ruleName: '',
    serverType: '',
    serverId: '',
    hasUsed: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: serverTypes } = useDictType('sys_mt_service_type');

  const { data: depositRebateSettings, isLoading: depositRebateSettingsLoading } =
    useRebateDepositSettingsList({
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
      <h1 className="text-title">{t('DepositRebateSettings.title')}</h1>
      <div>{t('DepositRebateSettings.warn')}</div>
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
          <RrhButton variant="outline">{t('table.rebateTemplate')}</RrhButton>
          <RrhButton variant="outline">{t('table.historyOrderRebate')}</RrhButton>
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
            <DepositRebateSettingsForm
              serverTypes={serverTypes || []}
              setOtherParams={setOtherParams}
              loading={depositRebateSettingsLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <DepositRebateSettingsTable
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
