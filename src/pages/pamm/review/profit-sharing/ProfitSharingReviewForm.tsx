import { Dispatch, SetStateAction } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PammCommissionListParams } from '@/api/hooks/pamm/type';
import { BasicParams } from '@/api/types';
import { commissionReviewOptions, settlementTypeOptions } from '@/lib/const';
import { useServerList } from '@/api/hooks/system';
import { BaseOption } from '@/components/common/RrhSelect';
import { serverMap } from '@/lib/constant';
import { formatDate } from '@/lib/utils';

type FormData = {
  auditTime: { from: string; to: string };
  beginTime: { from: string; to: string };
  commissionType: string;
  serverId: string;
  projectName: string;
  customerName: string;
  orderNo: string;
  verifyStatus: string;
  profitType: string;
  settlementType: string;
};

export const ProfitSharingReviewForm = ({
  setParams,
  setOtherParams,
  reset,
  params,
  otherParams,
}: {
  setParams: Dispatch<SetStateAction<PammCommissionListParams['params']>>;
  setOtherParams: Dispatch<
    SetStateAction<Omit<PammCommissionListParams, 'params' | keyof BasicParams>>
  >;
  reset: () => void;
  params: PammCommissionListParams['params'];
  otherParams: Omit<PammCommissionListParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const { data: server, isLoading: serverLoading } = useServerList();
  const form = useForm({
    defaultValues: {
      auditTime: { from: params.auditBeginTime || '', to: params.auditEndTime || '' },
      beginTime: { from: params.beginTime || '', to: params.endTime || '' },
      commissionType: otherParams.commissionType || '2',
      serverId: otherParams.serverId || '',
      projectName: otherParams.projectName || '',
      customerName: otherParams.customerName || '',
      orderNo: otherParams.orderNo || '',
      verifyStatus: otherParams.verifyStatus || '',
      profitType: otherParams.profitType || '',
      settlementType: otherParams.settlementType || '',
    },
  });

  const onSubmit = (data: FormData) => {
    setParams({
      beginTime: formatDate(data.beginTime.from),
      endTime: formatDate(data.beginTime.to),
      auditBeginTime: formatDate(data.auditTime.from),
      auditEndTime: formatDate(data.auditTime.to),
    });
    setOtherParams({
      commissionType: data.commissionType,
      serverId: data.serverId,
      projectName: data.projectName,
      customerName: data.customerName,
      orderNo: data.orderNo,
      verifyStatus: data.verifyStatus,
      profitType: data.profitType,
      settlementType: data.settlementType,
    });
  };

  const onReset = () => {
    reset();
    form.reset({
      auditTime: { from: '', to: '' },
      beginTime: { from: '', to: '' },
      commissionType: '2',
      serverId: '',
      projectName: '',
      customerName: '',
      orderNo: '',
      verifyStatus: '',
      profitType: '',
      settlementType: '',
    });
  };

  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20"
        >
          {!serverLoading && (
            <FormSelect<
              Record<string, string>,
              BaseOption & {
                serviceProperty: number;
                serviceType: number;
              }
            >
              verticalLabel
              name="serverId"
              label={t('table.server')}
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={(server?.rows || []).map(item => ({
                label: item.serverName,
                value: item.id,
                serviceProperty: item.serviceProperty,
                serviceType: item.serviceType,
              }))}
              renderItem={option => {
                return (
                  <div>
                    <span>
                      {option.serviceProperty === 1 ? t('common.live') : t('common.demo')}
                    </span>
                    {option.serviceType && <span> {serverMap[option.serviceType]} | </span>}
                    <span>{option.label}</span>
                  </div>
                );
              }}
            />
          )}
          <FormInput
            verticalLabel
            name="projectName"
            label={t('table.projectName')}
            placeholder={t('common.pleaseInput', {
              field: t('table.projectName'),
            })}
          />
          <FormInput
            verticalLabel
            name="customerName"
            label={t('table.customerName')}
            placeholder={t('common.pleaseInput', {
              field: t('table.customerName'),
            })}
          />
          <FormInput
            verticalLabel
            name="orderNo"
            label={t('table.orderNumber')}
            placeholder={t('common.pleaseInput', {
              field: t('table.orderNumber'),
            })}
          />
          <FormSelect
            verticalLabel
            name="settlementType"
            label={t('profitSharingReview.settlementType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={settlementTypeOptions.map(i => ({ label: t(i.label), value: i.value }))}
          />
          <FormSelect
            verticalLabel
            name="verifyStatus"
            label={t('table.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={commissionReviewOptions.map(i => ({ label: t(i.label), value: i.value }))}
          />
          <FormField
            name="beginTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.submitTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="beginTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="auditTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('table.verifyTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="auditTime" control={form.control} />
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
            <RrhButton type="submit">
              <Search className="size-3.5" />
              <span>{t('common.Search')}</span>
            </RrhButton>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};
