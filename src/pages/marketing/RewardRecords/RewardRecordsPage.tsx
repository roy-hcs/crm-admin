import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RewardRecordsTable } from './RewardRecordsTable';
import { RewardRecordsForm } from './RewardRecordsForm';
import { RewardRecordsListParams } from '@/api/hooks/system/types';
import { useDictType, useRewardRecordsList } from '@/api/hooks/system/system';

export const RewardRecordsPage = () => {
  const [params, setParams] = useState<RewardRecordsListParams['params']>({
    rewardTitle: '',
    crmAccount: '',
    businessType: '',
    bonusTimeStart: '',
    bonusTimeEnd: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<RewardRecordsListParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
  >({
    rewardId: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const { data: bonusDictType } = useDictType('sys_bonus_business_type');
  const { data: data, isLoading: loading } = useRewardRecordsList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params: {
      ...params,
    },
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      rewardTitle: '',
      crmAccount: '',
      businessType: '',
      bonusTimeStart: '',
      bonusTimeEnd: '',
    }));
    setOtherParams({
      rewardId: '',
    });
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('marketing.rewardRecords.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.activityName') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setParams(prev => ({ ...prev, rewardTitle: e }));
            setPageNum(1);
          }}
        />
        <div className="flex justify-end gap-2">
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
            <RewardRecordsForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              loading={loading}
              bonusDictType={bonusDictType || []}
            />
          </RrhDrawer>
        </div>
      </div>
      <RewardRecordsTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={loading}
        bonusDictType={bonusDictType || []}
      />
    </div>
  );
};
