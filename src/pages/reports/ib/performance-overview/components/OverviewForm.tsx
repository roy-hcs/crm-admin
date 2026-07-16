import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { useServerIdAutoFill } from '@/hooks/useServerIdAutoFill';

import { FormSelect } from '@/components/form/FormSelect';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AgencyPreforOverviewParams, RebateLevelItem, ServerItem } from '@/api/hooks/system/types';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { formatDate } from '@/lib/utils';
import { RrhForm } from '@/components/form/RrhForm';
import { BasicParams } from '@/api/types';
import { FormCrmUserSingleSelect } from '@/components/form/FormCrmUserSingleSelect';

type FormData = {
  serverId: string;
  beginTime: { from: string; to: string };
  userId: string;
  rebateLevelId: string;
};

export const OverviewForm = ({
  setCommonParams,
  reset,
  commonParams,
  setServerId,
  serverOptions,
  rebateLevelOptions,
  initialServerId,
}: {
  setCommonParams: Dispatch<
    SetStateAction<Omit<AgencyPreforOverviewParams, 'serverId' | 'serverType' | keyof BasicParams>>
  >;
  reset: () => void;
  commonParams: Omit<AgencyPreforOverviewParams, 'serverId' | 'serverType' | keyof BasicParams>;
  setServerId: (id: string) => void;
  serverOptions: ServerItem[];
  rebateLevelOptions: RebateLevelItem[];
  initialServerId?: string;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      serverId: initialServerId || '',
      beginTime: {
        from: commonParams.beginTime ? formatDate(commonParams.beginTime) : '',
        to: commonParams.endTime ? formatDate(commonParams.endTime) : '',
      },
      rebateLevelId: commonParams.rebateLevelId || '',
      userId: commonParams.userId || '',
    },
  });

  useServerIdAutoFill(form, initialServerId, serverOptions);

  const onSubmit = (data: FormData) => {
    reset();
    setCommonParams({
      userId: data.userId,
      beginTime: data.beginTime.from,
      endTime: data.beginTime.to,
      rebateLevelId: data.rebateLevelId,
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

      <FormCrmUserSingleSelect
        verticalLabel
        name="userId"
        label={t('CRMAccountPage.NameOrAccountId')}
        placeholder={t('customerTracking.nameOrAccountId')}
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
        name="rebateLevelId"
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
