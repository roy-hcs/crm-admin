import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { PageInfo } from '@/components/common/PageInfo';
import { useTabActions } from '@/hooks/useTabActions';
import { cn } from '@/lib/utils';
import { ServerStep } from './components/ServerStep';
import { AssociationStep } from './components/AssociationStep';
import { AccountStep } from './components/AccountStep';

type StepKey = 'server' | 'association' | 'account';

const stepKeys: StepKey[] = ['server', 'association', 'account'];
const subStepTotals: Record<StepKey, number> = {
  server: 3,
  association: 2,
  account: 1,
};

export function QuickCreatePage() {
  const { t } = useTranslation();
  const { openTab } = useTabActions();

  const [stepIndex, setStepIndex] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [serverId, setServerId] = useState('');
  const [serverName, setServerName] = useState('');

  const currentKey = stepKeys[stepIndex];
  const subTotal = subStepTotals[currentKey];

  const steps = useMemo(
    () =>
      stepKeys.map(key => ({
        key,
        title: t(`quickCreatePage.steps.${key}.title`),
        description: t(`quickCreatePage.steps.${key}.desc`),
      })),
    [t],
  );

  const goBackToServerList = useCallback(() => {
    const url = '/settings/trading-platform/servers';
    openTab({
      key: url,
      title: t('serversSettingPage.title'),
      path: url,
    });
  }, [openTab, t]);

  const finish = useCallback(() => {
    toast.success(t('common.success'));
    goBackToServerList();
  }, [goBackToServerList, t]);

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageInfo title={t('quickCreatePage.title')} desc={t('quickCreatePage.desc')} />

      <div className="mt-3 grid grid-cols-1 items-start gap-4 lg:grid-cols-[260px_1fr]">
        <RrhCard>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-foreground text-lg font-semibold italic">Quick Start</p>
            <span className="border-primary text-primary rounded-full border px-2 py-1 text-sm font-medium">
              {stepIndex + 1}/{stepKeys.length}
            </span>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => {
              const isActive = index === stepIndex;
              const isDone = index < stepIndex;

              return (
                <div
                  key={step.key}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left',
                    isActive ? 'border-primary' : 'border-transparent opacity-60',
                  )}
                >
                  <div
                    className={cn(
                      'flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                      isActive && 'border-primary text-primary',
                      isDone && 'border-primary bg-primary text-white',
                      !isActive && !isDone && 'border-[#b6c4e3] text-[#6f7f9f]',
                    )}
                  >
                    {index + 1}
                  </div>

                  <div className="space-y-1">
                    <p className="text-foreground text-sm font-medium">{step.title}</p>
                    <p className="text-muted-foreground text-xs">{step.description}</p>
                    {isActive && (
                      <p className="text-primary text-xs">
                        {t('quickCreatePage.subStepProgress', {
                          current: subStep + 1,
                          total: subTotal,
                        })}
                      </p>
                    )}
                    {index === 0 && serverId && (
                      <p className="text-muted-foreground text-xs">{serverName}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <RrhButton
              type="button"
              variant="outline"
              className="w-full"
              onClick={goBackToServerList}
            >
              {t('quickCreatePage.back')}
            </RrhButton>
          </div>
        </RrhCard>

        <RrhCard>
          <section className="flex min-h-[560px] flex-col gap-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-foreground text-2xl font-medium">{steps[stepIndex].title}</h2>
                <p className="text-muted-foreground mt-1 text-sm">{steps[stepIndex].description}</p>
              </div>
              <span className="text-muted-foreground shrink-0 text-sm">
                {t('quickCreatePage.subStepProgress', {
                  current: subStep + 1,
                  total: subTotal,
                })}
              </span>
            </div>

            {currentKey === 'server' && (
              <ServerStep
                subStep={subStep}
                onSubStepChange={setSubStep}
                onSaved={result => {
                  setServerId(result.serverId);
                  setServerName(result.aliasName);
                  setSubStep(0);
                  setStepIndex(1);
                }}
                onCancel={goBackToServerList}
              />
            )}

            {currentKey === 'association' && (
              <AssociationStep
                serverId={serverId}
                subStep={subStep}
                onSubStepChange={setSubStep}
                onSaved={() => {
                  setSubStep(0);
                  setStepIndex(2);
                }}
                onSkip={finish}
                onCancel={goBackToServerList}
              />
            )}

            {currentKey === 'account' && (
              <AccountStep serverId={serverId} onDone={finish} onCancel={goBackToServerList} />
            )}
          </section>
        </RrhCard>
      </div>
    </div>
  );
}
