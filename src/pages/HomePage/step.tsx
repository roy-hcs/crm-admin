import { ServerExceptionNoticeRes } from '@/api/hooks/system/types';
import { TriangleAlert } from 'lucide-react';
import { ReactNode } from 'react';
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
  const steps: Step[] = serverExceptionNotice.map(item => ({
    label: item.createTime,
    status: 'complete',
    content: (
      <div className="mb-3 rounded-lg border border-[#EB575780] bg-[#EB57571A] p-3">
        <div className="mb-1 text-sm leading-3.5 font-medium">{item.manager}</div>
        <div className="text-xs leading-3 font-normal">服务器: {item.server}</div>
        <div className="text-xs leading-3 font-normal">备注： {item.vhost}</div>
        <div className="text-xs leading-3 font-normal">原因: {item.reason}</div>
      </div>
    ),
  }));
  steps.push({
    label: '',
    status: 'complete',
    content: (
      <div className="mb-3 rounded-lg border border-[#EB575780] bg-[#EB57571A] p-3 text-xs">
        若长时间未恢复连接，请检查交易服务器
      </div>
    ),
  });
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 px-5">
        <div>
          <TriangleAlert className="h-5 w-5 text-[#EB5757]" />
        </div>
        <span className="inline-block text-xl leading-5 font-semibold">
          Abnormal transaction server
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
                <div className="absolute top-3 left-1/2 z-0 h-full w-0.25 -translate-x-1/2 bg-[#EB575780]" />
              )}
              {/* 圆形 */}
              <div className="relative z-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#EB575740]">
                <div className="h-2 w-2 rounded-full bg-[#EB5757]"></div>
              </div>
            </div>
            <div className="pl-5">
              {/* 这里补齐你的文字和内容样式 */}
              {step.label && (
                <div className="mb-4 text-xs font-normal text-[#757F8D]">{step.label}</div>
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
