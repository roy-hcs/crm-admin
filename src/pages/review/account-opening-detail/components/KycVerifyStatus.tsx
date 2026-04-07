import { cn } from '@/lib/utils';
import { CircleCheck, CircleX, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
export type KycStatus = 'pending' | 'success' | 'fail';
export const KycVerifyStatus = ({
  status,
  statusText,
}: {
  status: KycStatus;
  statusText: string;
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-2xl px-2 py-0.5',
        status === 'pending' ? 'bg-amber-500' : '',
        status === 'success' ? 'bg-green-600' : '',
        status === 'fail' ? 'bg-red-500' : '',
      )}
    >
      {status === 'fail' && <CircleX className="size-2.5 text-white" />}
      {status === 'success' && <CircleCheck className="size-2.5 text-white" />}
      {status === 'pending' && <Loader className="size-2.5 text-white" />}

      <div className="text-xs leading-4 font-medium text-white">{t(statusText)}</div>
    </div>
  );
};
