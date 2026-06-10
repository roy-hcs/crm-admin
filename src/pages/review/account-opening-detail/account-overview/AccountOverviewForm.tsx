import { RrhButton } from '@/components/common/RrhButton';

import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { BasicParams } from '@/api/types';
import { CrmUserDealAccountListParams } from '@/api/hooks/review';
import { FormInput } from '@/components/form/FormInput';
import { RrhForm } from '@/components/form/RrhForm';

type FormData = {
  login: string;
  userId: string;
};

export const AccountOverviewForm = ({
  setOtherParams,
  loading,
  reset,
  otherParams,
}: {
  setOtherParams: Dispatch<
    SetStateAction<Omit<CrmUserDealAccountListParams, 'params' | keyof BasicParams>>
  >;
  loading: boolean;
  reset: () => void;
  otherParams: Omit<CrmUserDealAccountListParams, 'params' | keyof BasicParams>;
}) => {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    defaultValues: {
      login: otherParams.login ? otherParams.login : '',
      userId: '',
    },
  });

  const onSubmit = (data: FormData) => {
    reset();
    setOtherParams({
      login: data.login,
      userId: data.userId,
    });
  };
  const onReset = () => {
    reset();
    form.reset({
      login: '',
      userId: '',
    });
  };
  return (
    <RrhForm
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={onReset}
      onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          if (e.target instanceof HTMLTextAreaElement) return;

          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }
      }}
      className="flex flex-col gap-4 overflow-auto px-4 pt-4 pb-20 md:px-12 md:pt-12"
    >
      <FormInput
        name="login"
        label={t('table.tradingAccount')}
        placeholder={t('common.pleaseInput', { field: t('table.tradingAccount') })}
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
    </RrhForm>
  );
};
