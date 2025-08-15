import { ReactNode } from 'react';

type Step = {
  label: string;
  status?: 'complete' | 'error' | 'current' | 'upcoming';
  content?: ReactNode;
};
interface VerticalStepperProps {
  steps: Step[];
}
const Stepper = ({ steps }: VerticalStepperProps) => {
  return (
    <div className="flex flex-col items-start">
      {steps.map((step, idx) => {
        return (
          <div key={idx} className="flex overflow-hidden">
            <div className="relative flex w-3 flex-col items-center">
              {/* 如果是最后一个不需要展示线 */}
              {idx !== steps.length - 1 && (
                <div className="absolute top-3 left-1/2 z-0 h-full w-[0.5px] -translate-x-1/2 bg-[#EB575780]" />
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
export default Stepper;
