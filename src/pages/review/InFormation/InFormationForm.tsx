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
import { CrmInfoVerifyListParams } from '@/api/hooks/review/types';
import { useInfoTypeList } from '@/api/hooks/system/system';
import { InfoTypeItem } from '@/api/hooks/system/types';
import { VerifyStatusOptions } from '@/lib/const';
type FormData = {
  time: { from: string; to: string };
  userId: string;
  infoType: string;
  status: string;
  verifyUserName: string;
};
export const InFormationForm = ({
  setParams,
  setCommonParams,
}: {
  setParams: Dispatch<SetStateAction<CrmInfoVerifyListParams['params']>>;
  setCommonParams: Dispatch<
    SetStateAction<{ userId: string; infoType: string; status: string; verifyUserName: string }>
  >;
}) => {
  const { t } = useTranslation();
  const { data: response } = useInfoTypeList();
  const infoTypeList: InfoTypeItem[] = Array.isArray(response) ? response : [];
  const form = useForm({
    defaultValues: {
      userId: '',
      infoType: '',
      status: '',
      verifyUserName: '',
      time: { from: '', to: '' },
    },
  });
  const onSubmit = (data: FormData) => {
    setParams(pre => ({
      ...pre,
      beginTime: data.time.from,
      endTime: data.time.to,
    }));
    setCommonParams({
      userId: data.userId,
      infoType: data.infoType,
      status: data.status,
      verifyUserName: data.verifyUserName,
    });
  };
  const onReset = () => {
    setParams({
      beginTime: '',
      endTime: '',
    });
    setCommonParams({
      userId: '',
      infoType: '',
      status: '',
      verifyUserName: '',
    });
    form.reset();
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
          className="flex flex-col gap-4 overflow-auto p-4"
        >
          <FormInput
            verticalLabel
            name="userId"
            label={t('financial.paymentOrders.userName')}
            placeholder={t('common.pleaseInput', {
              field: t('financial.paymentOrders.userName'),
            })}
          />
          <FormSelect
            verticalLabel
            name="infoType"
            label={t('review.information.infoType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={infoTypeList.map(item => ({
              label: item.dictLabel || '',
              value: Number(item.dictCode) || 0,
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
            label={t('review.information.verifyUserName')}
            placeholder={t('common.pleaseInput', {
              field: t('review.information.verifyUserName'),
            })}
          />

          <div className="flex justify-end gap-4">
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
