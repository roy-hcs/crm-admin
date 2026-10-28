import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useForm } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { toast } from 'sonner';
import { RrhButton } from '@/components/common/RrhButton';
import { Plus, RefreshCcw } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { ExchangeRateItem } from '@/api/hooks/setting/types';
import {
  useAddExchangeRate,
  useCurrencyList,
  useEditExchangeRate,
  useLatestExchangePrice,
} from '@/api/hooks/setting/payment';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  applyInputNormalizer,
  normalizePositiveIntegerInput,
} from '@/pages/marketing/shared/formValueUtils';

type FormValues = {
  sCurrency: string;
  tCurrency: string;
  updateType: string;
  marketPrice?: string;
  buyRateFloat?: string;
  inRate?: string;
  sellRateRise?: string;
  outRate?: string;
};

export const ExchangeRateDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  mode,
  item,
  trigger,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  mode: 'add' | 'edit';
  item?: ExchangeRateItem;
  trigger?: boolean;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;

  const { mutateAsync: add, isPending } = useAddExchangeRate();
  const { mutateAsync: edit, isPending: isEditPending } = useEditExchangeRate();
  const { mutateAsync: fetchLatestPrice, isPending: isLatestPriceLoading } =
    useLatestExchangePrice();

  // 货币下拉选项来自货币设置中启用的货币
  const { data: currencyRes } = useCurrencyList(
    { pageNum: 1, pageSize: 1000, orderByColumn: '', isAsc: 'asc' },
    { enabled: open },
  );
  const currencyOptions = useMemo(
    () =>
      (currencyRes?.rows || [])
        .filter(row => row.status === 1)
        .map(row => ({ value: row.currencyAbbr, label: row.currencyAbbr })),
    [currencyRes],
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
        sCurrency: z
          .string()
          .min(1, t('rules.required', { field: t('exchangeRateSettingPage.sCurrency') })),
        tCurrency: z
          .string()
          .min(1, t('rules.required', { field: t('exchangeRateSettingPage.tCurrency') })),
        updateType: z
          .string()
          .min(1, t('rules.required', { field: t('exchangeRateSettingPage.updateType') })),
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
      sCurrency: '',
      tCurrency: '',
      updateType: '1',
      marketPrice: '',
      buyRateFloat: '',
      inRate: '',
      sellRateRise: '',
      outRate: '',
    },
  });

  const sCurrency = form.watch('sCurrency');
  const tCurrency = form.watch('tCurrency');

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && item) {
      form.reset({
        sCurrency: item.sCurrency || '',
        tCurrency: item.tCurrency || '',
        updateType: String(item.updateType ?? '1'),
        marketPrice:
          item.marketPrice === null || item.marketPrice === undefined
            ? ''
            : String(item.marketPrice),
        buyRateFloat:
          item.buyRateFloat === null || item.buyRateFloat === undefined
            ? ''
            : String(item.buyRateFloat),
        inRate: item.inRate === null || item.inRate === undefined ? '' : String(item.inRate),
        sellRateRise:
          item.sellRateRise === null || item.sellRateRise === undefined
            ? ''
            : String(item.sellRateRise),
        outRate: item.outRate === null || item.outRate === undefined ? '' : String(item.outRate),
      });
      return;
    }

    form.reset({
      sCurrency: '',
      tCurrency: '',
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

  const onFetchLatestPrice = async () => {
    if (!sCurrency || !tCurrency) {
      toast.error(t('exchangeRateSettingPage.latestPriceNeedPair'));
      return;
    }
    try {
      const res = await fetchLatestPrice({ sCurrency, tCurrency });
      if (res.code === 0 && res.data !== null && res.data !== undefined) {
        form.setValue('marketPrice', String(res.data));
        toast.success(t('exchangeRateSettingPage.latestPriceSuccess'));
      } else {
        toast.error(t('exchangeRateSettingPage.latestPriceError'));
      }
    } catch {
      toast.error(t('exchangeRateSettingPage.latestPriceError'));
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const params = {
        updateType: Number(data.updateType),
        marketPrice: toOptionalNumber(data.marketPrice),
        buyRateFloat: toOptionalNumber(data.buyRateFloat),
        inRate: toOptionalNumber(data.inRate),
        sellRateRise: toOptionalNumber(data.sellRateRise),
        outRate: toOptionalNumber(data.outRate),
      };
      const res =
        mode === 'add'
          ? await add({
              ...params,
              sCurrency: data.sCurrency,
              tCurrency: data.tCurrency,
            })
          : await edit({
              ...params,
              id: item?.id,
              sCurrency: data.sCurrency,
              tCurrency: data.tCurrency,
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
          ? t('common.addField', { field: t('exchangeRateSettingPage.title') })
          : t('common.modify', { field: t('exchangeRateSettingPage.title') })
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
          name="sCurrency"
          label={t('exchangeRateSettingPage.sCurrency')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={currencyOptions}
          disabled={mode === 'edit'}
        />
        <FormSelect
          name="tCurrency"
          label={t('exchangeRateSettingPage.tCurrency')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={currencyOptions}
          disabled={mode === 'edit'}
        />
        <FormSelect
          name="updateType"
          label={t('exchangeRateSettingPage.updateType')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={updateTypeOptions}
        />
        <div className="flex items-end gap-2">
          <FormInput
            name="marketPrice"
            label={t('exchangeRateSettingPage.marketPrice')}
            placeholder={t('common.pleaseInput', {
              field: t('exchangeRateSettingPage.marketPrice'),
            })}
            className="flex-1"
          />
          <RrhButton
            variant="outline"
            type="button"
            className="mb-[2px] flex items-center gap-1"
            onClick={onFetchLatestPrice}
            disabled={isLatestPriceLoading}
          >
            <RefreshCcw className="size-3.5" />
            {t('exchangeRateSettingPage.fetchLatestPrice')}
          </RrhButton>
        </div>
        <FormInput
          name="buyRateFloat"
          label={t('exchangeRateSettingPage.buyRateFloat')}
          placeholder={t('exchangeRateSettingPage.buyRateFloatPlaceholder')}
          onInput={event =>
            applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
          }
        />
        <FormInput
          name="inRate"
          label={t('exchangeRateSettingPage.inRate')}
          placeholder={t('common.pleaseInput', { field: t('exchangeRateSettingPage.inRate') })}
        />
        <FormInput
          name="sellRateRise"
          label={t('exchangeRateSettingPage.sellRateRise')}
          placeholder={t('exchangeRateSettingPage.sellRateRisePlaceholder')}
          onInput={event =>
            applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
          }
        />
        <FormInput
          name="outRate"
          label={t('exchangeRateSettingPage.outRate')}
          placeholder={t('common.pleaseInput', { field: t('exchangeRateSettingPage.outRate') })}
        />
      </RrhForm>
    </RrhDialog>
  );
};
