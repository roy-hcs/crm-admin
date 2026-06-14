import { RrhButton } from '@/components/common/RrhButton';
import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';
import { TableContentWrapper } from '@/components/common/TableContentWrapper';
import FormDateRangeInput from '@/components/form/FormDateRangeInput';
import { RrhForm } from '@/components/form/RrhForm';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RefreshCcw, Search } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type SearchFormValues = {
  positionTime: { from: string; to: string };
  historyTime: { from: string; to: string };
};

export type ActiveTable = 'position' | 'history';

type TradeOrdersSwitchTablesProps = {
  activeTable: ActiveTable;
  onActiveTableChange: (value: ActiveTable) => void;
  form: UseFormReturn<SearchFormValues>;
  onSubmit: (values: SearchFormValues) => void;
  onReset: () => void;
  positionTimeLabel: string;
  historyTimeLabel: string;
  positionTitle: string;
  historyTitle: string;
  positionActions: React.ReactNode;
  historyActions: React.ReactNode;
  positionTable: React.ReactNode;
  historyTable: React.ReactNode;
};

export function TradeOrdersSwitchTables({
  activeTable,
  onActiveTableChange,
  form,
  onSubmit,
  onReset,
  positionTimeLabel,
  historyTimeLabel,
  positionTitle,
  historyTitle,
  positionActions,
  historyActions,
  positionTable,
  historyTable,
}: TradeOrdersSwitchTablesProps) {
  const { t } = useTranslation();

  return (
    <div className="grid min-w-0 gap-4">
      <div className="rounded-lg border p-4">
        <RrhSwitchGroup
          value={activeTable}
          switchItems={[
            { value: 'position', label: t('positionOrderPage.positionOrder') },
            { value: 'history', label: t('tradingHistoryPage.tradingHistory') },
          ]}
          onValueChange={value => {
            if (value === 'position' || value === 'history') {
              onActiveTableChange(value);
            }
          }}
        />
      </div>

      <RrhForm
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={onReset}
        className="grid gap-4 rounded-lg border p-4"
      >
        {activeTable === 'position' ? (
          <FormField
            name="positionTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel>{positionTimeLabel}</FormLabel>
                <FormControl>
                  <FormDateRangeInput name="positionTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            name="historyTime"
            render={() => (
              <FormItem className="flex flex-col gap-2 text-sm">
                <FormLabel>{historyTimeLabel}</FormLabel>
                <FormControl>
                  <FormDateRangeInput name="historyTime" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2">
          <RrhButton type="reset" variant="outline">
            <RefreshCcw className="size-3.5" />
            <span>{t('common.Reset')}</span>
          </RrhButton>
          <RrhButton type="submit">
            <Search className="size-3.5" />
            <span>{t('common.Search')}</span>
          </RrhButton>
        </div>
      </RrhForm>

      {activeTable === 'position' ? (
        <TableContentWrapper>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium">{positionTitle}</div>
            {positionActions}
          </div>
          {positionTable}
        </TableContentWrapper>
      ) : (
        <TableContentWrapper>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium">{historyTitle}</div>
            {historyActions}
          </div>
          {historyTable}
        </TableContentWrapper>
      )}
    </div>
  );
}
