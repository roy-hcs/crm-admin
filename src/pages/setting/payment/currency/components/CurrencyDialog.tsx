import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useForm } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { toast } from 'sonner';
import { RrhButton } from '@/components/common/RrhButton';
import { Plus } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormTextarea } from '@/components/form/FormTextarea';
import { CurrencyItem } from '@/api/hooks/setting/types';
import { useAddCurrency, useEditCurrency } from '@/api/hooks/setting/payment';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  applyInputNormalizer,
  normalizePositiveIntegerInput,
} from '@/pages/marketing/shared/formValueUtils';

type FormValues = {
  currencyType: string;
  currencyAbbr: string;
  currencyNameChn?: string;
  currencyNameEng?: string;
  network?: string;
  decimalPrecision?: string;
  sort?: string;
  status?: string;
  currencyRemark?: string;
  // 新增时的默认汇率
  currencyPair?: string;
  updateType?: string;
  marketPrice?: string;
  buyRateFloat?: string;
  inRate?: string;
  sellRateRise?: string;
  outRate?: string;
};

export const CurrencyDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  mode,
  item,
  trigger,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  mode: 'add' | 'edit';
  item?: CurrencyItem;
  trigger?: boolean;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;

  const { mutateAsync: add, isPending } = useAddCurrency();
  const { mutateAsync: edit, isPending: isEditPending } = useEditCurrency();

  const currencyTypeOptions = useMemo(
    () => [
      { value: '1', label: t('currencySettingPage.currencyTypeFiat') },
      { value: '2', label: t('currencySettingPage.currencyTypeCrypto') },
    ],
    [t],
  );

  const updateTypeOptions = useMemo(
    () => [
      { value: '1', label: t('exchangeRateSettingPage.updateTypeManual') },
      { value: '2', label: t('exchangeRateSettingPage.updateTypeAuto') },
    ],
    [t],
  );

  const schema = useMemo(
    () =>
      z.object({
        currencyType: z
          .string()
          .min(1, t('rules.required', { field: t('currencySettingPage.currencyType') })),
        currencyAbbr: z
          .string()
          .min(1, t('rules.required', { field: t('currencySettingPage.currencyAbbr') })),
        currencyNameChn: z.string().optional(),
        currencyNameEng: z.string().optional(),
        network: z.string().optional(),
        decimalPrecision: z.string().optional(),
        sort: z.string().optional(),
        status: z.string().optional(),
        currencyRemark: z.string().optional(),
        currencyPair: z.string().optional(),
        updateType: z.string().optional(),
        marketPrice: z.string().optional(),
        buyRateFloat: z.string().optional(),
        inRate: z.string().optional(),
        sellRateRise: z.string().optional(),
        outRate: z.string().optional(),
      }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currencyType: '1',
      currencyAbbr: '',
      currencyNameChn: '',
      currencyNameEng: '',
      network: '',
      decimalPrecision: '',
      sort: '',
      status: '1',
      currencyRemark: '',
      currencyPair: '',
      updateType: '1',
      marketPrice: '',
      buyRateFloat: '',
      inRate: '',
      sellRateRise: '',
      outRate: '',
    },
  });

  const currencyType = form.watch('currencyType');

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && item) {
      form.reset({
        currencyType: String(item.currencyType ?? '1'),
        currencyAbbr: item.currencyAbbr || '',
        currencyNameChn: item.currencyNameChn || '',
        currencyNameEng: item.currencyNameEng || '',
        network: item.network || '',
        decimalPrecision: String(item.decimalPrecision ?? ''),
        sort: String(item.sort ?? ''),
        status: String(item.status ?? '1'),
        currencyRemark: item.currencyRemark || '',
        currencyPair: '',
        updateType: '1',
        marketPrice: '',
        buyRateFloat: '',
        inRate: '',
        sellRateRise: '',
        outRate: '',
      });
      return;
    }

    form.reset({
      currencyType: '1',
      currencyAbbr: '',
      currencyNameChn: '',
      currencyNameEng: '',
      network: '',
      decimalPrecision: '',
      sort: '',
      status: '1',
      currencyRemark: '',
      currencyPair: '',
      updateType: '1',
      marketPrice: '',
      buyRateFloat: '',
      inRate: '',
      sellRateRise: '',
      outRate: '',
    });
  }, [open, mode, item, form]);

  const onCancel = () => onClose(false);

  const onClose = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      form.reset();
    }
  };

  const toOptionalNumber = (value: string | undefined) =>
    value === undefined || value === '' ? undefined : Number(value);

  const onSubmit = async (data: FormValues) => {
    try {
      const params = {
        currencyType: Number(data.currencyType),
        currencyAbbr: data.currencyAbbr,
        currencyNameChn: data.currencyNameChn || undefined,
        currencyNameEng: data.currencyNameEng || undefined,
        network: data.network || undefined,
        decimalPrecision: toOptionalNumber(data.decimalPrecision),
        sort: toOptionalNumber(data.sort),
        currencyRemark: data.currencyRemark || undefined,
      };
      const res =
        mode === 'add'
          ? await add({
              ...params,
              // 新增货币时同步保存默认汇率
              currencyPair: `${data.currencyAbbr}/USDT`,
              updateType: Number(data.updateType || '1'),
              marketPrice: toOptionalNumber(data.marketPrice),
              buyRateFloat: toOptionalNumber(data.buyRateFloat),
              inRate: toOptionalNumber(data.inRate),
              sellRateRise: toOptionalNumber(data.sellRateRise),
              outRate: toOptionalNumber(data.outRate),
            })
          : await edit({
              ...params,
              id: item?.id || '',
              status: Number(data.status || '1'),
            });
      if (res.code === 0) {
        toast.success(t('common.success'));
        onClose(false);
      } else {
        toast.error(res.msg);
      }
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  return (
    <RrhDialog
      title={
        mode === 'add'
          ? t('common.addField', { field: t('currencySettingPage.title') })
          : t('common.modify', { field: t('currencySettingPage.title') })
      }
      trigger={
        mode === 'add' && trigger ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      isConfirmDisabled={isPending || isEditPending}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={form.handleSubmit(onSubmit)}
      variant="large"
      type="submit"
      formLoading={isPending || isEditPending}
    >
      <RrhForm
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
      >
        <FormSelect
          name="currencyType"
          label={t('currencySettingPage.currencyType')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={currencyTypeOptions}
          disabled={mode === 'edit'}
        />
        <FormInput
          name="currencyAbbr"
          label={t('currencySettingPage.currencyAbbr')}
          placeholder={t('common.pleaseInput', { field: t('currencySettingPage.currencyAbbr') })}
          disabled={mode === 'edit'}
        />
        <FormInput
          name="currencyNameChn"
          label={t('currencySettingPage.currencyNameChn')}
          placeholder={t('common.pleaseInput', { field: t('currencySettingPage.currencyNameChn') })}
        />
        <FormInput
          name="currencyNameEng"
          label={t('currencySettingPage.currencyNameEng')}
          placeholder={t('common.pleaseInput', { field: t('currencySettingPage.currencyNameEng') })}
        />
        {currencyType === '2' && (
          <FormInput
            name="network"
            label={t('currencySettingPage.network')}
            placeholder={t('common.pleaseInput', { field: t('currencySettingPage.network') })}
          />
        )}
        <FormInput
          name="decimalPrecision"
          label={t('currencySettingPage.decimalPrecision')}
          placeholder={t('common.pleaseInput', {
            field: t('currencySettingPage.decimalPrecision'),
          })}
          onInput={event =>
            applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
          }
        />
        <FormInput
          name="sort"
          label={t('table.sort')}
          placeholder={t('common.pleaseInput', { field: t('table.sort') })}
          onInput={event =>
            applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
          }
        />
        {mode === 'edit' && (
          <FormSelect
            name="status"
            label={t('table.status')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={[
              { value: '1', label: t('common.enable') },
              { value: '0', label: t('common.disable') },
            ]}
          />
        )}
        <div className="md:col-span-2">
          <FormTextarea
            name="currencyRemark"
            label={t('currencySettingPage.remark')}
            placeholder={t('common.pleaseInput', { field: t('currencySettingPage.remark') })}
          />
        </div>

        {mode === 'add' && currencyType === '1' && (
          <div className="rounded-md border p-4 md:col-span-2">
            <div className="mb-4 text-sm font-medium">{t('exchangeRateSettingPage.title')}</div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <FormInput
                name="currencyPair"
                label={t('exchangeRateSettingPage.currencyPair')}
                placeholder={t('common.pleaseInput', {
                  field: t('exchangeRateSettingPage.currencyPair'),
                })}
              />
              <FormSelect
                name="updateType"
                label={t('exchangeRateSettingPage.updateType')}
                placeholder={t('common.pleaseSelect')}
                showRowValue={false}
                options={updateTypeOptions}
              />
              <FormInput
                name="marketPrice"
                label={t('exchangeRateSettingPage.marketPrice')}
                placeholder={t('common.pleaseInput', {
                  field: t('exchangeRateSettingPage.marketPrice'),
                })}
              />
              <FormInput
                name="buyRateFloat"
                label={t('exchangeRateSettingPage.buyRateFloat')}
                placeholder={t('exchangeRateSettingPage.buyRateFloatPlaceholder')}
              />
              <FormInput
                name="inRate"
                label={t('exchangeRateSettingPage.inRate')}
                placeholder={t('common.pleaseInput', {
                  field: t('exchangeRateSettingPage.inRate'),
                })}
              />
              <FormInput
                name="sellRateRise"
                label={t('exchangeRateSettingPage.sellRateRise')}
                placeholder={t('exchangeRateSettingPage.sellRateRisePlaceholder')}
              />
              <FormInput
                name="outRate"
                label={t('exchangeRateSettingPage.outRate')}
                placeholder={t('common.pleaseInput', {
                  field: t('exchangeRateSettingPage.outRate'),
                })}
              />
            </div>
          </div>
        )}
      </RrhForm>
    </RrhDialog>
  );
};
