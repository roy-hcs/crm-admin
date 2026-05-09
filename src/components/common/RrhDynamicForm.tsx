import { Fragment, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ColumnItem } from '@/api/hooks/agent/types';
import { Country } from '@/api/hooks/system';
import { RrhForm } from '@/components/form/RrhForm';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { FormDateInput } from '@/components/form/FormDateInput';
import { FormField } from '@/components/ui/form';
import { UploadFile } from '@/pages/marketing/ads/components/components/UploadFile';
import { BaseOption } from '@/components/common/RrhSelect';
import { useTranslation } from 'react-i18next';
import { RrhButton } from './RrhButton';
import { RrhCircleLoading } from './RrhCircleLoading';

type FieldValue = string | string[] | Date | null;
type DynamicFormValues = Record<string, FieldValue>;

export interface SubmitValue {
  id: string;
  columnValue: string;
}

interface RrhDynamicFormProps {
  columns: ColumnItem[];
  type: 'read' | 'edit';
  countryList?: Country[];
  onSubmit?: (values: SubmitValue[]) => void;
  isPending?: boolean;
  onCancel?: () => void;
}

const CT = {
  Input: 1,
  Select: 2,
  MultiSelect: 3,
  Date: 4,
  Image: 5,
  CountrySelect: 6,
} as const;

function mapColumnOptions(options: ColumnItem['options']): BaseOption[] {
  return options.map(opt => ({ label: opt.optionName, value: opt.id }));
}

function mapCountryOptions(countries: Country[]): BaseOption[] {
  return countries.map(c => ({ label: c.countryName, value: c.id.toString() }));
}

function buildZodSchema(columns: ColumnItem[]) {
  const shape: Record<string, z.ZodType<FieldValue>> = {};

  for (const col of columns) {
    const key = col.id.toString();
    switch (col.columnType) {
      case CT.MultiSelect: {
        const base = z.array(z.string());
        shape[key] = col.require ? base.min(1) : base;
        break;
      }
      case CT.Date: {
        const base = z.date().nullable();
        shape[key] = col.require ? base.refine((v): v is Date => v !== null) : base;
        break;
      }
      default: {
        const base = z.string();
        shape[key] = col.require ? base.min(1) : base;
        break;
      }
    }
  }

  return z.object(shape);
}

function buildDefaultValues(columns: ColumnItem[], countryList: Country[]): DynamicFormValues {
  const values: DynamicFormValues = {};
  for (const col of columns) {
    const key = col.id.toString();
    switch (col.columnType) {
      case CT.MultiSelect:
        values[key] = col.columnValue ? col.columnValue.split(',') : [];
        break;
      case CT.Date:
        values[key] = col.columnValue ? new Date(col.columnValue) : null;
        break;
      case CT.CountrySelect: {
        if (col.columnValue) {
          const country = countryList.find(c => c.countryName === col.columnValue);
          values[key] = country ? country.id.toString() : col.columnValue;
        } else {
          values[key] = '';
        }
        break;
      }
      default:
        values[key] = col.columnValue ?? '';
        break;
    }
  }
  return values;
}

function formatForSubmit(value: FieldValue): string {
  if (value === null) return '';
  if (Array.isArray(value)) return value.join(',');
  if (value instanceof Date) return format(value, 'yyyy-MM-dd');
  return value;
}

function getReadDisplayValue(col: ColumnItem, countryList: Country[]): string {
  switch (col.columnType) {
    case CT.Select: {
      const selected = col.options.find(opt => opt.id === col.columnValue);
      return selected?.optionName ?? col.columnValue ?? '';
    }
    case CT.MultiSelect: {
      if (!col.columnValue) return '';
      return col.columnValue
        .split(',')
        .map(id => col.options.find(opt => opt.id === id)?.optionName ?? '')
        .filter(Boolean)
        .join(', ');
    }
    case CT.Date: {
      if (!col.columnValue) return '';
      try {
        return format(new Date(col.columnValue), 'yyyy-MM-dd');
      } catch {
        return col.columnValue;
      }
    }
    case CT.CountrySelect: {
      const selected =
        countryList.find(c => c.id.toString() === col.columnValue) ??
        countryList.find(c => c.countryName === col.columnValue);
      return selected?.countryName ?? col.columnValue ?? '';
    }
    default:
      return col.columnValue ?? '';
  }
}

export const RrhDynamicForm = ({
  columns,
  type,
  countryList = [],
  onSubmit,
  isPending,
  onCancel,
}: RrhDynamicFormProps) => {
  const { t } = useTranslation();
  const sorted = useMemo(() => [...columns].sort((a, b) => a.sort - b.sort), [columns]);

  const schema = useMemo(() => buildZodSchema(sorted), [sorted]);
  const defaultValues = useMemo(
    () => buildDefaultValues(sorted, countryList),
    [sorted, countryList],
  );

  const form = useForm<DynamicFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = form.handleSubmit(values => {
    onSubmit?.(
      sorted.map(col => ({
        id: col.id.toString(),
        columnValue: formatForSubmit(values[col.id.toString()]),
      })),
    );
  });

  const renderRead = (col: ColumnItem) => {
    if (col.columnType === CT.Image) {
      return (
        <div className="text-foreground flex flex-col items-start gap-2 space-y-2 text-sm">
          <div className="leading-5">
            {col.columnName}
            {col.require ? '' : ` (${t('common.optional')})`}
          </div>
          {col.columnValue ? (
            <img
              src={col.columnValue}
              alt={col.columnName}
              className="size-12 rounded-sm object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    }

    const display = getReadDisplayValue(col, countryList);
    return (
      <div className="text-foreground flex flex-col items-start gap-2 text-sm">
        <div className="basis-3/12 leading-5">
          {col.columnName}
          {col.require ? '' : ` (${t('common.optional')})`}
        </div>
        <div className="basis-9/12">
          {display || <span className="text-muted-foreground">-</span>}
        </div>
      </div>
    );
  };

  const renderEdit = (col: ColumnItem) => {
    const name = col.id.toString();
    const phInput = t('common.pleaseInput', { field: col.columnName });
    const phSelect = `${t('common.pleaseSelect')}${col.columnName}`;

    switch (col.columnType) {
      case CT.Input:
        return (
          <FormInput
            verticalLabel
            name={name}
            label={`${col.columnName}${col.require ? '' : ` (${t('common.optional')})`}`}
            placeholder={phInput}
          />
        );
      case CT.Select:
        return (
          <FormSelect
            verticalLabel
            name={name}
            label={`${col.columnName}${col.require ? '' : ` (${t('common.optional')})`}`}
            options={mapColumnOptions(col.options)}
            placeholder={phSelect}
          />
        );
      case CT.MultiSelect:
        return (
          <FormMultiSelect
            verticalLabel
            name={name}
            label={`${col.columnName}${col.require ? '' : ` (${t('common.optional')})`}`}
            options={mapColumnOptions(col.options)}
            placeholder={phSelect}
          />
        );
      case CT.Date:
        return (
          <FormDateInput
            name={name}
            label={`${col.columnName}${col.require ? '' : ` (${t('common.optional')})`}`}
            placeholder={phSelect}
          />
        );
      case CT.Image:
        return (
          <FormField
            name={name}
            control={form.control}
            render={({ field }) => (
              <UploadFile
                field={field}
                label={`${col.columnName}${col.require ? '' : ` (${t('common.optional')})`}`}
              />
            )}
          />
        );
      case CT.CountrySelect:
        return (
          <FormSelect
            verticalLabel
            name={name}
            label={`${col.columnName}${col.require ? '' : ` (${t('common.optional')})`}`}
            options={mapCountryOptions(countryList)}
            placeholder={phSelect}
            showRowValue={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <RrhForm
      form={form}
      onSubmit={handleSubmit}
      className="flex max-h-[75vh] flex-col gap-4 overflow-y-auto px-0.75"
    >
      {sorted.map(col => (
        <Fragment key={col.id}>{type === 'read' ? renderRead(col) : renderEdit(col)}</Fragment>
      ))}
      <div className="border-border bg-background absolute inset-x-0 bottom-0 flex justify-end gap-4 rounded-b-lg border-t p-6">
        {type === 'edit' && (
          <RrhButton
            type="button"
            variant="outline"
            onClick={() => {
              onCancel?.();
            }}
          >
            {t('common.Cancel')}
          </RrhButton>
        )}
        <RrhButton type="submit">{t('common.Confirm')}</RrhButton>
      </div>
      {isPending && (
        <div className="bg-background/60 absolute inset-0">
          <RrhCircleLoading />
        </div>
      )}
    </RrhForm>
  );
};
