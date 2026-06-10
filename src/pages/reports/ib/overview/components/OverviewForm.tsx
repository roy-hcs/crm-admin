import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RebateLevelItem, ServerItem } from '@/api/hooks/system/types';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { formatDate } from '@/lib/utils';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  serverId: string;
  userName: string;
  email: string;
  beginTime: { from: string; to: string };
  level: string;
};

export const OverviewForm = ({
  setParams,
  reset,
  params,
  setServerId,
  serverOptions,
  rebateLevelOptions,
  initialServerId,
}: {
  setParams: Dispatch<
    SetStateAction<{
      userName: string;
      email: string;
      beginTime: string;
      endTime: string;
      level: string;
    }>
  >;
  reset: () => void;
  params: {
    userName: string;
    email: string;
    beginTime: string;
    endTime: string;
    level: string;
  };
  setServerId: (id: string) => void;
  serverOptions: ServerItem[];
  rebateLevelOptions: RebateLevelItem[];
  initialServerId?: string;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      serverId: initialServerId || '',
      userName: params.userName || '',
      email: params.email || '',
      beginTime: {
        from: params.beginTime || '',
        to: params.endTime || '',
      },
      level: params.level || '',
    },
  });

  if (!form.getValues('serverId') && (initialServerId || serverOptions[0])) {
    const auto = initialServerId || serverOptions[0]?.id || '';
    if (auto) form.setValue('serverId', auto, { shouldDirty: false, shouldTouch: false });
  }

  const onSubmit = (data: FormData) => {
    reset();
    setParams({
      userName: data.userName,
      email: data.email,
      beginTime: formatDate(data.beginTime.from),
      endTime: formatDate(data.beginTime.to),
      level: data.level,
    });
    setServerId(data.serverId);
  };

  const onReset = () => {
    setServerId(initialServerId || '');
    reset();
    form.reset();
  };

  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <RrhServerSelector serverOptions={serverOptions} />
      <FormInput
        name="userName"
        label={t('CRMAccountPage.NameOrAccountId')}
        placeholder={t('customerTracking.nameOrAccountId')}
      />
      <FormInput
        name="email"
        label={t('customerTracking.email') + ':'}
        placeholder={t('customerTracking.enteremail')}
      />
      <FormField
        name="beginTime"
        render={() => (
          <FormItem className="flex flex-col gap-2 text-sm">
            <FormLabel className="basis-3/12">{t('customerTracking.time') + ':'}</FormLabel>
            <FormControl className="basis-9/12">
              <FormDateRangeInput name="beginTime" control={form.control} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormSelect
        verticalLabel
        name="level"
        label={t('customerTracking.levelName') + ':'}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={rebateLevelOptions.map(item => ({ label: item.levelName, value: item.id }))}
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
    </RrhForm>
  );
};
