import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { Funnel, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBonusSettingList, useDictType, useServerList } from '@/api/hooks/system/system';
import { BonusSettingListParams } from '@/api/hooks/system/types';
import { BasicParams } from '@/api/hooks/review/types';
import { RewardConfigForm } from './RewardConfigPageForm';
import { RewardConfigTable } from './RewardConfigPageTable';
import { Switch } from '@/components/ui/switch';

export const RewardConfigPage = () => {
  const [params, setParams] = useState<BonusSettingListParams['params']>({
    rewardTitle: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<BonusSettingListParams, 'params' | keyof BasicParams>
  >({
    businessType: '',
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data, isLoading } = useBonusSettingList({
    orderByColumn: '',
    isAsc: 'asc',
    pageNum: pageNum + 1,
    pageSize,
    ...otherParams,
    params: {
      ...params,
    },
  });
  const { data: serverList } = useServerList();

  const { data: bonusDictType } = useDictType('sys_bonus_business_type');
  console.log('bonusDictType', bonusDictType);
  const reset = () => {
    setParams({
      rewardTitle: '',
    });
    setOtherParams({
      businessType: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('rewardConfigPage.title')}</h1>
      <div className="my-3.5 flex items-center justify-end gap-2">
        <RrhButton variant="outline">{t('table.new')}</RrhButton>
        <div className="flex items-center justify-center">
          <span>{t('table.allowMultipleBonusHits')}</span>
          <Switch className="ml-2" />
        </div>
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
          <RewardConfigForm
            setParams={setParams}
            setOtherParams={setOtherParams}
            loading={isLoading}
            businessTypes={bonusDictType || []}
          />
        </RrhDrawer>
      </div>

      <RewardConfigTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={isLoading}
        businessTypes={bonusDictType || []}
        serverList={serverList?.rows || []}
      />
    </div>
  );
};
