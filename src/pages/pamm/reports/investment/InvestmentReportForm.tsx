import { RrhButton } from '@/components/common/RrhButton';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from '@/contexts/form';
import { useForm } from 'react-hook-form';
import { BasicParams } from '@/api/hooks/review/types';
import { Dispatch, SetStateAction } from 'react';
import { ServerItem } from '@/api/hooks/system/types';
import { PammReportInvestListParams } from '@/api/hooks/pamm/type';
import { formatDate } from '@/lib/utils';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { pammReportStatusMap } from '@/lib/constant';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';

type FormData = {
  serverId: string;
  projectName: string;
  profitType: string;
  userName: string;
  type: string;
  orderNo: string;
  status: string;
  investTime: { from: string; to: string };
  confirmTime: { from: string; to: string };
};

export const InvestmentReportForm = ({
  setOtherParams,
  reset,
  loading,
  serverOptions,
  otherParams,
}: {
  setOtherParams: Dispatch<SetStateAction<Omit<PammReportInvestListParams, keyof BasicParams>>>;
  reset: () => void;
  loading: boolean;
  serverOptions: ServerItem[];
  otherParams: Omit<PammReportInvestListParams, keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      serverId: otherParams.serverId || '',
      projectName: otherParams.projectName || '',
      profitType: otherParams.profitType || '',
      userName: otherParams.userName || '',
      type: otherParams.type || '',
      orderNo: otherParams.orderNo || '',
      status: otherParams.status || '',
      investTime: { from: otherParams.startTime || '', to: otherParams.endTime || '' },
      confirmTime: {
        from: otherParams.confirmStartTime || '',
        to: otherParams.confirmEndTime || '',
      },
    },
  });
  const onSubmit = (data: FormData) => {
    setOtherParams({
      serverId: data.serverId,
      projectName: data.projectName,
      profitType: data.profitType,
      userName: data.userName,
      type: data.type,
      orderNo: data.orderNo,
      status: data.status,
      startTime: formatDate(data.investTime.from),
      endTime: formatDate(data.investTime.to),
      confirmEndTime: formatDate(data.confirmTime.to),
      confirmStartTime: formatDate(data.confirmTime.from),
    });
  };
  const onReset = () => {
    reset();
    form.reset({
      serverId: '',
      projectName: '',
      profitType: '',
      userName: '',
      type: '',
      orderNo: '',
      status: '',
      investTime: { from: '', to: '' },
      confirmTime: { from: '', to: '' },
    });
  };
  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              if (e.target instanceof HTMLTextAreaElement) return;

              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }
          }}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20"
        >
          <RrhServerSelector serverOptions={serverOptions} />
          <FormInput
            verticalLabel
            name="projectName"
            label={t('table.projectName')}
            placeholder={t('common.pleaseInput', { field: t('table.projectName') })}
          />
          <FormSelect
            verticalLabel
            name="profitType"
            label={t('productReview.model')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              {
                label: t('table.floatingIncome'),
                value: '1',
              },
              {
                label: t('table.fixedIncome'),
                value: '2',
              },
            ]}
          />
          <FormInput
            verticalLabel
            name="userName"
            label={t('table.customerName')}
            placeholder={t('common.pleaseInput', { field: t('table.customerName') })}
          />
          <FormSelect
            verticalLabel
            name="type"
            label={t('investmentReview.operType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              {
                label: t('table.buy'),
                value: '1',
              },
              {
                label: t('table.redemption'),
                value: '2',
              },
            ]}
          />
          <FormInput
            verticalLabel
            name="orderNo"
            label={t('table.orderNumber')}
            placeholder={t('common.pleaseInput', { field: t('table.orderNumber') })}
          />

          <FormSelect
            verticalLabel
            name="status"
            label={t('common.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={Object.entries(pammReportStatusMap).map(([key, value]) => ({
              label: t(`PammInvestReport.${value}`),
              value: key,
            }))}
          />
          <FormField
            name="investTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.investTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="investTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirmTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.confirmTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="confirmTime" control={form.control} />
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
        </form>
      </Form>
    </FormProvider>
  );
};
