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
import { Dispatch, SetStateAction } from 'react';
import { CrmInfoVerifyListParams } from '@/api/hooks/review';
import { VerifyStatusOptions } from '@/lib/const';
import { InfoTypeItem } from '@/api/hooks/system/types';
import { formatDate } from '@/lib/utils';

type FormData = {
  time: { from: string; to: string };
  userId: string;
  infoType: string;
  status: string;
  verifyUserName: string;
};

export const InformationForm = ({
  setParams,
  setCommonParams,
  infoTypeList,
  reset,
  params,
  commonParams,
}: {
  setParams: Dispatch<SetStateAction<CrmInfoVerifyListParams['params']>>;
  setCommonParams: Dispatch<
    SetStateAction<{ userId: string; infoType: string; status: string; verifyUserName: string }>
  >;
  infoTypeList: InfoTypeItem[];
  reset: () => void;
  params: CrmInfoVerifyListParams['params'];
  commonParams: { userId: string; infoType: string; status: string; verifyUserName: string };
}) => {
  const { t } = useTranslation();

  const form = useForm({
    defaultValues: {
      userId: commonParams.userId || '',
      infoType: commonParams.infoType || '',
      status: commonParams.status || '',
      verifyUserName: commonParams.verifyUserName || '',
      time: { from: params.beginTime || '', to: params.endTime || '' },
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setParams(pre => ({
      ...pre,
      beginTime: formatDate(data.time.from),
      endTime: formatDate(data.time.to),
    }));
    setCommonParams({
      userId: data.userId,
      infoType: data.infoType,
      status: data.status,
      verifyUserName: data.verifyUserName,
    });
  };

  const onReset = () => {
    reset();
    form.reset({
      userId: '',
      infoType: '',
      status: '',
      verifyUserName: '',
      time: { from: '', to: '' },
    });
  };

  return (
    <FormProvider form={form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
        >
          <FormInput
            verticalLabel
            name="userId"
            label={t('paymentOrders.userName')}
            placeholder={t('common.pleaseInput', {
              field: t('paymentOrders.userName'),
            })}
          />
          <FormSelect
            verticalLabel
            name="infoType"
            label={t('information.infoType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={infoTypeList.map(item => ({
              label: item.dictLabel || '',
              value: Number(item.dictValue),
            }))}
          />
          <FormField
            name="time"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel className="basis-3/12">{t('common.subTime')}</FormLabel>
                <FormControl className="basis-9/12">
                  <FormDateRangeInput name="time" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSelect
            verticalLabel
            name="status"
            label={t('common.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={VerifyStatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
          />
          <FormInput
            verticalLabel
            name="verifyUserName"
            label={t('information.verifyUserName')}
            placeholder={t('common.pleaseInput', {
              field: t('information.verifyUserName'),
            })}
          />

          <div className="bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 p-4">
            <RrhButton type="reset" variant={'outline'} onClick={onReset}>
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
