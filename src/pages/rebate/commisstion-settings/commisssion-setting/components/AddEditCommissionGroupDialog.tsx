import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhForm } from '@/components/form/RrhForm';
import { RrhButton } from '@/components/common/RrhButton';
import { CircleAlert, Plus } from 'lucide-react';
import {
  LevelListItem,
  RebateTwoCommissionGroupAddAgencyItem,
  useRebateTwoCommissionGroupAdd,
  useRebateTwoCommissionGroupEdit,
  useTwoCommissionGroupDetail,
} from '@/api/hooks/rebate';
import { FormInput } from '@/components/form/FormInput';
import { ToolTip } from '@/components/common/ToolTip';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { FormSelect } from '@/components/form/FormSelect';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { TFunction } from 'i18next';
import z from 'zod';

type FormValues = {
  name: string;
  countPrice: number;
  agency: RebateTwoCommissionGroupAddAgencyItem[];
};

type DetailAgencySource = Partial<RebateTwoCommissionGroupAddAgencyItem> & {
  levelId?: string | number;
};

// 0 1 2 分别是 总管 特级代理 1级代理
function createAgency(leverOptions: LevelListItem[] = []) {
  const sortedLeverOptions = [...leverOptions]
    .sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
    .slice(0, 3);

  const fallbackCount = Math.max(3, sortedLeverOptions.length);

  return Array.from({ length: fallbackCount }, (_, index) => ({
    rebateType: 1,
    levelId: sortedLeverOptions[index]?.id ?? '',
    status: false,
    price: 0,
    equalType: 1,
    equalMoney: 0,
    equalLimit: 0,
    passType: 1,
    passMoney: 0,
    passLimit: 0,
  }));
}

function buildAgencyFromDetail(
  agency?: DetailAgencySource[],
  leverOptions: LevelListItem[] = [],
): RebateTwoCommissionGroupAddAgencyItem[] {
  const defaults = createAgency(leverOptions);

  if (!Array.isArray(agency) || agency.length === 0) {
    return defaults;
  }

  return defaults.map((item, index) => {
    const source = agency[index];
    if (!source) {
      return item;
    }

    return {
      rebateType: source.rebateType ?? item.rebateType,
      levelId: source.levelId ?? item.levelId,
      status: source.status ?? item.status,
      price: source.price ?? item.price,
      equalType: source.equalType ?? item.equalType,
      equalMoney: source.equalMoney ?? item.equalMoney,
      equalLimit: source.equalLimit ?? item.equalLimit,
      passType: source.passType ?? item.passType,
      passMoney: source.passMoney ?? item.passMoney,
      passLimit: source.passLimit ?? item.passLimit,
    };
  });
}

const schema = (t: TFunction<'translation', undefined>) => {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t('rules.required', { field: t('table.commissionGroupName') })),
    countPrice: z.number(),
    agency: z.array(z.custom<RebateTwoCommissionGroupAddAgencyItem>()),
  });
};

export const AddEditCommissionGroupDialog = ({
  mode,
  open: openProp,
  onOpenChange,
  id,
  rebateTraderId,
  onSuccess,
  leverOptions,
}: {
  mode: 'add' | 'edit';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  rebateTraderId?: string;
  onSuccess?: () => void;
  leverOptions?: LevelListItem[];
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: addCommissionGroup } = useRebateTwoCommissionGroupAdd();
  const { mutateAsync: editCommissionGroup } = useRebateTwoCommissionGroupEdit();

  const { data: detailData } = useTwoCommissionGroupDetail(
    { id: id ?? '' },
    {
      enabled: mode === 'edit' && !!id,
    },
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema(t)),
    defaultValues: {
      name: '',
      countPrice: 0,
      agency: createAgency(leverOptions),
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === 'add') {
      form.reset({
        name: '',
        countPrice: 0,
        agency: createAgency(leverOptions),
      });
      return;
    }

    const detailItem = detailData?.data;
    if (!detailItem) {
      return;
    }

    form.reset({
      name: detailItem.name ?? '',
      countPrice: 0,
      agency: buildAgencyFromDetail(detailItem.agency, leverOptions),
    });
  }, [detailData, form, leverOptions, mode, open]);

  const agencyValues = form.watch('agency');

  useEffect(() => {
    const totalPrice = (agencyValues ?? []).reduce(
      (sum, item) => sum + Number(item?.price ?? 0),
      0,
    );

    form.setValue('countPrice', Number(totalPrice.toFixed(2)), {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [agencyValues, form]);

  const onCancel = () => {
    onClose(false);
  };

  const onSubmit = async (values: FormValues) => {
    if (!values.agency?.some(item => item.status)) {
      toast.error(t('commissionRebateSettings.selectAtLeastOneRebateLevel'));
      return;
    }

    const currentRebateTraderId = rebateTraderId ?? detailData?.data?.rebateTraderId ?? '';
    if (!currentRebateTraderId) {
      toast.error(t('common.AnErrorOccurred'));
      return;
    }

    const payload = {
      rebateTraderId: currentRebateTraderId,
      rebateType: detailData?.data?.rebateType ?? 1,
      name: values.name,
      levelId: values.agency?.[0]?.levelId ?? '',
      agency: values.agency,
    };

    try {
      setIsSubmitting(true);
      const res =
        mode === 'add'
          ? await addCommissionGroup(payload)
          : await editCommissionGroup({
              ...payload,
              id: id ?? '',
            });

      if (res?.code === 0) {
        toast.success(t('common.success'));
        onSuccess?.();
        onClose(false);
        return;
      }

      toast.error(res?.msg || t('common.AnErrorOccurred'));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConfirm = async () => {
    form.handleSubmit(onSubmit)();
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset({
        name: '',
        countPrice: 0,
        agency: createAgency(leverOptions),
      });
    }
  };

  const sortedLeverOptions = [...(leverOptions ?? [])]
    .sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
    .slice(0, 3);

  const agencyLabels = sortedLeverOptions.length
    ? sortedLeverOptions.map(item => item.levelName)
    : [
        t('commissionRebateSettings.chiefSteward'),
        t('commissionRebateSettings.superAgent'),
        t('commissionRebateSettings.firstAgent'),
      ];

  return (
    <RrhDialog
      trigger={
        mode === 'add' ? (
          <RrhButton type="button" Icon={<Plus className="size-3.5" />}>
            {t('common.add')}
          </RrhButton>
        ) : null
      }
      title={
        mode === 'add'
          ? t('commissionRebateSettings.addCommissionGroup')
          : t('commissionRebateSettings.editCommissionGroup')
      }
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      formLoading={isSubmitting}
    >
      <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput
          className="py-6"
          verticalLabel
          name="name"
          label={t('table.commissionGroupName')}
          placeholder={t('common.pleaseInput', { field: t('table.commissionGroupName') })}
          maxLength={64}
          labeTipsDom={
            <ToolTip
              content={
                <span className="whitespace-pre-line">
                  {t('commissionRebateSettings.commissionGroupNameTips')}
                </span>
              }
            >
              <CircleAlert className="text-muted-foreground size-4" />
            </ToolTip>
          }
        />
        <div className="space-y-3">
          {agencyValues?.map((_, index) => (
            <div key={index} className="bg-primary-foreground grid gap-3 rounded-2xl p-3">
              <div className="flex items-end gap-2">
                <div className="flex flex-1 items-end gap-2">
                  <FormInput
                    className="flex-1"
                    verticalLabel
                    name={`agency.${index}.price`}
                    label={agencyLabels[index] ?? t('commissionRebateSettings.chiefSteward')}
                    placeholder={t('common.pleaseInput', { field: '' })}
                  />
                  <RrhButton type="button" disabled variant="outline" size="sm">
                    {t('commissionRebateSettings.pointsPerOrder')}
                  </RrhButton>
                </div>
                <div>
                  <Switch
                    className="cursor-pointer bg-white data-[state=checked]:bg-slate-700"
                    checked={agencyValues?.[index]?.status ?? false}
                    onClick={() => {
                      const newValue = agencyValues?.[index]?.status ? false : true;
                      form.setValue(`agency.${index}.status`, newValue);
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <FormSelect
                      verticalLabel
                      name={`agency.${index}.equalType`}
                      label={t('commissionRebateSettings.peerLever')}
                      options={[
                        {
                          label: t('commissionRebateSettings.equalTypeOptions.0'),
                          value: 1,
                        },
                        {
                          label: t('commissionRebateSettings.equalTypeOptions.1'),
                          value: 2,
                        },
                        {
                          label: t('commissionRebateSettings.equalTypeOptions.2'),
                          value: 3,
                        },
                      ]}
                      showRowValue={false}
                    />
                  </div>
                  <div className="flex-1">
                    <FormInputWithUnit name={`agency.${index}.equalMoney`} unit="%" verticalLabel />
                  </div>
                </div>
                <FormInputWithUnit
                  name={`agency.${index}.equalLimit`}
                  unit={t('commissionRebateSettings.passLimit')}
                  label={t('commissionRebateSettings.limit')}
                  verticalLabel
                />
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <FormSelect
                      verticalLabel
                      name={`agency.${index}.passType`}
                      label={t('commissionRebateSettings.crossLevel')}
                      options={[
                        {
                          label: t('commissionRebateSettings.equalTypeOptions.0'),
                          value: 1,
                        },
                        {
                          label: t('commissionRebateSettings.equalTypeOptions.1'),
                          value: 2,
                        },
                        {
                          label: t('commissionRebateSettings.equalTypeOptions.2'),
                          value: 3,
                        },
                      ]}
                      showRowValue={false}
                    />
                  </div>
                  <div className="flex-1">
                    <FormInputWithUnit name={`agency.${index}.passMoney`} unit="%" verticalLabel />
                  </div>
                </div>
                <FormInputWithUnit
                  name={`agency.${index}.passLimit`}
                  unit={t('commissionRebateSettings.passLimit')}
                  label={t('commissionRebateSettings.limit')}
                  verticalLabel
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-end gap-2 py-6">
          <FormInput
            className="flex-1"
            verticalLabel
            name="countPrice"
            label={t('commissionRebateSettings.leverTotalRebate')}
            placeholder={t('common.pleaseInput', { field: '' })}
            disabled
          />
          <RrhButton type="button" disabled variant="outline" size="sm">
            {t('commissionRebateSettings.pointsPerOrder')}
          </RrhButton>
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
