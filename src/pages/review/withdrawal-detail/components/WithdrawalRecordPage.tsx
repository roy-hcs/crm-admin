import {
  useOutMoneyMethodList,
  useWithdrawList,
  useWithdrawListSum,
  WithdrawListParams,
} from '@/api/hooks/review';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import { WithdrawalRecordTable } from './WithdrawalRecordTable';
import { RrhSelect } from '@/components/common/RrhSelect';
import { RrhRangeInput } from '@/components/common/RrhRangeInput';

type FormData = {
  withdrawalMethods: string;
  finishTime: { from: string; to: string };
};

export const WithdrawalRecordPage = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const [params, setParams] = useState<WithdrawListParams['params']>({
    finishBeginTime: '',
    finishEndTime: '',
    userId,
  });
  const [otherParams, setOtherParams] = useState<Omit<WithdrawListParams, 'params'>>({
    status: '1',
    method: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [withdrawalMethod, setWithdrawalMethod] = useState('');
  const [finishTimeRange, setFinishTimeRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const form = useForm<FormData>({
    defaultValues: {
      withdrawalMethods: '',
      finishTime: { from: '', to: '' },
    },
  });

  const { data: withdrawalList, isLoading: withdrawalListLoading } = useWithdrawList(
    {
      pageSize,
      pageNum: pageNum + 1,
      orderByColumn: 'verifyTime desc',
      isAsc: '',
      ...otherParams,
      params: {
        ...params,
      },
    },
    { enabled: true },
  );
  const { data: outMoneyMethodList } = useOutMoneyMethodList();

  const { mutate: getWithdrawSum, data: sumData } = useWithdrawListSum();
  useEffect(() => {
    getWithdrawSum({
      params,
      ...otherParams,
    });
  }, [getWithdrawSum, otherParams, params]);
  console.log('sumData----', sumData);
  const reset = () => {
    setParams({
      finishBeginTime: '',
      finishEndTime: '',
      userId,
    });
    setOtherParams({
      status: '1',
      method: '',
    });
    setPageNum(0);
    form.reset();
  };

  const onSubmit = () => {
    setParams({
      finishBeginTime: formatDate(finishTimeRange.from),
      finishEndTime: formatDate(finishTimeRange.to),
      userId,
    });
    setOtherParams({
      status: '1',
      method: withdrawalMethod,
    });
    setPageNum(0);
  };
  return (
    <div>
      <div className="bg-card rounded-lg px-3 py-6">
        <div className="mb-3 flex gap-3">
          <RrhSelect
            placeholder={t('common.pleaseSelect') + t('table.withdrawMethods')}
            value={withdrawalMethod}
            onValueChange={value => setWithdrawalMethod(value)}
            options={(outMoneyMethodList?.data || []).map(item => ({
              label: item.name,
              value: item.id,
            }))}
            showRowValue={false}
            className="min-w-40"
          />
          <RrhRangeInput
            name="finishTime"
            from={finishTimeRange.from}
            to={finishTimeRange.to}
            onChange={({ from, to }) => setFinishTimeRange({ from, to })}
            className="w-auto min-w-55"
          />

          <div className="flex justify-end gap-4">
            <RrhButton
              type="button"
              variant="outline"
              onClick={() => {
                reset();
              }}
            >
              <RefreshCcw className="size-3.5" />
              <span>{t('common.Reset')}</span>
            </RrhButton>
            <RrhButton type="button" onClick={() => onSubmit()} loading={withdrawalListLoading}>
              <Search className="size-3.5" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </div>
        <WithdrawalRecordTable
          data={withdrawalList?.rows || []}
          pageCount={Math.ceil(+(withdrawalList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={withdrawalListLoading}
          withdrawMethodList={outMoneyMethodList?.data || []}
        />
      </div>
    </div>
  );
};
