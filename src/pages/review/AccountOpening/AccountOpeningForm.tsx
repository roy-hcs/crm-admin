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
import { CrmNewLoginVerifyListParams } from '@/api/hooks/review/types';
import { typeOptions, VerifyStatusOptions } from '@/lib/const';
import { useServerList } from '@/api/hooks/system/system';
import { BaseOption } from '@/components/common/RrhSelect';
import { serverMap } from '@/lib/constant';

type FormData = {
  time: { from: string; to: string };
  server: string;
  serverType: string;
  serverProperty: string;
  userId: string;
  status: string;
  source: string;
  verifyUserName: string;
};
export const AccountOpeningForm = ({
  setParams,
  setCommonParams,
}: {
  setParams: Dispatch<SetStateAction<CrmNewLoginVerifyListParams['params']>>;
  setCommonParams: Dispatch<
    SetStateAction<{ userId: string; status: string; source: string; verifyUserName: string }>
  >;
}) => {
  const { data: server } = useServerList();
  const serverOptions = server?.rows || [];
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      server: '',
      serverType: '',
      serverProperty: '',
      userId: '',
      status: '',
      source: '',
      verifyUserName: '',
      time: { from: '', to: '' },
    },
  });
  const onSubmit = (data: FormData) => {
    setParams(pre => ({
      ...pre,
      server: data.server,
      serverType: data.serverType,
      serverProperty: data.serverProperty,
      beginTime: data.time.from,
      endTime: data.time.to,
    }));
    setCommonParams({
      userId: data.userId,
      status: data.status,
      source: data.source,
      verifyUserName: data.verifyUserName,
    });
  };
  const onReset = () => {
    setParams({
      server: '',
      serverType: '',
      serverProperty: '',
      beginTime: '',
      endTime: '',
    });
    setCommonParams({
      userId: '',
      status: '',
      source: '',
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
            name="status"
            label={t('common.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={VerifyStatusOptions.map(i => ({ label: t(i.label), value: i.value }))}
          />
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
            options={serverOptions.map(item => ({
              label: item.serverName,
              value: item.id,
              serviceProperty: item.serviceProperty,
              serviceType: item.serviceType,
            }))}
            renderItem={option => {
              return (
                <div>
                  {/* TODO: 优化样式 */}
                  <span>{option.serviceProperty === 1 ? t('common.live') : t('common.demo')}</span>
                  {option.serviceType && <span> {serverMap[option.serviceType]} | </span>}
                  <span>{option.label}</span>
                </div>
              );
            }}
          />
          <FormSelect
            verticalLabel
            name="serverType"
            label={t('common.serverType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={Object.keys(serverMap).map(key => ({
              label: serverMap[Number(key)],
              value: key,
            }))}
          />
          <FormSelect
            verticalLabel
            name="serverProperty"
            label={t('common.type')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={typeOptions.map(i => ({
              label: t(i.label),
              value: i.value,
            }))}
          />
          <FormInput
            verticalLabel
            name="source"
            label={t('review.accountOpening.source')}
            placeholder={t('common.pleaseInput', {
              field: t('review.accountOpening.source'),
            })}
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
