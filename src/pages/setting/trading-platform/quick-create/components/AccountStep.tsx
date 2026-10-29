import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhSelect } from '@/components/common/RrhSelect';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  useAccountSettingInfoQS,
  useSaveAccountSettingQS,
  useServerTypeInfo,
} from '@/api/hooks/setting/quickCreate';

type ConditionKey = 'info' | 'finance' | 'identity' | 'protocol';

const conditionKeys: ConditionKey[] = ['info', 'finance', 'identity', 'protocol'];

export const AccountStep = ({
  serverId,
  onDone,
  onCancel,
}: {
  serverId: string;
  onDone: () => void;
  onCancel: () => void;
}) => {
  const { t } = useTranslation();
  const { data, isLoading } = useAccountSettingInfoQS(serverId);
  const { mutateAsync: save, isPending } = useSaveAccountSettingQS();

  const [allowed, setAllowed] = useState('1');
  const [condition, setCondition] = useState('1');
  const [conditions, setConditions] = useState<Record<ConditionKey, boolean>>({
    info: true,
    finance: true,
    identity: true,
    protocol: true,
  });
  const [demoVerify, setDemoVerify] = useState('1');
  const [defaultServer, setDefaultServer] = useState('');
  const [typeSel, setTypeSel] = useState('1');
  const [typeId, setTypeId] = useState('');
  const [typeHide, setTypeHide] = useState(false);
  const [leverSel, setLeverSel] = useState('1');
  const [leverId, setLeverId] = useState('');
  const [leverHide, setLeverHide] = useState(false);

  const detail = data?.data;
  const isReal = !!detail?.isReal;
  const isFirst = !!detail?.isFirst;

  const { data: serverTypeData } = useServerTypeInfo(defaultServer, { enabled: !!defaultServer });
  const serverTypes = useMemo(() => serverTypeData?.data || [], [serverTypeData]);

  const typeOptions = useMemo(
    () => serverTypes.map(item => ({ label: item.accountType, value: item.id })),
    [serverTypes],
  );

  const leverOptions = useMemo(() => {
    const current = serverTypes.find(item => item.id === typeId);
    if (!current?.lever) return [];
    return current.lever
      .split(',')
      .filter(Boolean)
      .map(value => ({ label: `1:${value}`, value }));
  }, [serverTypes, typeId]);

  useEffect(() => {
    if (!detail) return;
    const real = !!detail.isReal;
    // 真实账号默认开启申请；模拟账号以服务端配置为准（未配置视为关闭）
    setAllowed(real ? '1' : detail.demoAccountAllowed === '1' ? '1' : '0');
    setCondition('1');
    setConditions({ info: true, finance: true, identity: true, protocol: true });
    setDemoVerify(detail.demoAccountVerify === '1' ? '1' : '0');

    const serverSelected = !real || !detail.isFirst;
    if (serverSelected) {
      setDefaultServer(detail.defaultSever || '');
      setTypeSel(detail.accountTypeSel === '0' ? '0' : '1');
      setTypeId(detail.accountType || '');
      setTypeHide(detail.accountTypeHide === 'true');
      setLeverSel(detail.leverSel === '0' ? '0' : '1');
      setLeverId(detail.lever || '');
      setLeverHide(detail.leverHide === 'true');
    } else {
      setDefaultServer('');
      setTypeSel('1');
      setTypeId('');
      setTypeHide(false);
      setLeverSel('1');
      setLeverId('');
      setLeverHide(false);
    }
  }, [detail]);

  const serverOptions = useMemo(
    () =>
      (detail?.mtServices || []).map(item => ({
        label: item.aliasName,
        value: item.id,
      })),
    [detail],
  );

  const onServerChange = (value: string) => {
    setDefaultServer(value);
    if (!value) {
      setTypeSel('1');
      setTypeId('');
      setTypeHide(false);
      setLeverSel('1');
      setLeverId('');
      setLeverHide(false);
    }
  };

  const onTypeSelChange = (value: string) => {
    setTypeSel(value);
    if (value === '1') {
      setTypeId('');
      setTypeHide(false);
    }
  };

  const onLeverSelChange = (value: string) => {
    setLeverSel(value);
    if (value === '1') {
      setLeverId('');
      setLeverHide(false);
    }
  };

  const buildPayload = () => {
    const allowedValue = isReal && !isFirst ? undefined : allowed;
    const serverSelected = allowed === '1' && !!defaultServer;
    const nextTypeSel = serverSelected ? typeSel : '1';
    const nextTypeId = nextTypeSel === '0' ? typeId : '';
    const nextTypeHide = nextTypeSel === '0' ? typeHide : false;
    // 账号类型允许自选时，杠杆也必须自选，否则杠杆配置会与类型不匹配
    const nextLeverSel = nextTypeSel === '1' ? '1' : leverSel;
    const nextLeverId = nextLeverSel === '0' ? leverId : '';
    const nextLeverHide = nextLeverSel === '0' ? leverHide : false;

    return {
      serviceId: serverId,
      accountAllowed: allowedValue,
      ...(!isReal && allowed === '1' ? { demoAccountVerify: demoVerify } : {}),
      ...(isReal && isFirst && allowed === '1'
        ? {
            realAccountCondition: condition,
            realAccountConditionPersonInfo: condition === '1' ? conditions.info : undefined,
            realAccountConditionPersonFinance: condition === '1' ? conditions.finance : undefined,
            realAccountConditionPersonIdentity: condition === '1' ? conditions.identity : undefined,
            realAccountConditionProtocol: condition === '1' ? conditions.protocol : undefined,
          }
        : {}),
      severEnable: serverSelected,
      defaultSever: serverSelected ? defaultServer : '',
      accountTypeSel: nextTypeSel,
      accountType: nextTypeId,
      typeHide: nextTypeHide,
      leverSel: nextLeverSel,
      lever: nextLeverId,
      leverHide: nextLeverHide,
    };
  };

  const onSubmit = async () => {
    if (allowed === '1') {
      if (isReal && isFirst && condition === '1' && !conditionKeys.some(key => conditions[key])) {
        toast.warning(t('quickCreatePage.account.conditionRequired'));
        return;
      }
      if (defaultServer) {
        if (typeSel === '0' && !typeId) {
          toast.warning(t('quickCreatePage.account.typeRequired'));
          return;
        }
        if (leverSel === '0' && !leverId) {
          toast.warning(t('quickCreatePage.account.leverRequired'));
          return;
        }
      }
    }
    try {
      const res = await save(buildPayload());
      if (res.code !== 0) {
        toast.error(res.msg || t('common.AnErrorOccurred'));
        return;
      }
      toast.success(t('common.success'));
      onDone();
    } catch {
      toast.error(t('common.AnErrorOccurred'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <RrhCircleLoading />
      </div>
    );
  }

  const renderDefaultSetting = () => (
    <div className="space-y-4 rounded-lg border p-4">
      <div>
        <div className="text-foreground text-sm font-medium">
          {t(
            isReal
              ? 'quickCreatePage.account.defaultRealTitle'
              : 'quickCreatePage.account.defaultDemoTitle',
          )}
        </div>
        <div className="text-muted-foreground mt-1 text-xs">
          {t(
            isReal
              ? isFirst
                ? 'quickCreatePage.account.defaultRealFirstDesc'
                : 'quickCreatePage.account.defaultRealNoFirstDesc'
              : 'quickCreatePage.account.defaultDemoDesc',
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-foreground text-sm">{t('quickCreatePage.account.defaultServer')}</div>
        <RrhSelect
          className="w-full md:w-[400px]"
          options={serverOptions}
          value={defaultServer}
          onValueChange={onServerChange}
          placeholder={t('quickCreatePage.account.chooseServer')}
          showRowValue={false}
        />
      </div>

      {!!defaultServer && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <RrhSelect
              className="w-[230px]"
              options={[
                { label: t('quickCreatePage.account.allowSelectType'), value: '1' },
                { label: t('quickCreatePage.account.appointType'), value: '0' },
              ]}
              value={typeSel}
              onValueChange={onTypeSelChange}
              showRowValue={false}
            />
            {typeSel === '0' && (
              <>
                <RrhSelect
                  className="w-[210px]"
                  options={typeOptions}
                  value={typeId}
                  onValueChange={value => {
                    setTypeId(value);
                    setLeverId('');
                  }}
                  placeholder={t('common.pleaseSelect')}
                  showRowValue={false}
                />
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={typeHide} onCheckedChange={v => setTypeHide(!!v)} />
                  {t('quickCreatePage.account.hideType')}
                </label>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <RrhSelect
              className="w-[230px]"
              options={[
                { label: t('quickCreatePage.account.allowSelectLever'), value: '1' },
                { label: t('quickCreatePage.account.appointLever'), value: '0' },
              ]}
              value={leverSel}
              onValueChange={onLeverSelChange}
              showRowValue={false}
            />
            {leverSel === '0' && (
              <>
                <RrhSelect
                  className="w-[210px]"
                  options={leverOptions}
                  value={leverId}
                  onValueChange={setLeverId}
                  placeholder={t('common.pleaseSelect')}
                  showRowValue={false}
                />
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={leverHide} onCheckedChange={v => setLeverHide(!!v)} />
                  {t('quickCreatePage.account.hideLever')}
                </label>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-5">
        <div>
          <div className="text-foreground text-lg font-medium">
            {t(
              isReal
                ? isFirst
                  ? 'quickCreatePage.account.realTitle'
                  : 'quickCreatePage.account.realNoFirstTitle'
                : 'quickCreatePage.account.demoTitle',
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {t(
              isReal
                ? isFirst
                  ? 'quickCreatePage.account.realDesc'
                  : 'quickCreatePage.account.realNoFirstDesc'
                : 'quickCreatePage.account.demoDesc',
            )}
          </p>
        </div>

        {isReal ? (
          <>
            {isFirst && (
              <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div>
                  <div className="text-foreground text-sm font-medium">
                    {t('quickCreatePage.account.applyRealTitle')}
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    {t('quickCreatePage.account.applyRealDesc')}
                  </div>
                </div>
                <Switch
                  checked={allowed === '1'}
                  onCheckedChange={checked => setAllowed(checked ? '1' : '0')}
                />
              </div>
            )}

            {allowed === '1' && isReal && isFirst && (
              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-foreground text-sm font-medium">
                    {t('quickCreatePage.account.conditionTitle')}
                  </div>
                  <Switch
                    checked={condition === '1'}
                    onCheckedChange={checked => setCondition(checked ? '1' : '0')}
                  />
                </div>
                {condition === '1' && (
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {conditionKeys.map(key => (
                      <Label key={key} className="flex items-center gap-2 text-sm font-normal">
                        <Checkbox
                          checked={conditions[key]}
                          onCheckedChange={checked =>
                            setConditions(prev => ({ ...prev, [key]: !!checked }))
                          }
                        />
                        {t(`quickCreatePage.account.conditions.${key}`)}
                      </Label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {allowed === '1' && renderDefaultSetting()}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <div>
                <div className="text-foreground text-sm font-medium">
                  {t('quickCreatePage.account.applyDemoTitle')}
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  {t('quickCreatePage.account.applyDemoDesc')}
                </div>
              </div>
              <Switch
                checked={allowed === '1'}
                onCheckedChange={checked => setAllowed(checked ? '1' : '0')}
              />
            </div>

            {allowed === '1' && (
              <>
                <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                  <div>
                    <div className="text-foreground text-sm font-medium">
                      {t('quickCreatePage.account.demoVerifyTitle')}
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {t('quickCreatePage.account.demoVerifyDesc')}
                    </div>
                  </div>
                  <Switch
                    checked={demoVerify === '1'}
                    onCheckedChange={checked => setDemoVerify(checked ? '1' : '0')}
                  />
                </div>
                {renderDefaultSetting()}
              </>
            )}
          </>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-3">
          {isReal && !isFirst && (
            <RrhButton type="button" variant="outline" onClick={onDone}>
              {t('quickCreatePage.account.noChange')}
            </RrhButton>
          )}
        </div>
        <div className="flex items-center gap-3">
          <RrhButton type="button" variant="outline" onClick={onCancel}>
            {t('common.Cancel')}
          </RrhButton>
          <RrhButton type="button" loading={isPending} onClick={onSubmit}>
            {t('common.save')}
          </RrhButton>
        </div>
      </div>
    </div>
  );
};
