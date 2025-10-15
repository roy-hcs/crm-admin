import { ServerExceptionNoticeRes } from '@/api/hooks/system/types';
import { TriangleAlert } from 'lucide-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
type Step = {
  label: string;
  status: 'complete' | 'error' | 'current' | 'upcoming';
  content: ReactNode;
};
export const Step = ({
  serverExceptionNotice,
}: {
  serverExceptionNotice: ServerExceptionNoticeRes | [];
}) => {
  const { t } = useTranslation();
  const steps: Step[] = serverExceptionNotice.map(item => ({
    label: item.createTime,
    status: 'complete',
    content: (
      <div className="border-color-step bg-two-color-step mb-3 rounded-lg border p-3">
        <div className="mb-1 text-sm leading-3.5 font-medium">{item.manager}</div>
        <div className="text-xs leading-3 font-normal">
          {t('table.server')}: {item.server}
        </div>
        <div className="text-xs leading-3 font-normal">
          {t('table.remarks')}: {item.vhost}
        </div>
        <div className="text-xs leading-3 font-normal">
          {t('common.reason')}: {item.reason}
        </div>
      </div>
    ),
  }));
  steps.push({
    label: '',
    status: 'complete',
    content: (
      <div className="border-color-step bg-two-color-step mb-3 rounded-lg border p-3 text-xs">
        {t('common.serverError')}.
      </div>
    ),
  });
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 px-5">
        <div>
          <TriangleAlert className="text-two-color-step h-5 w-5" />
        </div>
        <span className="inline-block text-xl leading-5 font-semibold">
          {t('common.serverErrorTip')}
        </span>
      </div>
      <div className="mx-auto max-w-2xl px-5.5">
        <Stepper steps={steps} />
      </div>
    </div>
  );
};

const Stepper = ({ steps }: { steps: Step[] }) => {
  return (
    <div className="flex flex-col items-start">
      {steps.map((step, idx) => {
        return (
          <div key={idx} className="flex overflow-hidden">
            <div className="relative flex w-3 flex-col items-center">
              {/* 如果是最后一个不需要展示线 */}
              {idx !== steps.length - 1 && (
                <div className="bg-one-color-step absolute top-3 left-1/2 z-0 h-full w-[0.5px] -translate-x-1/2" />
              )}
              {/* 圆形 */}
              <div className="bg-four-color-step relative z-1 flex h-3 w-3 items-center justify-center rounded-full">
                <div className="bg-three-color-step h-2 w-2 rounded-full"></div>
              </div>
            </div>
            <div className="pl-5">
              {/* 这里补齐你的文字和内容样式 */}
              {step.label && (
                <div className="text-three-color-step mb-4 text-xs font-normal">{step.label}</div>
              )}
              {/* 内容 */}
              {step.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};
