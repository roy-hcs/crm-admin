import { RrhButton } from '@/components/common/RrhButton';
import { RrhDrawer } from '@/components/common/RrhDrawer';
import { RrhInputWithIcon } from '@/components/RrhInputWithIcon';
import { Funnel, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PointsHistoryTable } from './PointsHistoryTable';
import { PointsHistoryForm } from './PointsHistoryForm';
import { usePointsChangeList, PointsChangeListParams } from '@/api/hooks/pointsMall';
import { useDictType } from '@/api/hooks/system/system';
import { PointsOperTypeList } from '@/lib/const';

export const PointsHistoryPage = () => {
  const [params, setParams] = useState<PointsChangeListParams['params']>({
    fuzzyName: '',
    fuzzyEmail: '',
    timeStart: '',
    timeEnd: '',
  });
  const [otherParams, setOtherParams] = useState<
    Omit<PointsChangeListParams, 'params' | 'pageSize' | 'pageNum' | 'orderByColumn' | 'isAsc'>
  >({
    businessType: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const { data: operTypeList } = useDictType('sys_points_business_type');
  // 把后端字典与本地常量合并为相同的 DictTypeItem 结构，避免修改全局常量
  const mergedOperTypeList = (operTypeList || []).concat(
    PointsOperTypeList.map(i => ({
      createBy: null,
      createTime: null,
      updateBy: null,
      updateTime: null,
      remark: null,
      params: {},
      dictCode: '',
      dictSort: '',
      dictLabel: t(i.dictLabel),
      dictValue: i.dictValue,
      dictType: '',
      cssClass: null,
      listClass: null,
      isDefault: 'N',
      status: '',
      flag: false,
      globalizationKey: '',
    })),
  );
  const { data: data, isLoading: loading } = usePointsChangeList({
    pageSize,
    pageNum: pageNum + 1,
    orderByColumn: '',
    isAsc: 'asc',
    ...otherParams,
    params,
  });

  const reset = () => {
    setParams(pre => ({
      ...pre,
      fuzzyName: '',
      fuzzyEmail: '',
      timeStart: '',
      timeEnd: '',
    }));
    setOtherParams(pre => ({
      ...pre,
      businessType: '',
    }));
    setPageNum(0);
  };

  return (
    <div>
      <h1 className="text-title">{t('PointsHistory.title')}</h1>
      <div className="my-3.5 flex items-center justify-between">
        <RrhInputWithIcon
          placeholder={t('common.pleaseInput', { field: t('table.nameOrId') })}
          className="h-9"
          rightIcon={<Search className="size-4 cursor-pointer" />}
          onRightIconClick={e => {
            setParams(prev => ({ ...prev, fuzzyName: e }));
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
            <PointsHistoryForm
              setParams={setParams}
              setOtherParams={setOtherParams}
              operTypeList={mergedOperTypeList}
              loading={loading}
            />
          </RrhDrawer>
        </div>
      </div>
      <PointsHistoryTable
        data={data?.rows || []}
        pageCount={Math.ceil(+(data?.total || 0) / pageSize)}
        pageIndex={pageNum}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={setPageSize}
        loading={loading}
        operTypeList={mergedOperTypeList}
      />
    </div>
  );
};
