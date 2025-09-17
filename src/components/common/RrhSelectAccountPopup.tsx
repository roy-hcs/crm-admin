import { RrhCascader } from '@/components/common/RrhCascader';
import { RrhDialog } from '@/components/common/RrhDialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useCustomerRelationsPostList } from '@/api/hooks/system/system';
import { AccountDialog } from '@/pages/account/CRMAccounts/components/AccountDialog';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { CrmUserItem } from '@/api/hooks/system/types';
import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import { RrhButton } from './RrhButton';

interface CascaderOption {
  value: string;
  label: string;
  isLeaf?: boolean;
  children?: CascaderOption[];
  loading?: boolean;
}
export const RrhSelectAccountsPopup = ({
  field,
  verticalLabel = false,
}: {
  field: ControllerRenderProps<FieldValues, 'accounts'>;
  verticalLabel?: boolean;
}) => {
  const [selectedUser, setSelectedUser] = useState<CrmUserItem | null>(null);
  const [options, setOptions] = useState<CascaderOption[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [selectedOptionLabel, setSelectedOptionLabel] = useState<string>('');
  const { data: relations, isLoading } = useCustomerRelationsPostList(
    selectedId ? { userId: selectedId } : null,
  );
  const { t } = useTranslation();

  const updateOptionChildren = useCallback(
    (
      options: CascaderOption[],
      targetValue: string,
      children: CascaderOption[],
    ): CascaderOption[] => {
      return options.map(option => {
        if (option.value === targetValue) {
          return { ...option, children, loading: false };
        }
        if (option.children) {
          return {
            ...option,
            children: updateOptionChildren(option.children, targetValue, children),
          };
        }
        return option;
      });
    },
    [],
  );

  const loadData = (selectedOptions: CascaderOption[]): Promise<void> => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    setOptions(options => updateOptionChildren(options, targetOption.value, []));
    return new Promise<void>(resolve => {
      setSelectedId(targetOption.value);
      setTimeout(() => {
        resolve();
      }, 100);
    });
  };

  useEffect(() => {
    if (relations && !selectedId) {
      setOptions(
        relations
          .map(item => ({
            value: item.id,
            label: item.parentName || 'Unnamed',
            isLeaf: !item.hasChildren,
          }))
          .filter(item => {
            if (selectedUser) {
              return item.value === selectedUser.id;
            }
            return true;
          }),
      );
    }
  }, [relations, selectedId, selectedUser]);

  useEffect(() => {
    if (relations && selectedId) {
      const children = relations.map(child => ({
        value: child.id,
        label: child.parentName || 'Unnamed',
        isLeaf: !child.hasChildren,
      }));
      setOptions(options => updateOptionChildren(options, selectedId, children));
    }
  }, [relations, selectedId, updateOptionChildren]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onChange = (value: string[], selectedOptions: CascaderOption[]) => {
    setSelectedOptionId(value[value.length - 1]);
    const label = selectedOptions?.[selectedOptions.length - 1]?.label;
    setSelectedOptionLabel(label ? `${label}-${t('common.subordinate')}` : '');
  };

  return (
    <FormItem className={cn('flex text-sm', verticalLabel ? 'flex-col items-start gap-2' : '')}>
      <FormLabel className="basis-3/12 text-[#757F8D]">
        {t('CRMAccountPage.AccountRange')}:
      </FormLabel>
      <FormControl className="basis-9/12">
        <RrhDialog
          title={t('CRMAccountPage.SelectSuperiorRange')}
          className="flex min-h-1/2 min-w-1/2 flex-col"
          trigger={
            <div className="h-9 w-full shrink-0 basis-9/12 cursor-pointer rounded-md border p-2 text-[#757F8D]">
              {selectedOptionLabel ? selectedOptionLabel : t('common.pleaseSelect')}
            </div>
          }
          cancelText={t('common.Cancel')}
          confirmText={t('common.Confirm')}
          onConfirm={() => {
            const accountData = {
              id: selectedOptionId,
              label: selectedOptionLabel,
            };
            field.onChange(JSON.stringify(accountData));
          }}
        >
          <form className="flex items-center gap-4 text-sm" onSubmit={onSubmit}>
            <Input
              type="text"
              disabled
              value={selectedUser?.userName || ''}
              className="h-9 border px-2"
              placeholder="请选择CRM"
            />
            <AccountDialog
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              title={t('CRMAccountPage.SelectSuperiorRange')}
              trigger={
                <RrhButton
                  type="button"
                  className="flex h-9 cursor-pointer items-center gap-1 border bg-[#1E1E1E] px-6 text-white"
                >
                  {t('common.select')}
                </RrhButton>
              }
              onConfirm={() => {
                field.onChange('');
              }}
            />
            <RrhButton
              type="reset"
              className="flex h-9 cursor-pointer items-center gap-1 border bg-white px-6 text-[#1E1E1E]"
              onClick={() => setSelectedUser(null)}
            >
              {t('common.Reset')}
            </RrhButton>
          </form>
          <div className="flex-1">
            <RrhCascader
              options={options}
              loadData={loadData}
              onChange={onChange}
              notFoundContent={isLoading ? t('common.loading') : t('common.NoData')}
              displayRender={labels => labels[labels.length - 1]}
              changeOnSelect
            />
          </div>
        </RrhDialog>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
