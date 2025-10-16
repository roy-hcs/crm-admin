import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { RrhButton } from '@/components/common/RrhButton';
import { RefreshCcw, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';

type FormData = {
  menuName: string;
  menuState: string;
};
export const MenuForm = ({
  setMenuName,
  setMenuState,
}: {
  setMenuName: Dispatch<SetStateAction<string>>;
  setMenuState: Dispatch<SetStateAction<string>>;
}) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      menuName: '',
      menuState: '',
    },
  });
  const onSubmit = (data: FormData) => {
    setMenuName(data.menuName);
    setMenuState(data.menuState === 'all' ? '' : data.menuState);
  };
  const onReset = () => {
    setMenuName('');
    setMenuState('');
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
            name="menuName"
            label={t('menuManagement.menuName')}
            placeholder={t('common.pleaseInput', {
              field: t('menuManagement.menuName'),
            })}
          />
          <FormSelect
            verticalLabel
            name="menuState"
            label={t('menuManagement.menuStatus')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { label: t('table.all'), value: 'all' },
              { label: t('table.show'), value: '0' },
              { label: t('table.hide'), value: '1' },
            ]}
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
