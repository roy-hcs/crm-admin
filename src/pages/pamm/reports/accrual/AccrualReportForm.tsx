import { RrhButton } from '@/components/common/RrhButton';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { BasicParams } from '@/api/hooks/review/types';
import { Dispatch, SetStateAction } from 'react';
import { ServerItem } from '@/api/hooks/system/types';
import { PammReportSettlementListParams } from '@/api/hooks/pamm/type';
import { formatDate } from '@/lib/utils';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  serverId: string;
  projectName: string;
  userName: string;
  orderNo: string;
  managerName: string;
  settlementType: string;
  settlementTime: { from: string; to: string };
};

export const AccrualReportForm = ({
  setOtherParams,
  reset,
  loading,
  serverOptions,
  otherParams,
}: {
  setOtherParams: Dispatch<
    SetStateAction<Omit<PammReportSettlementListParams, 'params' | keyof BasicParams>>
  >;
  reset: () => void;
  loading: boolean;
  serverOptions: ServerItem[];
  otherParams: Omit<PammReportSettlementListParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      serverId: otherParams.serverId || '',
      projectName: otherParams.projectName || '',
      userName: otherParams.userName || '',
      managerName: otherParams.managerName || '',
      orderNo: otherParams.orderNo || '',
      settlementType: otherParams.settlementType || '',
      settlementTime: { from: otherParams.startTime || '', to: otherParams.endTime || '' },
    },
  });
  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      serverId: data.serverId,
      projectName: data.projectName,
      userName: data.userName,
      orderNo: data.orderNo,
      managerName: data.managerName,
      settlementType: data.settlementType,
      startTime: formatDate(data.settlementTime.from),
      endTime: formatDate(data.settlementTime.to),
    });
  };
  const onReset = () => {
    reset();
    form.reset({
      serverId: '',
      projectName: '',
      userName: '',
      managerName: '',
      orderNo: '',
      settlementType: '',
      settlementTime: { from: '', to: '' },
    });
  };
  return (
    <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              if (e.target instanceof HTMLTextAreaElement) return;

              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }
          }}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
        >
          <RrhServerSelector serverOptions={serverOptions} />
          <FormInput
            verticalLabel
            name="projectName"
            label={t('table.projectName')}
            placeholder={t('common.pleaseInput', { field: t('table.projectName') })}
          />
          <FormInput
            verticalLabel
            name="userName"
            label={t('table.customerName')}
            placeholder={t('common.pleaseInput', { field: t('table.customerName') })}
          />
          <FormInput
            verticalLabel
            name="managerName"
            label={t('productReview.investmentManager')}
            placeholder={t('common.pleaseInput', { field: t('productReview.investmentManager') })}
          />
          <FormInput
            verticalLabel
            name="orderNo"
            label={t('table.orderNumber')}
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
          />
          <FormSelect
            verticalLabel
            name="settlementType"
            label={t('profitSharingReview.settlementType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              {
                label: t('table.periodicSettlement'),
                value: '1',
              },
              {
                label: t('table.redemptionSettlement'),
                value: '2',
              },
            ]}
          />
          <FormField
            name="settlementTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.settlementTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="settlementTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 p-4">
            <RrhButton type="reset" variant="outline" onClick={onReset}>
              <RefreshCcw className="size-3.5" />
              <span>{t('common.Reset')}</span>
            </RrhButton>
            <RrhButton type="submit" loading={loading}>
              <Search className="size-3.5" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </RrhForm>
  );
};
