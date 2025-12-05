import { ServerExceptionNoticeRes } from '@/api/hooks/workbench';
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
      <div>
        <div className="text-muted-foreground text-sm leading-5 font-normal">{item.manager}</div>
        <div className="text-muted-foreground text-sm leading-5 font-normal">
          {t('table.server')}: {item.server}
        </div>
        <div className="text-muted-foreground text-sm leading-5 font-normal">
          {t('table.remarks')}: {item.vhost}
        </div>
        <div className="text-muted-foreground text-sm leading-5 font-normal">
          {t('common.reason')}: {item.reason}
        </div>
      </div>
    ),
  }));
  steps.push({
    label: '',
    status: 'complete',
    content: (
      <div className="text-muted-foreground text-sm leading-5 font-normal">
        {t('common.serverError')}.
      </div>
    ),
  });
  return (
    <div className="overflow-hidden rounded-lg shadow-xs">
      <div className="flex items-center gap-2.5 bg-red-100 p-3 lg:p-6">
        <TriangleAlert className="h-4 w-4 text-red-500" />
        <div className="text-card-foreground text-lg leading-5 font-semibold">
          {t('common.serverErrorTip')}
        </div>
      </div>
      <div className="bg-card mx-auto max-w-2xl p-3 lg:p-6">
        {
          <div className="flex flex-col items-start">
            {steps.map((step, idx) => {
              return (
                <div key={idx} className="flex overflow-hidden pb-3">
                  <div className="relative flex w-3 flex-col items-center">
                    {idx !== steps.length - 1 && (
                      <div className="absolute top-3 left-1/2 z-0 h-full w-[1px] -translate-x-1/2 bg-red-600" />
                    )}
                    <div className="h-3 w-3 rounded-full bg-red-600"></div>
                  </div>
                  <div className="grid gap-2 pl-3">
                    {step.label && (
                      <div className="text-card-foreground text-sm leading-4 font-medium">
                        {step.label}
                      </div>
                    )}
                    {step.content}
                  </div>
                </div>
              );
            })}
          </div>
        }
      </div>
    </div>
  );
};
