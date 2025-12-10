import { DepositListParams, useDepositList, useDepositListSum } from '@/api/hooks/review';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DepositRecordTable } from './DepositRecordTable';
import { SumItems } from './SumItems';
import { RrhSelect } from '@/components/common/RrhSelect';
import { RrhRangeInput } from '@/components/common/RrhRangeInput';
import { formatDate } from '@/lib/utils';

type FormData = {
  depositMethods: string;
  finishTime: { from: string; to: string };
};

export const DepositRecordPage = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const [params, setParams] = useState<DepositListParams['params']>({
    finishBeginTime: '',
    finishEndTime: '',
    userId,
  });
  const [otherParams, setOtherParams] = useState<Omit<DepositListParams, 'params'>>({
    status: '1',
    method: '',
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [depositMethod, setDepositMethod] = useState('');
  const [finishTimeRange, setFinishTimeRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const form = useForm<FormData>({
    defaultValues: {
      depositMethods: '',
      finishTime: { from: '', to: '' },
    },
  });

  const { data: depositList, isLoading: depositListLoading } = useDepositList(
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

  const { mutate: getDepositSum, data: sumData } = useDepositListSum();
  useEffect(() => {
    getDepositSum({
      params,
      ...otherParams,
    });
  }, [getDepositSum, otherParams, params]);

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
      method: depositMethod,
    });
    setPageNum(0);
  };
  const sumMockData = [
    { currency: 'USD', amount: '100.00', orderCount: '2' },
    { currency: 'AUD', amount: '200.00', orderCount: '3' },
    { currency: 'VND', amount: '100.00', orderCount: '2' },
    { currency: 'USD', amount: '100.00', orderCount: '2' },
    { currency: 'AUD', amount: '200.00', orderCount: '3' },
    { currency: 'VND', amount: '100.00', orderCount: '2' },
    { currency: 'USD', amount: '100.00', orderCount: '2' },
    { currency: 'AUD', amount: '200.00', orderCount: '3' },
    { currency: 'VND', amount: '10000000000000.00', orderCount: '2' },
    { currency: 'USD', amount: '100.00', orderCount: '2' },
    { currency: 'AUD', amount: '200.00', orderCount: '3' },
    { currency: 'VND', amount: '100.00', orderCount: '2' },
  ];
  return (
    <div>
      <SumItems sumInfos={sumMockData} />
      <div className="bg-card rounded-lg px-3 py-6">
        <div className="mb-3 flex gap-3">
          <RrhSelect
            placeholder={t('common.pleaseSelect') + t('table.depositMethods')}
            value={depositMethod}
            onValueChange={value => setDepositMethod(value)}
            options={[
              { label: t('table.internationalTransfer'), value: '1' },
              { label: t('table.bankTransfer'), value: '2' },
              { label: t('table.thirdPayment'), value: '5' },
              { label: t('table.cryptocurrency'), value: '6' },
              { label: t('table.quickPayment'), value: '7' },
              { label: t('table.payID'), value: '13' },
            ]}
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
              className="size-8"
              onClick={e => {
                e.stopPropagation();
                reset();
              }}
            >
              <RefreshCcw className="size-3.5" />
            </RrhButton>
            <RrhButton
              type="button"
              onClick={() => onSubmit()}
              size="sm"
              loading={depositListLoading}
            >
              <Search className="size-3.5" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </div>
        <DepositRecordTable
          data={depositList?.rows || []}
          pageCount={Math.ceil(+(depositList?.total || 0) / pageSize)}
          pageIndex={pageNum}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={setPageSize}
          loading={depositListLoading}
        />
      </div>
    </div>
  );
};
