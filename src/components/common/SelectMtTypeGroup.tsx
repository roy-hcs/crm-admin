import { useMtRebateBaseTypeList } from '@/api/hooks/rebate';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useOperateTypeGroupSymbols } from '@/hooks/useOpearteTypeGroupSymbols';
import { cn } from '@/lib/utils';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PathGroup } from './PathGroup';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { useState } from 'react';

export const SelectMtTypeGroup = ({
  field,
  verticalLabel = false,
  optional = false,
  serverId = '',
  defaultValue,
}: {
  field: ControllerRenderProps<FieldValues, 'typeName'>;
  verticalLabel?: boolean;
  optional?: boolean;
  serverId?: string;
  defaultValue?: string;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { data: mtServerList, isLoading } = useMtRebateBaseTypeList(serverId || '', {
    enabled: !!serverId && open,
  });
  const { toggleSymbol, togglePath, toggleAll, getSelectedSymbolsString, selectionMap } =
    useOperateTypeGroupSymbols(mtServerList, defaultValue);
  const OperationBtns = ({ path }: { path: string }) => {
    const tolgee = (selectAll: boolean) => {
      if (path === 'all') {
        toggleAll(selectAll);
      } else {
        togglePath(path, selectAll);
      }
    };
    return (
      <div className="flex items-center gap-2">
        <RrhButton
          variant="ghost"
          size="sm"
          className="p-0"
          onClick={() => {
            toggleAll(true);
          }}
        >
          {t('common.selectAll')}
        </RrhButton>
        <div>|</div>
        <RrhButton
          variant="ghost"
          size="sm"
          className="p-0"
          onClick={() => {
            tolgee(false);
          }}
        >
          {t('common.Reset')}
        </RrhButton>
      </div>
    );
  };
  const onConfirm = () => {
    field.onChange(getSelectedSymbolsString());
    setOpen(false);
  };
  return (
    <FormItem>
      <div className={cn('text-foreground text-sm', verticalLabel ? '' : 'flex items-center')}>
        <FormLabel className={cn(verticalLabel ? 'mb-2' : 'basis-3/12')}>
          {`${t('table.rebateType')}${optional ? ` (${t('common.optional')})` : ''}`}
        </FormLabel>
        <FormControl>
          <RrhDialog
            variant="large"
            title={t('common.selectField', { field: t('table.typeGroup') })}
            open={open}
            onOpenChange={isOpen => {
              if (!serverId) return;
              setOpen(isOpen);
            }}
            trigger={
              <div
                className={cn(
                  'flex h-9 basis-9/12 items-center rounded-md border',
                  verticalLabel ? 'w-full' : '',
                  !serverId && 'cursor-not-allowed opacity-50',
                )}
              >
                <Input
                  className="flex-1 border-0 ring-0 outline-0"
                  type="text"
                  value={getSelectedSymbolsString() || defaultValue}
                  readOnly
                  disabled={!serverId}
                  placeholder={t('common.pleaseSelect')}
                />
                <RrhButton
                  variant="ghost"
                  className="rounded-l-none"
                  type="button"
                  disabled={!serverId}
                >
                  {t('common.select')}
                </RrhButton>
              </div>
            }
            onConfirm={onConfirm}
          >
            {isLoading ? (
              <div className="flex h-100 items-center justify-center">
                <RrhCircleLoading />
              </div>
            ) : (
              <div className="relative overflow-y-auto">
                <div className="flex items-center justify-between">
                  <div>{t('ProductGroup.selectTypeNameBelow')}</div>
                  <OperationBtns path="all" />
                </div>
                <div>{t('ProductGroup.selectTypeNameDesc')}</div>
                <div>
                  {mtServerList?.map(item => (
                    <PathGroup
                      key={item.path}
                      path={item.path}
                      symbols={item.symbols}
                      pathSelection={selectionMap.get(item.path)}
                      toggleSymbol={toggleSymbol}
                      togglePath={togglePath}
                    />
                  ))}
                </div>
              </div>
            )}
          </RrhDialog>
        </FormControl>
        <FormMessage />
      </div>
    </FormItem>
  );
};
