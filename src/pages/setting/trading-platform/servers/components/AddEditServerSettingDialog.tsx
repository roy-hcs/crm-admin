import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useFieldArray, useForm, FieldPath } from 'react-hook-form';
import { RrhForm } from '@/components/form/RrhForm';
import { toast } from 'sonner';
import { RrhButton } from '@/components/common/RrhButton';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormSwitch } from '@/components/form/FormSwitch';
import { CrmMtServiceListItem, MtServiceDcNodeItem } from '@/api/hooks/setting/types';
import { FormSelect } from '@/components/form/FormSelect';
import { serverMap } from '@/lib/constant';
import { typeOptions } from '@/lib/const';
import {
  useAddServerSetting,
  useCheckMtConnect,
  useEditServerSetting,
} from '@/api/hooks/setting/setting';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLoginConfig } from '@/api/hooks/users/users';
import Utf8 from 'crypto-js/enc-utf8';
import { AES } from 'crypto-js';
import Pkcs7 from 'crypto-js/pad-pkcs7';
import ECB from 'crypto-js/mode-ecb';
import Hex from 'crypto-js/enc-hex';
import { FormPwdInput } from '@/components/form/FormPwdInput';
import {
  applyInputNormalizer,
  normalizePositiveIntegerInput,
} from '@/pages/marketing/shared/formValueUtils';

type DcNodeFormValues = {
  nodeName: string;
  serverAddress: string;
  region: string;
  weight: string;
  enabled: string;
};

type FormValues = {
  serviceType: string;
  serviceProperty: string;
  aliasName: string;
  serviceHost: string;
  managerAccount: string;
  managerSecret: string;
  accountStart: string;
  accountEnd: string;
  sort: string;
  connectConfig: string;
  primaryWeight: string;
  connectionTimeout: string;
  dcNodes: DcNodeFormValues[];
};

// DC 池高可用连接仅支持 MT5(1)、MT4(2)
const dcPoolServiceTypes = ['1', '2'];

const emptyDcNode = (): DcNodeFormValues => ({
  nodeName: '',
  serverAddress: '',
  region: '',
  weight: '',
  enabled: '1',
});

export const AddEditServerSettingDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  mode,
  item,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  mode: 'add' | 'edit';
  item?: CrmMtServiceListItem;
}) => {
  const { t } = useTranslation();
  const { data: loginConfig } = useLoginConfig();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [secretKey, setSecretKey] = useState('');
  const [nodeTestStatus, setNodeTestStatus] = useState<
    Record<string, 'idle' | 'testing' | 'passed' | 'failed'>
  >({});

  const serviceType = useMemo(() => {
    const arr = Object.entries(serverMap).map(([value, label]) => ({
      value,
      label,
    }));
    return arr;
  }, []);
  const { mutateAsync: add, isPending } = useAddServerSetting();
  const { mutateAsync: edit, isPending: isEditPending } = useEditServerSetting();
  const { mutateAsync: checkMtConnect } = useCheckMtConnect();

  const encryptPassword = useCallback((password: string, secretKey: string): string => {
    const key = Utf8.parse(secretKey);
    const source = Utf8.parse(password.trim());
    const encrypted = AES.encrypt(source, key, {
      mode: ECB,
      padding: Pkcs7,
    });
    return Hex.stringify(encrypted.ciphertext);
  }, []);

  const schema = useMemo(
    () =>
      z
        .object({
          serviceType: z
            .string()
            .min(1, t('rules.required', { field: t('table.transactionPlatform') })),
          serviceProperty: z.string().min(1, t('rules.required', { field: t('common.type') })),
          aliasName: z.string().min(1, t('rules.required', { field: t('table.serverName') })),
          serviceHost: z.string().min(1, t('rules.required', { field: t('table.serviceHost') })),
          managerAccount: z
            .string()
            .min(1, t('rules.required', { field: t('serversSettingPage.managerAccount') })),
          managerSecret: z
            .string()
            .min(1, t('rules.required', { field: t('serversSettingPage.managerSecret') })),
          accountStart: z
            .string()
            .min(1, t('rules.required', { field: t('serversSettingPage.accountStart') })),
          accountEnd: z
            .string()
            .min(1, t('rules.required', { field: t('serversSettingPage.accountEnd') })),
          sort: z.string().min(1, t('rules.required', { field: t('table.sort') })),
          connectConfig: z.string(),
          primaryWeight: z.string(),
          connectionTimeout: z.string(),
          dcNodes: z.array(
            z.object({
              nodeName: z.string(),
              serverAddress: z.string(),
              region: z.string(),
              weight: z.string(),
              enabled: z.string(),
            }),
          ),
        })
        .superRefine((data, ctx) => {
          if (data.connectConfig !== '2') return;
          if (data.dcNodes.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['dcNodes'],
              message: t('serversSettingPage.dcNodeRequired'),
            });
          }
          data.dcNodes.forEach((node, index) => {
            if (!node.nodeName.trim()) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['dcNodes', index, 'nodeName'],
                message: t('rules.required', { field: t('serversSettingPage.dcNodeName') }),
              });
            }
            if (!node.serverAddress.trim()) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['dcNodes', index, 'serverAddress'],
                message: t('rules.required', { field: t('serversSettingPage.dcNodeAddress') }),
              });
            }
          });
        }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceType: '',
      serviceProperty: '',
      aliasName: '',
      serviceHost: '',
      managerAccount: '',
      managerSecret: '',
      accountStart: '',
      accountEnd: '',
      sort: '',
      connectConfig: '1',
      primaryWeight: '',
      connectionTimeout: '',
      dcNodes: [],
    },
  });
  const { fields, append, remove, replace } = useFieldArray<FormValues, 'dcNodes', 'fieldId'>({
    control: form.control,
    name: 'dcNodes',
    keyName: 'fieldId',
  });

  const serviceTypeValue = form.watch('serviceType');
  const connectConfigValue = form.watch('connectConfig');
  const dcPoolSupported = dcPoolServiceTypes.includes(serviceTypeValue);
  // 编辑时列表接口暂未返回 DC 节点，只有拿到节点数据才允许编辑
  const dcNodesLoaded = mode === 'edit' && Array.isArray(item?.mtServiceDcNodes);
  const dcEditable = mode === 'add' || dcNodesLoaded;

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && item) {
      form.reset({
        serviceType: String(item.serviceType ?? ''),
        serviceProperty: String(item.serviceProperty ?? ''),
        aliasName: item.aliasName || '',
        serviceHost: item.serviceHost || '',
        managerAccount: item.managerAccount || '',
        managerSecret: '',
        accountStart: String(item.accountStart ?? ''),
        accountEnd: String(item.accountEnd ?? ''),
        sort: String(item.sort ?? ''),
        connectConfig: String(item.connectConfig ?? 1),
        primaryWeight: item.primaryWeight != null ? String(item.primaryWeight) : '',
        connectionTimeout: item.connectionTimeout != null ? String(item.connectionTimeout) : '',
        dcNodes: (item.mtServiceDcNodes || []).map((node: MtServiceDcNodeItem) => ({
          nodeName: node.nodeName || '',
          serverAddress: node.serverAddress || '',
          region: node.region || '',
          weight: node.weight != null ? String(node.weight) : '',
          enabled: String(node.enabled ?? 1),
        })),
      });
      return;
    }

    form.reset({
      serviceType: '',
      serviceProperty: '',
      aliasName: '',
      serviceHost: '',
      managerAccount: '',
      managerSecret: '',
      accountStart: '',
      accountEnd: '',
      sort: '',
      connectConfig: '1',
      primaryWeight: '',
      connectionTimeout: '',
      dcNodes: [],
    });
  }, [open, mode, item, form]);

  useEffect(() => {
    if (!open) {
      setNodeTestStatus({});
    }
  }, [open]);

  useEffect(() => {
    if (loginConfig?.code === 0) {
      setSecretKey(loginConfig.data || '');
    }
  }, [loginConfig]);

  // 切换交易平台后，非 MT4/MT5 不再支持 DC 池，自动复位为单服务器连接
  useEffect(() => {
    if (dcPoolSupported || form.getValues('connectConfig') !== '2') return;
    form.setValue('connectConfig', '1');
    form.setValue('primaryWeight', '');
    form.setValue('connectionTimeout', '');
    replace([]);
  }, [dcPoolSupported, form, replace]);

  const onCancel = () => {
    onClose(false);
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setNodeTestStatus({});
    }
  };

  const switchConnectMode = (value: '1' | '2') => {
    if (value === connectConfigValue) return;
    form.setValue('connectConfig', value);
    if (value === '1') {
      form.setValue('primaryWeight', '');
      form.setValue('connectionTimeout', '');
      replace([]);
    }
  };

  const nodeFieldName = (index: number, key: keyof DcNodeFormValues) =>
    `dcNodes.${index}.${key}` as FieldPath<FormValues>;

  const onTestNode = async (index: number, fieldId: string) => {
    const values = form.getValues();
    const node = values.dcNodes[index];
    if (!node?.serverAddress?.trim()) {
      toast.warning(t('serversSettingPage.dcServerAddressRequired'));
      return;
    }
    if (!values.managerAccount) {
      toast.warning(t('serversSettingPage.dcManagerAccountRequired'));
      return;
    }
    if (!values.managerSecret) {
      toast.warning(t('serversSettingPage.dcManagerSecretRequired'));
      return;
    }
    setNodeTestStatus(prev => ({ ...prev, [fieldId]: 'testing' }));
    try {
      const res = await checkMtConnect({
        serviceType: values.serviceType,
        serviceHost: node.serverAddress.trim(),
        serverName: values.aliasName || node.serverAddress.trim(),
        managerAccount: values.managerAccount,
        managerSecret: encryptPassword(values.managerSecret, secretKey),
      });
      setNodeTestStatus(prev => ({
        ...prev,
        [fieldId]: res.code === 0 ? 'passed' : 'failed',
      }));
    } catch {
      setNodeTestStatus(prev => ({ ...prev, [fieldId]: 'failed' }));
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const encryptedManagerSecret = encryptPassword(data.managerSecret, secretKey);
      const dcParams =
        data.connectConfig === '2'
          ? {
              connectConfig: 2,
              primaryWeight: data.primaryWeight ? Number(data.primaryWeight) : null,
              switchStrategy: 1,
              connectionTimeout: data.connectionTimeout ? Number(data.connectionTimeout) : null,
              mtServiceDcNodes: data.dcNodes.map((node, index) => ({
                nodeName: node.nodeName.trim(),
                serverAddress: node.serverAddress.trim(),
                region: node.region.trim(),
                weight: node.weight ? Number(node.weight) : null,
                enabled: node.enabled === '1' ? 1 : 0,
                sort: index,
              })),
            }
          : { connectConfig: 1 };
      // 编辑时拿不到已有 DC 节点，提交连接配置会让后端先删后插导致节点丢失
      const params = {
        serviceType: data.serviceType,
        serviceProperty: data.serviceProperty,
        aliasName: data.aliasName,
        serviceHost: data.serviceHost,
        managerAccount: data.managerAccount,
        managerSecret: encryptedManagerSecret,
        accountStart: Number(data.accountStart),
        accountEnd: Number(data.accountEnd),
        reportingHost: '',
        reportingDbName: '',
        reportingAccount: '',
        reportingSecret: '',
        generateType: 1,
        sort: Number(data.sort),
        ...(mode === 'add' || dcNodesLoaded ? dcParams : {}),
      };
      const res =
        mode === 'add'
          ? await add(params)
          : await edit({
              ...params,
              id: item?.id || '',
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

  const dcNodesError =
    form.formState.errors.dcNodes?.root?.message || form.formState.errors.dcNodes?.message;

  const connectionSummary = [
    {
      label: t('serversSettingPage.connectMode'),
      value:
        item?.connectConfig === 2
          ? t('serversSettingPage.connectModeDcPool')
          : t('serversSettingPage.connectModeSingle'),
    },
    {
      label: t('serversSettingPage.primaryWeight'),
      value: item?.primaryWeight != null ? `${item.primaryWeight}%` : '-',
    },
    {
      label: t('serversSettingPage.connectionTimeout'),
      value: item?.connectionTimeout != null ? `${item.connectionTimeout}s` : '-',
    },
  ];

  return (
    <RrhDialog
      title={
        mode === 'add'
          ? t('common.addField', {
              field: t('serversSettingPage.title'),
            })
          : t('common.modify', {
              field: t('serversSettingPage.title'),
            })
      }
      trigger={
        mode === 'add' ? (
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
          name="serviceType"
          label={t('table.transactionPlatform')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={serviceType}
          disabled={mode === 'edit'}
        />
        <FormSelect
          name="serviceProperty"
          label={t('common.type')}
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={typeOptions.map(i => ({
            value: i.value,
            label: t(i.label),
          }))}
          disabled={mode === 'edit'}
        />
        <FormInput
          name="aliasName"
          label={t('table.serverName')}
          placeholder={t('common.pleaseInput', { field: t('table.serverName') })}
        />

        <FormInput
          name="serviceHost"
          label={t('table.serviceHost')}
          placeholder={t('common.pleaseInput', { field: t('table.serviceHost') })}
        />

        <FormInput
          name="managerAccount"
          label={t('serversSettingPage.managerAccount')}
          placeholder={t('common.pleaseInput', { field: t('serversSettingPage.managerAccount') })}
        />

        <FormPwdInput
          name="managerSecret"
          label={t('serversSettingPage.managerSecret')}
          placeholder={t('common.pleaseInput', { field: t('serversSettingPage.managerSecret') })}
        />

        <FormInput
          name="accountStart"
          label={t('serversSettingPage.accountStart')}
          placeholder={t('common.pleaseInput', { field: t('serversSettingPage.accountStart') })}
          onInput={event =>
            applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
          }
        />

        <FormInput
          name="accountEnd"
          label={t('serversSettingPage.accountEnd')}
          placeholder={t('common.pleaseInput', { field: t('serversSettingPage.accountEnd') })}
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

        <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-foreground font-medium">
                {t('serversSettingPage.connectionConfig')}
              </div>
              <div className="text-muted-foreground text-xs">
                {t('serversSettingPage.connectionConfigTip')}
              </div>
            </div>
            {dcEditable ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={connectConfigValue === '1' ? 'default' : 'outline'}
                  onClick={() => switchConnectMode('1')}
                >
                  {t('serversSettingPage.connectionModeSingle')}
                </Button>
                {dcPoolSupported && (
                  <Button
                    type="button"
                    size="sm"
                    variant={connectConfigValue === '2' ? 'default' : 'outline'}
                    onClick={() => switchConnectMode('2')}
                  >
                    {t('serversSettingPage.connectionModeDcPool')}
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground flex flex-wrap gap-4 text-xs">
                {connectionSummary.map(i => (
                  <div key={i.label}>
                    {i.label}: <span className="text-foreground">{i.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!dcEditable && (
            <p className="text-muted-foreground text-xs">
              {t('serversSettingPage.dcNodeEditUnavailable')}
            </p>
          )}

          {dcEditable && connectConfigValue === '2' && (
            <>
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
                <FormInput
                  name="primaryWeight"
                  label={t('serversSettingPage.primaryWeight')}
                  placeholder={t('serversSettingPage.primaryWeightPlaceholder')}
                  onInput={event =>
                    applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
                  }
                />
                <div className="text-foreground text-sm">
                  <div>{t('serversSettingPage.switchStrategy')}</div>
                  <div className="text-muted-foreground mt-2 text-sm">
                    {t('serversSettingPage.switchStrategyDefault')}
                  </div>
                </div>
                <FormInput
                  name="connectionTimeout"
                  label={t('serversSettingPage.connectionTimeout')}
                  placeholder={t('serversSettingPage.connectionTimeoutPlaceholder')}
                  onInput={event =>
                    applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-foreground text-sm font-medium">
                      {t('serversSettingPage.dcNodeList')}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {t('serversSettingPage.dcNodeListTip')}
                    </div>
                  </div>
                  <RrhButton
                    type="button"
                    size="sm"
                    variant="outline"
                    Icon={<Plus className="size-3.5" />}
                    onClick={() => append(emptyDcNode())}
                  >
                    {t('serversSettingPage.addDcNode')}
                  </RrhButton>
                </div>

                {fields.length === 0 ? (
                  <div className="rounded-md border border-dashed p-4 text-center">
                    <div className="text-foreground text-sm">
                      {t('serversSettingPage.dcNodeEmpty')}
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {t('serversSettingPage.dcNodeEmptyTip')}
                    </div>
                  </div>
                ) : (
                  fields.map((field, index) => {
                    const testStatus = nodeTestStatus[field.fieldId] || 'idle';
                    return (
                      <div key={field.fieldId} className="space-y-3 rounded-md border p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-foreground text-sm font-medium">
                            {t('serversSettingPage.dcNodeTitle', { index: index + 1 })}
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="size-3.5" />
                            {t('common.delete')}
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                          <FormInput
                            name={nodeFieldName(index, 'nodeName')}
                            label={t('serversSettingPage.dcNodeName')}
                            placeholder={t('serversSettingPage.dcNodeNamePlaceholder')}
                          />
                          <FormInput
                            name={nodeFieldName(index, 'serverAddress')}
                            label={t('serversSettingPage.dcNodeAddress')}
                            placeholder={t('serversSettingPage.dcNodeAddressPlaceholder')}
                          />
                          <FormInput
                            name={nodeFieldName(index, 'region')}
                            label={t('serversSettingPage.dcNodeRegion')}
                            placeholder={t('serversSettingPage.dcNodeRegionPlaceholder')}
                          />
                          <FormInput
                            name={nodeFieldName(index, 'weight')}
                            label={t('serversSettingPage.dcNodeWeight')}
                            placeholder={t('serversSettingPage.dcNodeWeightPlaceholder')}
                            onInput={event =>
                              applyInputNormalizer(
                                event.currentTarget,
                                normalizePositiveIntegerInput,
                              )
                            }
                          />
                          <FormSwitch
                            name={nodeFieldName(index, 'enabled')}
                            label={t('serversSettingPage.dcNodeEnabled')}
                          />
                          <div className="text-foreground space-y-2 text-sm">
                            <div>{t('serversSettingPage.dcNodeConnectivity')}</div>
                            <div className="flex items-center gap-2">
                              <span
                                className={
                                  testStatus === 'passed'
                                    ? 'text-sm text-green-600'
                                    : testStatus === 'failed'
                                      ? 'text-destructive text-sm'
                                      : 'text-muted-foreground text-sm'
                                }
                              >
                                {t(
                                  `serversSettingPage.dcNode${
                                    testStatus === 'passed'
                                      ? 'Passed'
                                      : testStatus === 'failed'
                                        ? 'Failed'
                                        : testStatus === 'testing'
                                          ? 'Testing'
                                          : 'Untested'
                                  }`,
                                )}
                              </span>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={testStatus === 'testing'}
                                onClick={() => onTestNode(index, field.fieldId)}
                              >
                                {t('serversSettingPage.dcNodeTest')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                {dcNodesError && <p className="text-destructive text-sm">{dcNodesError}</p>}
              </div>
            </>
          )}
        </div>
      </RrhForm>
    </RrhDialog>
  );
};
