import { OpenReviewDetailRes } from '@/api/hooks/review/types';
import { SelectOption } from '@/api/types';
import { EditableField } from '@/components/common/EditableField';
import { InfoItem } from '@/components/common/InfoItem';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhRadioGroup } from '@/components/common/RrhRadioGroup';
import { RrhSelect } from '@/components/common/RrhSelect';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEditableFields } from '@/hooks/useEditableFields';
import { serverMap } from '@/lib/constant';
import { SelectDirectAgent } from '@/pages/account/trading-accounts-detail/components/SelectDirectAgent';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormValue } from '../AccountOpeningDetail';
import { UseFormReturn } from 'react-hook-form';

type GeneralInfoField =
  | 'accountName'
  | 'account'
  | 'credit'
  | 'initialAmount'
  | 'mtGroup'
  | 'directBroker'
  | 'accountGroupId'
  | 'lever'
  | 'sendPasswordOnly';
type EditType = 'input' | 'select' | 'modal' | 'radio';

type ModalFieldKey = 'directBroker';
type ModalLabelsState = Record<ModalFieldKey, Record<string, string>>;
type SelectFieldKey = 'mtGroup' | 'accountGroupId' | 'lever' | 'sendPasswordOnly';

type FormEditValues = {
  accountName: string;
  account: string;
  credit: string;
  initialAmount: string;
  mtGroup: string;
  directBroker: string;
  accountGroupId: string;
  lever: string;
  sendPasswordOnly: string;
};

const EDITABLE_KEYS: GeneralInfoField[] = [
  'accountName',
  'account',
  'mtGroup',
  'directBroker',
  'accountGroupId',
  'lever',
  'sendPasswordOnly',
];

export const ReviewInfo = ({
  openInfo,
  form,
}: {
  openInfo: OpenReviewDetailRes['data'];
  form: UseFormReturn<FormValue>;
}) => {
  const { t } = useTranslation();
  const detail = openInfo?.detail;
  const detailId = detail?.id || '';
  const accountName = detail?.userName || '';
  const account = detail?.account || '';
  const credit = detail?.credit ? `${detail.credit}` : '';
  const initialAmount = detail?.initialAmount ? `${detail.initialAmount}` : '';
  const userShowId = detail?.userShowId || '';
  const mtGroup = detail?.mtGroup || '';
  const accountGroupId = detail?.accountGroupId || '';
  const directBroker = detail?.directBroker || '';
  const lever = detail?.lever || '';
  const sendPasswordOnly = detail?.sendPasswordOnly ? `${detail.sendPasswordOnly}` : '';
  const directBrokerName = detail?.directBrokerName || '';
  const remark = detail?.remark || '';
  const verifyStep = detail?.verifyStep ? `${detail.verifyStep}` : '';

  const [modalLabels, setModalLabels] = useState<ModalLabelsState>({
    directBroker: {},
  });

  const accountInformation = [
    {
      label: t('table.fullName'),
      value: accountName,
    },
    {
      label: t('table.userShowId'),
      value: userShowId,
    },
  ];

  const openAccountInformation = !detail
    ? []
    : [
        {
          label: t('tradingAccountTransactions.serverType'),
          value: serverMap[detail.serverType || 0] || '-',
        },
        {
          label: t('common.type'),
          value: detail.serverProperty === 1 ? t('common.live') : t('common.demo'),
        },
        {
          label: t('common.server'),
          value: detail.serverName || '-',
        },
        {
          label: t('common.accountType'),
          value: detail.staName || '-',
        },
        {
          label: t('accountOpening.source'),
          value: detail.source || '-',
        },
      ];

  const serverGroupOptions = useMemo<SelectOption[]>(
    () =>
      (openInfo?.allGroup || []).map(i => ({
        label: i,
        value: `${i}`,
      })),
    [openInfo],
  );

  const accountGroupOptions = useMemo<SelectOption[]>(() => {
    return (openInfo?.allDealAccountGroup || []).map(i => ({
      label: i.name,
      value: `${i.id}`,
    }));
  }, [openInfo]);

  const leverOptions = useMemo<SelectOption[]>(() => {
    return (openInfo?.allLever || []).map(i => ({
      label: `1:${i}`,
      value: `${i}`,
    }));
  }, [openInfo]);

  const sendPasswordOnlyOptions = useMemo<SelectOption[]>(() => {
    return [
      {
        value: '1',
        label: t('common.yes'),
      },
      {
        value: '0',
        label: t('common.no'),
      },
    ];
  }, [t]);

  const fieldConfigs = useMemo<
    Array<{
      key: GeneralInfoField;
      label: string;
      name: keyof FormEditValues;
      type: EditType;
      options?: SelectOption[];
      format?: (value: string) => string;
    }>
  >(
    () => [
      { key: 'accountName', label: t('table.fullName'), name: 'accountName', type: 'input' },
      { key: 'account', label: t('table.account'), name: 'account', type: 'input' },
      { key: 'credit', label: t('table.creditAmount'), name: 'credit', type: 'input' },
      {
        key: 'initialAmount',
        label: t('table.initialAmount'),
        name: 'initialAmount',
        type: 'input',
      },
      {
        key: 'mtGroup',
        label: t('table.groups'),
        name: 'mtGroup',
        type: 'select',
        options: serverGroupOptions,
      },
      {
        key: 'accountGroupId',
        label: t('table.accountGroup'),
        name: 'accountGroupId',
        type: 'select',
        options: accountGroupOptions,
      },
      {
        key: 'lever',
        label: t('common.level'),
        name: 'lever',
        type: 'select',
        options: leverOptions,
      },
      {
        key: 'directBroker',
        label: t('table.directAgent'),
        name: 'directBroker',
        type: 'modal',
      },
      {
        key: 'sendPasswordOnly',
        label: t('accountOpening.sendPasswordOnly'),
        name: 'sendPasswordOnly',
        type: 'radio',
        options: sendPasswordOnlyOptions,
      },
    ],
    [t, serverGroupOptions, accountGroupOptions, leverOptions, sendPasswordOnlyOptions],
  );

  const selectLabelMaps = useMemo<Record<SelectFieldKey, Record<string, string>>>(
    () => ({
      mtGroup: serverGroupOptions.reduce<Record<string, string>>((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {}),
      accountGroupId: accountGroupOptions.reduce<Record<string, string>>((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {}),
      lever: leverOptions.reduce<Record<string, string>>((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {}),
      sendPasswordOnly: sendPasswordOnlyOptions.reduce<Record<string, string>>((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {}),
    }),
    [serverGroupOptions, accountGroupOptions, leverOptions, sendPasswordOnlyOptions],
  );

  const initialData = useMemo<Record<GeneralInfoField, string>>(
    () => ({
      accountName: accountName,
      account: account,
      credit: credit,
      initialAmount: initialAmount,
      mtGroup: mtGroup,
      directBroker: directBroker,
      accountGroupId: accountGroupId,
      lever: lever,
      sendPasswordOnly: sendPasswordOnly,
    }),
    [
      account,
      accountGroupId,
      credit,
      directBroker,
      initialAmount,
      lever,
      mtGroup,
      sendPasswordOnly,
      accountName,
    ],
  );

  const initIdRef = useRef('');

  const nextValues = useMemo<FormEditValues>(
    () => ({
      account,
      accountGroupId,
      credit,
      directBroker,
      initialAmount,
      lever,
      mtGroup,
      sendPasswordOnly,
      accountName,
    }),
    [
      account,
      accountGroupId,
      credit,
      directBroker,
      initialAmount,
      lever,
      mtGroup,
      sendPasswordOnly,
      accountName,
    ],
  );

  const formValues = useMemo<FormValue>(
    () => ({
      account,
      accountGroupId,
      credit,
      directBroker,
      initialAmount,
      lever,
      mtGroup,
      sendPasswordOnly,
      accountName,
      id: detailId,
      status: '1',
      remark: remark,
      verifyStep: verifyStep,
    }),
    [
      account,
      accountGroupId,
      credit,
      directBroker,
      initialAmount,
      lever,
      mtGroup,
      sendPasswordOnly,
      accountName,
      detailId,
      remark,
      verifyStep,
    ],
  );

  const {
    startEdit,
    updateEditingValue,
    cancelEdit,
    confirmEdit,
    getDisplayValue,
    isEditing,
    getConfirmedData,
    resetFields,
  } = useEditableFields<GeneralInfoField>(initialData, EDITABLE_KEYS);

  const getDisplayText = useCallback(
    (config: {
      key: GeneralInfoField;
      type: EditType;
      options?: SelectOption[];
      format?: (value: string) => string;
    }) => {
      const rawValue = getDisplayValue(config.key) || '';
      if (config.type === 'select' || config.type === 'radio') {
        const selectKey = config.key as SelectFieldKey;
        return selectLabelMaps[selectKey]?.[rawValue] || rawValue || '-';
      }
      if (config.type === 'modal') {
        const modalKey = config.key as ModalFieldKey;
        return modalLabels[modalKey]?.[rawValue] || rawValue || '-';
      }
      return config.format?.(rawValue) || rawValue || '-';
    },
    [getDisplayValue, modalLabels, selectLabelMaps],
  );

  useEffect(() => {
    if (!detail) return;
    const initKey = detailId || '';
    if (initIdRef.current === initKey) return;
    form.reset(formValues);
    resetFields(nextValues);
    setModalLabels(prev => ({
      directBroker: {
        ...prev.directBroker,
        ...(directBroker ? { [directBroker]: directBrokerName || directBroker } : {}),
      },
    }));
    initIdRef.current = initKey;
  }, [nextValues, directBroker, directBrokerName, detailId, detail, resetFields, form, formValues]);

  return (
    <RrhCard className="flex-1">
      <div>
        <h2 className="text-normal py-1.5 text-base font-bold md:py-3 md:text-lg">
          {t('table.accountInformation')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {accountInformation.map(({ label, value }) => (
            <LabelItem key={label} label={label} ContentDom={<InfoItem info={value} />} />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-normal py-1.5 text-base font-bold md:py-3 md:text-lg">
          {t('accountOpening.openAccountInformation')}
        </h2>
        {fieldConfigs.map(config => (
          <FormField
            key={config.key}
            name={config.name}
            render={({ field }) => (
              <LabelItem
                label={config.label}
                ContentDom={
                  <EditableField
                    isEditing={isEditing(config.key)}
                    displayValue={getDisplayText(config)}
                    onCancel={() => {
                      cancelEdit(config.key);
                      const confirmed = getConfirmedData()[config.key] || '';
                      field.onChange(confirmed);
                    }}
                    onConfirm={() => confirmEdit(config.key)}
                    onEdit={() => startEdit(config.key)}
                    editor={
                      config.type === 'input' ? (
                        <Input
                          className="h-10"
                          value={field.value || ''}
                          onChange={e => {
                            field.onChange(e.target.value);
                            updateEditingValue(config.key, e.target.value);
                          }}
                        />
                      ) : config.type === 'select' ? (
                        <RrhSelect
                          options={config.options || []}
                          value={field.value || ''}
                          onValueChange={val => {
                            field.onChange(val);
                            updateEditingValue(config.key, val);
                          }}
                          showRowValue={false}
                          placeholder={t('common.pleaseSelect')}
                          className="w-full"
                        />
                      ) : config.type === 'radio' ? (
                        <RrhRadioGroup
                          orientation="vertical"
                          radioItems={config.options || []}
                          value={field.value || ''}
                          onValueChange={val => {
                            field.onChange(val);
                            updateEditingValue(config.key, val);
                          }}
                        />
                      ) : (
                        <SelectDirectAgent
                          valueLabel={
                            modalLabels[config.key as ModalFieldKey]?.[
                              (field.value as string) || ''
                            ] || ''
                          }
                          onConfirm={({ value, label }) => {
                            field.onChange(value);
                            updateEditingValue(config.key, value);
                            const modalKey = config.key as ModalFieldKey;
                            setModalLabels(prev => ({
                              ...prev,
                              [modalKey]: {
                                ...prev[modalKey],
                                ...(value ? { [value]: label || value } : {}),
                              },
                            }));
                          }}
                        />
                      )
                    }
                  />
                }
              />
            )}
          />
        ))}
        {openAccountInformation.map(({ label, value }) => (
          <LabelItem key={label} label={label} ContentDom={<InfoItem info={value} />} />
        ))}
      </div>
    </RrhCard>
  );
};
