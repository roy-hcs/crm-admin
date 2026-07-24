import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { RrhButton } from '@/components/common/RrhButton';
import { useTabActions } from '@/hooks/useTabActions';
import { cn } from '@/lib/utils';
import { PageInfo } from '@/components/common/PageInfo';
import { RrhCard } from '@/components/common/RrhCard';

type StepKey = 'base' | 'dcPool' | 'account' | 'health';

type StepConfig = {
  key: StepKey;
  title: string;
  description: string;
};

export function QuickCreatePage() {
  const { t } = useTranslation();
  const { openTab } = useTabActions();

  const steps = useMemo<StepConfig[]>(
    () => [
      {
        key: 'base',
        title: t('quickCreatePage.steps.base.title'),
        description: t('quickCreatePage.steps.base.desc'),
      },
      {
        key: 'dcPool',
        title: t('quickCreatePage.steps.dcPool.title'),
        description: t('quickCreatePage.steps.dcPool.desc'),
      },
      {
        key: 'account',
        title: t('quickCreatePage.steps.account.title'),
        description: t('quickCreatePage.steps.account.desc'),
      },
      {
        key: 'health',
        title: t('quickCreatePage.steps.health.title'),
        description: t('quickCreatePage.steps.health.desc'),
      },
    ],
    [t],
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [furthestStepIndex, setFurthestStepIndex] = useState(0);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const goBackToServerList = useCallback(() => {
    const url = '/settings/trading-platform/servers';
    openTab({
      key: url,
      title: t('serversSettingPage.title'),
      path: url,
    });
  }, [openTab, t]);

  const goNext = useCallback(() => {
    if (isLastStep) {
      toast.success(t('common.success'));
      goBackToServerList();
      return;
    }

    setCurrentStepIndex(prev => {
      const next = prev + 1;
      setFurthestStepIndex(old => Math.max(old, next));
      return next;
    });
  }, [goBackToServerList, isLastStep, t]);

  const goPrev = useCallback(() => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  }, []);

  const onStepClick = useCallback(
    (stepIndex: number) => {
      if (stepIndex > furthestStepIndex) return;
      setCurrentStepIndex(stepIndex);
    },
    [furthestStepIndex],
  );

  const renderStepPlaceholder = () => {
    // 接口待对接
    switch (currentStep.key) {
      case 'base':
        return <div>{currentStep.key}</div>;
      case 'dcPool':
        return <div>{currentStep.key}</div>;
      case 'account':
        return <div>{currentStep.key}</div>;
      case 'health':
        return <div>{currentStep.key}</div>;
      default:
        return '';
    }
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageInfo title={t('quickCreatePage.title')} desc={t('quickCreatePage.desc')} />

      <div className="mt-3 grid grid-cols-1 items-start gap-4 lg:grid-cols-[260px_1fr]">
        <RrhCard>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-foreground text-lg font-semibold italic">Quick Start</p>
            <span className="border-primary text-primary rounded-full border px-2 py-1 text-sm font-medium">
              {currentStepIndex + 1}/{steps.length}
            </span>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isDone = index < currentStepIndex;
              const isLocked = index > furthestStepIndex;

              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => onStepClick(index)}
                  disabled={isLocked}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors',
                    isActive && 'border-primary',
                    !isActive && 'border-transparent bg-transparent',
                    isLocked && 'cursor-not-allowed opacity-50',
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
                  </div>
                </button>
              );
            })}
          </div>
        </RrhCard>
        <RrhCard>
          <section className="flex min-h-[560px] flex-col justify-between gap-6">
            <div>
              <h2 className="text-foreground text-2xl font-medium">{currentStep.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm">{currentStep.description}</p>
            </div>

            <div className="flex-1">{renderStepPlaceholder()}</div>

            <div className="flex items-center justify-between">
              <div>
                {currentStepIndex > 0 && (
                  <RrhButton type="button" variant="outline" onClick={goPrev}>
                    {t('common.previous')}
                  </RrhButton>
                )}
              </div>

              <div className="flex items-center gap-3">
                <RrhButton type="button" variant="outline" onClick={goBackToServerList}>
                  {t('common.Cancel')}
                </RrhButton>
                <RrhButton type="button" onClick={goNext}>
                  {isLastStep ? t('quickCreatePage.finish') : t('common.next')}
                </RrhButton>
              </div>
            </div>
          </section>
        </RrhCard>
      </div>
    </div>
  );
}
