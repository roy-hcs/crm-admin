import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useForm, useFieldArray } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { toast } from 'sonner';
import { RrhButton } from '@/components/common/RrhButton';
import { Plus, Trash2 } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { WithdrawFeeItem } from '@/api/hooks/setting/types';
import { useCurrencyList, useSaveWithdrawFee } from '@/api/hooks/setting/payment';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

type SegmentValues = {
  startAmount?: string;
  endAmount?: string;
  withdrawFeeScale?: string;
  withdrawFeeFixed?: string;
  minWithdrawFee?: string;
  maxWithdrawFee?: string;
};

type FormValues = {
  name?: string;
  method: string;
  currencys?: string[];
  model: string;
  scheme: string;
  withdrawFeeScale?: string;
  withdrawFeeFixed?: string;
  minWithdrawFee?: string;
  maxWithdrawFee?: string;
  settingsItems: SegmentValues[];
};

const emptySegment: SegmentValues = {
  startAmount: '',
  endAmount: '',
  withdrawFeeScale: '',
  withdrawFeeFixed: '',
  minWithdrawFee: '',
  maxWithdrawFee: '',
};

export const WithdrawFeeDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  mode,
  item,
  trigger,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  mode: 'add' | 'edit';
  item?: WithdrawFeeItem;
  trigger?: boolean;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;

  const { mutateAsync: save, isPending } = useSaveWithdrawFee();

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

  const methodOptions = useMemo(
    () => [
      { value: '1', label: t('withdrawFeePage.methodInternationalWire') },
      { value: '2', label: t('withdrawFeePage.methodBankTransfer') },
      { value: '3', label: t('withdrawFeePage.methodSystem') },
      { value: '4', label: t('withdrawFeePage.methodQuick') },
      { value: '5', label: t('withdrawFeePage.methodThirdParty') },
      { value: '13', label: t('withdrawFeePage.methodPayId') },
    ],
    [t],
  );

  const schemeOptions = useMemo(
    () => [
      { value: '1', label: t('withdrawFeePage.schemeNormal') },
      { value: '2', label: t('withdrawFeePage.schemeLadder') },
      { value: '3', label: t('withdrawFeePage.schemeFree') },
    ],
    [t],
  );

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().optional(),
        method: z.string().min(1, t('rules.required', { field: t('withdrawFeePage.method') })),
        currencys: z.array(z.string()).optional(),
        model: z
          .string()
          .min(1, t('rules.required', { field: t('receiveAccountsPage.commissionMode') })),
        scheme: z.string().min(1, t('rules.required', { field: t('withdrawFeePage.scheme') })),
        withdrawFeeScale: z.string().optional(),
        withdrawFeeFixed: z.string().optional(),
        minWithdrawFee: z.string().optional(),
        maxWithdrawFee: z.string().optional(),
        settingsItems: z.array(
          z.object({
            startAmount: z.string().optional(),
            endAmount: z.string().optional(),
            withdrawFeeScale: z.string().optional(),
            withdrawFeeFixed: z.string().optional(),
            minWithdrawFee: z.string().optional(),
            maxWithdrawFee: z.string().optional(),
          }),
        ),
      }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      method: '1',
      currencys: [],
      model: '1',
      scheme: '1',
      withdrawFeeScale: '',
      withdrawFeeFixed: '',
      minWithdrawFee: '',
      maxWithdrawFee: '',
      settingsItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'settingsItems',
  });

  const model = form.watch('model');
  const scheme = form.watch('scheme');

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && item) {
      form.reset({
        name: item.name || '',
        method: String(item.method ?? '1'),
        currencys: item.currencys ? item.currencys.split(',').filter(Boolean) : [],
        model: String(item.model ?? '1'),
        scheme: String(item.scheme ?? '1'),
        withdrawFeeScale:
          item.withdrawFeeScale === null || item.withdrawFeeScale === undefined
            ? ''
            : String(item.withdrawFeeScale),
        withdrawFeeFixed:
          item.withdrawFeeFixed === null || item.withdrawFeeFixed === undefined
            ? ''
            : String(item.withdrawFeeFixed),
        minWithdrawFee:
          item.minWithdrawFee === null || item.minWithdrawFee === undefined
            ? ''
            : String(item.minWithdrawFee),
        maxWithdrawFee:
          item.maxWithdrawFee === null || item.maxWithdrawFee === undefined
            ? ''
            : String(item.maxWithdrawFee),
        settingsItems: (item.settingsItems || []).map(seg => ({
          startAmount:
            seg.startAmount === null || seg.startAmount === undefined
              ? ''
              : String(seg.startAmount),
          endAmount:
            seg.endAmount === null || seg.endAmount === undefined ? '' : String(seg.endAmount),
          withdrawFeeScale:
            seg.withdrawFeeScale === null || seg.withdrawFeeScale === undefined
              ? ''
              : String(seg.withdrawFeeScale),
          withdrawFeeFixed:
            seg.withdrawFeeFixed === null || seg.withdrawFeeFixed === undefined
              ? ''
              : String(seg.withdrawFeeFixed),
          minWithdrawFee:
            seg.minWithdrawFee === null || seg.minWithdrawFee === undefined
              ? ''
              : String(seg.minWithdrawFee),
          maxWithdrawFee:
            seg.maxWithdrawFee === null || seg.maxWithdrawFee === undefined
              ? ''
              : String(seg.maxWithdrawFee),
        })),
      });
      return;
    }

    form.reset({
      name: '',
      method: '1',
      currencys: [],
      model: '1',
      scheme: '1',
      withdrawFeeScale: '',
      withdrawFeeFixed: '',
      minWithdrawFee: '',
      maxWithdrawFee: '',
      settingsItems: [],
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
      const segments =
        data.scheme === '2'
          ? data.settingsItems.map(seg => ({
              startAmount: toOptionalNumber(seg.startAmount),
              endAmount: toOptionalNumber(seg.endAmount),
              withdrawFeeScale:
                data.model === '1' ? toOptionalNumber(seg.withdrawFeeScale) : undefined,
              withdrawFeeFixed:
                data.model === '2' ? toOptionalNumber(seg.withdrawFeeFixed) : undefined,
              minWithdrawFee: toOptionalNumber(seg.minWithdrawFee),
              maxWithdrawFee: toOptionalNumber(seg.maxWithdrawFee),
            }))
          : undefined;
      const res = await save({
        id: mode === 'edit' ? item?.id : undefined,
        name: data.name || undefined,
        method: Number(data.method),
        currencys: data.currencys?.length ? data.currencys.join(',') : undefined,
        model: Number(data.model),
        scheme: Number(data.scheme),
        withdrawFeeScale:
          data.scheme === '1' && data.model === '1'
            ? toOptionalNumber(data.withdrawFeeScale)
            : undefined,
        withdrawFeeFixed:
          data.scheme === '1' && data.model === '2'
            ? toOptionalNumber(data.withdrawFeeFixed)
            : undefined,
        minWithdrawFee:
          data.scheme === '1' && data.model === '1'
            ? toOptionalNumber(data.minWithdrawFee)
            : undefined,
        maxWithdrawFee:
          data.scheme === '1' && data.model === '1'
            ? toOptionalNumber(data.maxWithdrawFee)
            : undefined,
        settingsItemsJsonStr: segments ? JSON.stringify(segments) : undefined,
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
          ? t('common.addField', { field: t('withdrawFeePage.title') })
          : t('common.modify', { field: t('withdrawFeePage.title') })
      }
      trigger={
        mode === 'add' && trigger ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      isConfirmDisabled={isPending}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={form.handleSubmit(onSubmit)}
      variant="large"
      type="submit"
      formLoading={isPending}
    >
      <RrhForm
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
      >
        <FormInput
          name="name"
          label={t('withdrawFeePage.ruleNameOptional')}
          placeholder={t('common.pleaseInput', { field: t('withdrawFeePage.ruleName') })}
        />
        <FormSelect
          name="method"
          label={t('withdrawFeePage.method')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={methodOptions}
        />
        <FormMultiSelect
          name="currencys"
          label={t('withdrawFeePage.currencys')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={currencyOptions}
        />
        <FormSelect
          name="model"
          label={t('receiveAccountsPage.commissionMode')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={[
            { value: '1', label: t('receiveAccountsPage.commissionByRate') },
            { value: '2', label: t('receiveAccountsPage.commissionFixed') },
          ]}
        />
        <FormSelect
          name="scheme"
          label={t('withdrawFeePage.scheme')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={schemeOptions}
        />

        {scheme === '1' && model === '1' && (
          <>
            <FormInput
              name="withdrawFeeScale"
              label={t('receiveAccountsPage.commissionRate')}
              placeholder={t('common.pleaseInput', {
                field: t('receiveAccountsPage.commissionRate'),
              })}
            />
            <FormInput
              name="minWithdrawFee"
              label={t('receiveAccountsPage.minCommission')}
              placeholder={t('common.pleaseInput', {
                field: t('receiveAccountsPage.minCommission'),
              })}
            />
            <FormInput
              name="maxWithdrawFee"
              label={t('receiveAccountsPage.maxCommission')}
              placeholder={t('common.pleaseInput', {
                field: t('receiveAccountsPage.maxCommission'),
              })}
            />
          </>
        )}
        {scheme === '1' && model === '2' && (
          <FormInput
            name="withdrawFeeFixed"
            label={t('receiveAccountsPage.fixCommission')}
            placeholder={t('common.pleaseInput', {
              field: t('receiveAccountsPage.fixCommission'),
            })}
          />
        )}

        {scheme === '2' && (
          <div className="rounded-md border p-4 md:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-medium">{t('withdrawFeePage.schemeLadder')}</div>
              <RrhButton
                variant="outline"
                type="button"
                className="flex items-center gap-1"
                onClick={() => append({ ...emptySegment })}
              >
                <Plus className="size-3.5" />
                {t('common.add')}
              </RrhButton>
            </div>
            <div className="flex flex-col gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-md border p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-muted-foreground text-sm">#{index + 1}</div>
                    <RrhButton
                      variant="ghost"
                      type="button"
                      className="size-8 cursor-pointer text-red-500"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </RrhButton>
                  </div>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
                    <FormInput
                      name={`settingsItems.${index}.startAmount` as const}
                      label={t('withdrawFeePage.startAmount')}
                      placeholder={t('common.pleaseInput', {
                        field: t('withdrawFeePage.startAmount'),
                      })}
                    />
                    <FormInput
                      name={`settingsItems.${index}.endAmount` as const}
                      label={t('withdrawFeePage.endAmount')}
                      placeholder={t('common.pleaseInput', {
                        field: t('withdrawFeePage.endAmount'),
                      })}
                    />
                    {model === '1' && (
                      <FormInput
                        name={`settingsItems.${index}.withdrawFeeScale` as const}
                        label={t('receiveAccountsPage.commissionRate')}
                        placeholder={t('common.pleaseInput', {
                          field: t('receiveAccountsPage.commissionRate'),
                        })}
                      />
                    )}
                    {model === '2' && (
                      <FormInput
                        name={`settingsItems.${index}.withdrawFeeFixed` as const}
                        label={t('receiveAccountsPage.fixCommission')}
                        placeholder={t('common.pleaseInput', {
                          field: t('receiveAccountsPage.fixCommission'),
                        })}
                      />
                    )}
                    <FormInput
                      name={`settingsItems.${index}.minWithdrawFee` as const}
                      label={t('receiveAccountsPage.minCommission')}
                      placeholder={t('common.pleaseInput', {
                        field: t('receiveAccountsPage.minCommission'),
                      })}
                    />
                    <FormInput
                      name={`settingsItems.${index}.maxWithdrawFee` as const}
                      label={t('receiveAccountsPage.maxCommission')}
                      placeholder={t('common.pleaseInput', {
                        field: t('receiveAccountsPage.maxCommission'),
                      })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {scheme === '3' && (
          <div className="text-muted-foreground text-sm md:col-span-2">
            {t('withdrawFeePage.schemeFreeTip')}
          </div>
        )}
      </RrhForm>
    </RrhDialog>
  );
};
