import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicParams } from '@/api/types';
import { MamProtocolListParams } from '@/api/hooks/copyTrading/type';
import { useMamProtocolList } from '@/api/hooks/copyTrading';
import { useDictType } from '@/api/hooks/system';
import { CopyTradingSettingsForm } from './CopyTradingSettingsForm';
import { CopyTradingSettingsTable } from './CopyTradingSettingsTable';

export const CopyTradingSettingsPage = () => {
  const [otherParams, setOtherParams] = useState<
    Omit<MamProtocolListParams, 'params' | keyof BasicParams>
  >({
    name: '',
    applicableScenarios: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: mamProtocolList, isLoading: mamProtocolListLoading } = useMamProtocolList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
  });

  const { data: scenarioTypes } = useDictType('mam_protocol_scenario');

  const reset = () => {
    setOtherParams({
      name: '',
      applicableScenarios: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('CopyTradingSettings.title')}</h1>
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
            <CopyTradingSettingsForm
              scenarioTypes={scenarioTypes}
              setOtherParams={setOtherParams}
              loading={mamProtocolListLoading}
            />
          </RrhDrawer>
        </div>
      </div>
      <CopyTradingSettingsTable
        scenarioTypes={scenarioTypes}
        data={mamProtocolList?.rows || []}
        pageCount={Math.ceil(+(mamProtocolList?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={mamProtocolListLoading}
      />
    </div>
  );
};
