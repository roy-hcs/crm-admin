import { RrhButton } from '@/components/common/RrhButton';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { Form } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from '@/contexts/form';
import { useForm } from 'react-hook-form';
import { BasicParams } from '@/api/hooks/review/types';
import { Dispatch, SetStateAction } from 'react';
import { DictTypeItem } from '@/api/hooks/system/types';
import { BaseOption } from '@/components/common/RrhSelect';
import { useSelectServerList, RebateBasePointParams } from '@/api/hooks/rebate';
import { serverMap } from '@/lib/constant';

type FormData = {
  pointValueName: string;
  serverType: string;
  serverId: string;
  pointValueType: string;
};

export const PipValueForm = ({
  setOtherParams,
  loading,
  serverTypes,
}: {
  setOtherParams: Dispatch<SetStateAction<Omit<RebateBasePointParams, keyof BasicParams>>>;
  loading: boolean;
  serverTypes: DictTypeItem[];
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      pointValueName: '',
      serverType: '',
      serverId: '',
      pointValueType: '',
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
    setOtherParams({
      pointValueName: data.pointValueName,
      serverType: data.serverType,
      serverId: data.serverId,
      pointValueType: data.pointValueType,
    });
  };
  const onReset = () => {
    setOtherParams({
      pointValueName: '',
      serverType: '',
      serverId: '',
      pointValueType: '',
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
            name="pointValueName"
            label={t('table.pointValueName')}
            placeholder={t('common.pleaseInput', { field: t('table.pointValueName') })}
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
            name="pointValueType"
            label={t('table.pointValueType')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              {
                label: t('table.fixedPipValue'),
                value: '1',
              },
              {
                label: t('table.floatingPipValue'),
                value: '2',
              },
            ]}
          />

          <div className="flex justify-end gap-4">
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
