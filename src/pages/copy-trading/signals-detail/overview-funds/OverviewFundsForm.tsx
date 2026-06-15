import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RrhForm } from '@/components/form/RrhForm';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { FormSelect } from '@/components/form/FormSelect';

const formSchema = z.object({
  opeTypeList: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export const OverviewFundsForm = ({
  setOtherParams,
  reset,
  otherParams,
}: {
  setOtherParams: Dispatch<SetStateAction<{ opeTypeList: string }>>;
  reset: (resetFilter?: boolean) => void;
  otherParams: {
    opeTypeList: string;
  };
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      opeTypeList: otherParams.opeTypeList || '',
    },
  });

  useEffect(() => {
    form.setValue('opeTypeList', otherParams.opeTypeList || '', {
      shouldDirty: false,
      shouldTouch: false,
    });
  }, [form, otherParams.opeTypeList]);

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      opeTypeList: data.opeTypeList,
    });
  };
  const onReset = () => {
    reset(true);
    setOtherParams({
      opeTypeList: '',
    });
    form.reset({
      opeTypeList: '',
    });
  };

  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <FormSelect
        name="opeTypeList"
        label={t('table.operationType')}
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={[
          {
            label: t('common.all'),
            value: '1,2,3,4,5,6',
          },
          {
            label: t('table.Deposit'),
            value: '1,3',
          },
          {
            label: t('table.Withdrawal'),
            value: '2,4',
          },
          {
            label: t('table.creditAmountDeposit'),
            value: '5',
          },
        ]}
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
