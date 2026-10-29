import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RrhForm } from '@/components/form/RrhForm';
import { FormInput } from '@/components/form/FormInput';
import { FormPwdInput } from '@/components/form/FormPwdInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormSwitchGroup } from '@/components/form/FormSwitchGroup';
import { RrhButton } from '@/components/common/RrhButton';
import { Button } from '@/components/ui/button';
import { serverMap } from '@/lib/constant';
import { typeOptions } from '@/lib/const';
import { useCheckMtConnect, useSynchronizeServerGroupSetting } from '@/api/hooks/setting/setting';
import { useAddServerQS } from '@/api/hooks/setting/quickCreate';
import { useLoginConfig } from '@/api/hooks/users/users';
import {
  applyInputNormalizer,
  normalizePositiveIntegerInput,
} from '@/pages/marketing/shared/formValueUtils';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import Pkcs7 from 'crypto-js/pad-pkcs7';
import ECB from 'crypto-js/mode-ecb';
import Hex from 'crypto-js/enc-hex';

const dcPoolServiceTypes = ['1', '2'];
const sirixServiceType = '3';
const xforceServiceType = '4';
const noAccountNumberTypes = ['3', '5'];

type DcNodeValues = {
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
  reportingHost: string;
  reportingDbName: string;
  reportingAccount: string;
  reportingSecret: string;
  managerAccount: string;
  managerSecret: string;
  serviceHost: string;
  connectConfig: string;
  primaryWeight: string;
  connectionTimeout: string;
  dcNodes: DcNodeValues[];
  accountStart: string;
  accountEnd: string;
  sort: string;
  generateType: string;
};

const emptyDcNode = (): DcNodeValues => ({
  nodeName: '',
  serverAddress: '',
  region: '',
  weight: '',
  enabled: '1',
});

export type ServerStepResult = {
  serverId: string;
  aliasName: string;
};

export const ServerStep = ({
  subStep,
  onSubStepChange,
  onSaved,
  onCancel,
}: {
  subStep: number;
  onSubStepChange: (sub: number) => void;
  onSaved: (result: ServerStepResult) => void;
  onCancel: () => void;
}) => {
  const { t } = useTranslation();
  const { data: loginConfig } = useLoginConfig();
  const [secretKey, setSecretKey] = useState('');
  const [nodeTestStatus, setNodeTestStatus] = useState<
    Record<string, 'idle' | 'testing' | 'passed' | 'failed'>
  >({});
  const [hostTestStatus, setHostTestStatus] = useState<'idle' | 'testing' | 'passed' | 'failed'>(
    'idle',
  );

  const { mutateAsync: addServer, isPending } = useAddServerQS();
  const { mutateAsync: checkMtConnect } = useCheckMtConnect();
  const { mutate: synchServerGroup } = useSynchronizeServerGroupSetting();

  useEffect(() => {
    if (loginConfig?.code === 0) {
      setSecretKey(loginConfig.data || '');
    }
  }, [loginConfig]);

  const encryptSecret = useCallback(
    (password: string) => {
      const key = Utf8.parse(secretKey);
      const source = Utf8.parse(password.trim());
      const encrypted = AES.encrypt(source, key, { mode: ECB, padding: Pkcs7 });
      return Hex.stringify(encrypted.ciphertext);
    },
    [secretKey],
  );

  const serviceTypeOptions = useMemo(
    () => Object.entries(serverMap).map(([value, label]) => ({ value, label })),
    [],
  );
  const propertyOptions = useMemo(
    () => typeOptions.map(item => ({ value: item.value, label: t(item.label) })),
    [t],
  );

  const schema = useMemo(
    () =>
      z
        .object({
          serviceType: z
            .string()
            .min(1, t('rules.required', { field: t('table.transactionPlatform') })),
          serviceProperty: z.string().min(1, t('rules.required', { field: t('common.type') })),
          aliasName: z.string().min(1, t('rules.required', { field: t('table.serverName') })),
          reportingHost: z.string(),
          reportingDbName: z.string(),
          reportingAccount: z.string(),
          reportingSecret: z.string(),
          managerAccount: z
            .string()
            .min(1, t('rules.required', { field: t('serversSettingPage.managerAccount') })),
          managerSecret: z
            .string()
            .min(1, t('rules.required', { field: t('serversSettingPage.managerSecret') })),
          serviceHost: z.string().min(1, t('rules.required', { field: t('table.serviceHost') })),
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
          accountStart: z.string(),
          accountEnd: z.string(),
          sort: z.string().min(1, t('rules.required', { field: t('table.sort') })),
          generateType: z.string(),
        })
        .superRefine((values, ctx) => {
          if (values.serviceType === sirixServiceType) {
            const sirixFields: Array<[keyof FormValues, string]> = [
              ['reportingHost', 'quickCreatePage.server.reportingHost'],
              ['reportingDbName', 'quickCreatePage.server.reportingDbName'],
              ['reportingAccount', 'quickCreatePage.server.reportingAccount'],
              ['reportingSecret', 'quickCreatePage.server.reportingSecret'],
            ];
            sirixFields.forEach(([field, labelKey]) => {
              if (!String(values[field] ?? '').trim()) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: [field],
                  message: t('rules.required', { field: t(labelKey) }),
                });
              }
            });
          }

          if (values.connectConfig === '2' && dcPoolServiceTypes.includes(values.serviceType)) {
            if (values.dcNodes.length === 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['dcNodes'],
                message: t('serversSettingPage.dcNodeRequired'),
              });
            }
            values.dcNodes.forEach((node, index) => {
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
          }

          const useAccountNumber =
            !noAccountNumberTypes.includes(values.serviceType) &&
            !(values.serviceType === xforceServiceType && values.generateType === '2');
          if (useAccountNumber) {
            const integerPattern = /^[1-9]\d*$/;
            if (!integerPattern.test(values.accountStart)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['accountStart'],
                message: t('quickCreatePage.server.positiveInteger'),
              });
            }
            if (!integerPattern.test(values.accountEnd)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['accountEnd'],
                message: t('quickCreatePage.server.positiveInteger'),
              });
            } else if (
              integerPattern.test(values.accountStart) &&
              Number(values.accountEnd) < Number(values.accountStart)
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['accountEnd'],
                message: t('quickCreatePage.server.accountEndGteStart'),
              });
            }
          }
        }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceType: '',
      serviceProperty: '',
      aliasName: '',
      reportingHost: '',
      reportingDbName: '',
      reportingAccount: '',
      reportingSecret: '',
      managerAccount: '',
      managerSecret: '',
      serviceHost: '',
      connectConfig: '1',
      primaryWeight: '',
      connectionTimeout: '',
      dcNodes: [],
      accountStart: '',
      accountEnd: '',
      sort: '',
      generateType: '1',
    },
  });
  const { fields, append, remove, replace } = useFieldArray<FormValues, 'dcNodes', 'fieldId'>({
    control: form.control,
    name: 'dcNodes',
    keyName: 'fieldId',
  });

  const serviceType = form.watch('serviceType');
  const connectConfig = form.watch('connectConfig');
  const dcPoolSupported = dcPoolServiceTypes.includes(serviceType);
  const isSirix = serviceType === sirixServiceType;
  const generateType = form.watch('generateType');
  const showAccountNumber =
    !noAccountNumberTypes.includes(serviceType) &&
    !(serviceType === xforceServiceType && generateType === '2');

  useEffect(() => {
    if (dcPoolSupported || form.getValues('connectConfig') !== '2') return;
    form.setValue('connectConfig', '1');
    form.setValue('primaryWeight', '');
    form.setValue('connectionTimeout', '');
    replace([]);
  }, [dcPoolSupported, form, replace]);

  const goNext = async () => {
    const fieldsBySubStep: Array<Array<keyof FormValues>> = [
      isSirix
        ? [
            'serviceType',
            'serviceProperty',
            'aliasName',
            'reportingHost',
            'reportingDbName',
            'reportingAccount',
            'reportingSecret',
          ]
        : ['serviceType', 'serviceProperty', 'aliasName'],
      ['managerAccount', 'managerSecret', 'serviceHost', 'dcNodes'],
      ['accountStart', 'accountEnd', 'sort'],
    ];
    const valid = await form.trigger(fieldsBySubStep[subStep]);
    if (!valid) return;
    onSubStepChange(subStep + 1);
  };

  const testServerHost = async () => {
    const values = form.getValues();
    if (!values.serviceHost.trim()) {
      toast.warning(t('rules.required', { field: t('table.serviceHost') }));
      return;
    }
    if (!values.managerAccount) {
      toast.warning(t('rules.required', { field: t('serversSettingPage.managerAccount') }));
      return;
    }
    if (!values.managerSecret) {
      toast.warning(t('rules.required', { field: t('serversSettingPage.managerSecret') }));
      return;
    }
    setHostTestStatus('testing');
    try {
      const res = await checkMtConnect({
        serviceType: values.serviceType,
        serviceHost: values.serviceHost.trim(),
        serverName: values.aliasName || values.serviceHost.trim(),
        managerAccount: values.managerAccount,
        managerSecret: encryptSecret(values.managerSecret),
      });
      setHostTestStatus(res.code === 0 ? 'passed' : 'failed');
    } catch {
      setHostTestStatus('failed');
    }
  };

  const testNode = async (index: number, fieldId: string) => {
    const values = form.getValues();
    const node = values.dcNodes[index];
    if (!node?.serverAddress.trim()) {
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
        managerSecret: encryptSecret(values.managerSecret),
      });
      setNodeTestStatus(prev => ({ ...prev, [fieldId]: res.code === 0 ? 'passed' : 'failed' }));
    } catch {
      setNodeTestStatus(prev => ({ ...prev, [fieldId]: 'failed' }));
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const params = {
        serviceType: values.serviceType,
        serviceProperty: values.serviceProperty,
        aliasName: values.aliasName.trim(),
        serviceHost: values.serviceHost.trim(),
        managerAccount: values.managerAccount.trim(),
        managerSecret: encryptSecret(values.managerSecret),
        accountStart: showAccountNumber && values.accountStart ? Number(values.accountStart) : '',
        accountEnd: showAccountNumber && values.accountEnd ? Number(values.accountEnd) : '',
        reportingHost: isSirix ? values.reportingHost.trim() : '',
        reportingDbName: isSirix ? values.reportingDbName.trim() : '',
        reportingAccount: isSirix ? values.reportingAccount.trim() : '',
        reportingSecret: isSirix ? values.reportingSecret.trim() : '',
        generateType: serviceType === xforceServiceType ? Number(values.generateType) : 1,
        sort: Number(values.sort),
        ...(values.connectConfig === '2' && dcPoolSupported
          ? {
              connectConfig: 2,
              primaryWeight: values.primaryWeight ? Number(values.primaryWeight) : null,
              switchStrategy: 1,
              connectionTimeout: values.connectionTimeout ? Number(values.connectionTimeout) : null,
              mtServiceDcNodes: values.dcNodes.map((node, index) => ({
                nodeName: node.nodeName.trim(),
                serverAddress: node.serverAddress.trim(),
                region: node.region.trim(),
                weight: node.weight ? Number(node.weight) : null,
                enabled: node.enabled === '1' ? 1 : 0,
                sort: index,
              })),
            }
          : { connectConfig: 1 }),
      };
      const res = await addServer(params);
      if (res.code !== 0 || !res.data?.id) {
        toast.error(res.msg || t('common.AnErrorOccurred'));
        return;
      }
      const serverId = res.data.id;
      synchServerGroup({ serverId });
      onSaved({
        serverId,
        aliasName: values.aliasName.trim(),
      });
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  const dcNodesError =
    form.formState.errors.dcNodes?.root?.message || form.formState.errors.dcNodes?.message;

  const testStatusText = (status: 'idle' | 'testing' | 'passed' | 'failed') =>
    t(
      `serversSettingPage.dcNode${
        status === 'passed'
          ? 'Passed'
          : status === 'failed'
            ? 'Failed'
            : status === 'testing'
              ? 'Testing'
              : 'Untested'
      }`,
    );

  return (
    <RrhForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <div className="flex-1">
        <div className="mb-4">
          <div className="text-foreground text-lg font-medium">
            {t(`quickCreatePage.server.subSteps.${subStep}.title`)}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {t(`quickCreatePage.server.subSteps.${subStep}.desc`)}
          </p>
        </div>

        {subStep === 0 && (
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <FormSelect
              name="serviceType"
              label={t('table.transactionPlatform')}
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={serviceTypeOptions}
            />
            <FormSelect
              name="serviceProperty"
              label={t('common.type')}
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={propertyOptions}
            />
            <FormInput
              name="aliasName"
              label={t('table.serverName')}
              placeholder={t('common.pleaseInput', { field: t('table.serverName') })}
              maxLength={64}
            />
            {isSirix && (
              <>
                <FormInput
                  name="reportingHost"
                  label={t('quickCreatePage.server.reportingHost')}
                  placeholder={t('quickCreatePage.server.reportingHostPlaceholder')}
                  maxLength={32}
                />
                <FormInput
                  name="reportingDbName"
                  label={t('quickCreatePage.server.reportingDbName')}
                  placeholder={t('quickCreatePage.server.reportingDbNamePlaceholder')}
                  maxLength={32}
                />
                <FormInput
                  name="reportingAccount"
                  label={t('quickCreatePage.server.reportingAccount')}
                  placeholder={t('quickCreatePage.server.reportingAccountPlaceholder')}
                  maxLength={32}
                />
                <FormPwdInput
                  name="reportingSecret"
                  label={t('quickCreatePage.server.reportingSecret')}
                  placeholder={t('quickCreatePage.server.reportingSecretPlaceholder')}
                  maxLength={32}
                />
              </>
            )}
          </div>
        )}

        {subStep === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              <FormInput
                name="managerAccount"
                label={t('serversSettingPage.managerAccount')}
                placeholder={t('common.pleaseInput', {
                  field: t('serversSettingPage.managerAccount'),
                })}
                maxLength={32}
              />
              <FormPwdInput
                name="managerSecret"
                label={t('serversSettingPage.managerSecret')}
                placeholder={t('common.pleaseInput', {
                  field: t('serversSettingPage.managerSecret'),
                })}
                maxLength={32}
              />
              <FormInput
                name="serviceHost"
                label={t('table.serviceHost')}
                placeholder={t('common.pleaseInput', { field: t('table.serviceHost') })}
                maxLength={32}
              />
              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={hostTestStatus === 'testing'}
                    onClick={testServerHost}
                  >
                    {t('quickCreatePage.server.testConnect')}
                  </Button>
                  <span
                    className={
                      hostTestStatus === 'passed'
                        ? 'text-sm text-green-600'
                        : hostTestStatus === 'failed'
                          ? 'text-destructive text-sm'
                          : 'text-muted-foreground text-sm'
                    }
                  >
                    {testStatusText(hostTestStatus)}
                  </span>
                </div>
              </div>
            </div>

            {dcPoolSupported && (
              <div className="space-y-4 rounded-lg border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-foreground font-medium">
                      {t('serversSettingPage.connectionConfig')}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {t('serversSettingPage.connectionConfigTip')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={connectConfig === '1' ? 'default' : 'outline'}
                      onClick={() => {
                        form.setValue('connectConfig', '1');
                        form.setValue('primaryWeight', '');
                        form.setValue('connectionTimeout', '');
                        replace([]);
                      }}
                    >
                      {t('serversSettingPage.connectionModeSingle')}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={connectConfig === '2' ? 'default' : 'outline'}
                      onClick={() => form.setValue('connectConfig', '2')}
                    >
                      {t('serversSettingPage.connectionModeDcPool')}
                    </Button>
                  </div>
                </div>

                {connectConfig === '2' && (
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
                        <div className="text-muted-foreground mt-2">
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
                          const status = nodeTestStatus[field.fieldId] || 'idle';
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
                                  name={`dcNodes.${index}.nodeName`}
                                  label={t('serversSettingPage.dcNodeName')}
                                  placeholder={t('serversSettingPage.dcNodeNamePlaceholder')}
                                />
                                <FormInput
                                  name={`dcNodes.${index}.serverAddress`}
                                  label={t('serversSettingPage.dcNodeAddress')}
                                  placeholder={t('serversSettingPage.dcNodeAddressPlaceholder')}
                                />
                                <FormInput
                                  name={`dcNodes.${index}.region`}
                                  label={t('serversSettingPage.dcNodeRegion')}
                                  placeholder={t('serversSettingPage.dcNodeRegionPlaceholder')}
                                />
                                <FormInput
                                  name={`dcNodes.${index}.weight`}
                                  label={t('serversSettingPage.dcNodeWeight')}
                                  placeholder={t('serversSettingPage.dcNodeWeightPlaceholder')}
                                  onInput={event =>
                                    applyInputNormalizer(
                                      event.currentTarget,
                                      normalizePositiveIntegerInput,
                                    )
                                  }
                                />
                                <FormSwitchGroup
                                  name={`dcNodes.${index}.enabled`}
                                  label={t('serversSettingPage.dcNodeEnabled')}
                                  switchItems={[
                                    { value: '1', label: t('common.enable') },
                                    { value: '0', label: t('common.disable') },
                                  ]}
                                />
                                <div className="text-foreground space-y-2 text-sm">
                                  <div>{t('serversSettingPage.dcNodeConnectivity')}</div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={
                                        status === 'passed'
                                          ? 'text-sm text-green-600'
                                          : status === 'failed'
                                            ? 'text-destructive text-sm'
                                            : 'text-muted-foreground text-sm'
                                      }
                                    >
                                      {testStatusText(status)}
                                    </span>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      disabled={status === 'testing'}
                                      onClick={() => testNode(index, field.fieldId)}
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
            )}
          </div>
        )}

        {subStep === 2 && (
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            {showAccountNumber && (
              <>
                <FormInput
                  name="accountStart"
                  label={t('serversSettingPage.accountStart')}
                  placeholder={t('common.pleaseInput', {
                    field: t('serversSettingPage.accountStart'),
                  })}
                  maxLength={32}
                  onInput={event =>
                    applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
                  }
                />
                <FormInput
                  name="accountEnd"
                  label={t('serversSettingPage.accountEnd')}
                  placeholder={t('common.pleaseInput', {
                    field: t('serversSettingPage.accountEnd'),
                  })}
                  maxLength={32}
                  onInput={event =>
                    applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
                  }
                />
              </>
            )}
            <FormInput
              name="sort"
              label={t('table.sort')}
              placeholder={t('common.pleaseInput', { field: t('table.sort') })}
              maxLength={4}
              onInput={event =>
                applyInputNormalizer(event.currentTarget, normalizePositiveIntegerInput)
              }
            />
            {serviceType === xforceServiceType && (
              <FormSwitchGroup
                name="generateType"
                label={t('quickCreatePage.server.generateType')}
                switchItems={[
                  { value: '1', label: t('quickCreatePage.server.generateAuto') },
                  { value: '2', label: t('quickCreatePage.server.generateManual') },
                ]}
              />
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <div>
          {subStep > 0 && (
            <RrhButton type="button" variant="outline" onClick={() => onSubStepChange(subStep - 1)}>
              {t('common.previous')}
            </RrhButton>
          )}
        </div>
        <div className="flex items-center gap-3">
          <RrhButton type="button" variant="outline" onClick={onCancel}>
            {t('common.Cancel')}
          </RrhButton>
          {subStep < 2 ? (
            <RrhButton type="button" onClick={goNext}>
              {t('common.next')}
            </RrhButton>
          ) : (
            <RrhButton type="submit" loading={isPending}>
              {t('common.save')}
            </RrhButton>
          )}
        </div>
      </div>
    </RrhForm>
  );
};
