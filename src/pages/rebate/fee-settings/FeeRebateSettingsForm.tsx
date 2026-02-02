import { Dispatch, SetStateAction } from 'react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DictTypeItem } from '@/api/hooks/system/types';
import { BaseOption } from '@/components/common/RrhSelect';
import { useSelectServerList, RebateFeeSettingsListParams } from '@/api/hooks/rebate';
import { serverMap } from '@/lib/constant';
import { BasicParams } from '@/api/hooks/review/types';

type FormData = {
  ruleName: string;
  serverType: string;
  serverId: string;
  hasUsed: string;
};

export const FeeRebateSettingsForm = ({
  setParams,
  serverTypes,
  reset,
  params,
}: {
  setParams: Dispatch<SetStateAction<Omit<RebateFeeSettingsListParams, keyof BasicParams>>>;
  reset: () => void;
  params: Omit<RebateFeeSettingsListParams, keyof BasicParams>;
  serverTypes: DictTypeItem[];
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      ruleName: params.ruleName || '',
      serverType: params.serverType || '',
      serverId: params.serverId || '',
      hasUsed: params.hasUsed || '',
    },
  });

  const { data: serverList } = useSelectServerList(
    {
      serverProperty: 1,
      serverType: form.watch('serverType'),
    },
    { enabled: !!form.watch('serverType') },
  );

  const onSubmit = (data: FormData) => {
    reset();
    setParams({
      rebateType: '2',
      model: '1',
      ruleName: data.ruleName,
      serverType: data.serverType,
      serverId: data.serverId,
      hasUsed: data.hasUsed === 'all' ? '' : data.hasUsed,
    });
  };

  const onReset = () => {
    reset();
    form.reset({
      ruleName: '',
      serverType: '',
      serverId: '',
      hasUsed: '',
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
            name="ruleName"
            label={t('table.ruleName')}
            placeholder={t('common.pleaseInput', { field: t('table.ruleName') })}
          />
          <FormSelect
            verticalLabel
            name="serverType"
            label={t('table.transactionPlatform')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={serverTypes.map(item => {
              return { label: item.dictLabel, value: item.dictValue };
            })}
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
            options={(serverList || []).map(item => ({
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
            name="hasUsed"
            label={t('common.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              {
                label: t('table.all'),
                value: 'all',
              },
              {
                label: t('common.enable'),
                value: '1',
              },
              {
                label: t('common.disable'),
                value: '0',
              },
            ]}
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
