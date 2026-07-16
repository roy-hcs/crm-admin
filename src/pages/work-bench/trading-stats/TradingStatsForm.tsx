import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { ServerItem } from '@/api/hooks/workbench';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { RrhForm } from '@/components/form/RrhForm';
import { useServerIdAutoFill } from '@/hooks/useServerIdAutoFill';
type ClientTrackingFormValues = {
  serverId: string;
};
export const TradingStatsForm = ({
  setServerId,
  serverOptions,
  initialServerId,
}: {
  setServerId: (id: string) => void;
  serverOptions: ServerItem[];
  initialServerId?: string;
}) => {
  const form = useForm<ClientTrackingFormValues>({
    defaultValues: {
      serverId: initialServerId || '',
    },
  });

  useServerIdAutoFill(form, initialServerId, serverOptions);

  // 监听 serverId 变化自动回调（代替手动提交）
  const currentServerId = form.watch('serverId');
  useEffect(() => {
    if (currentServerId) {
      setServerId(currentServerId);
    }
  }, [currentServerId, setServerId]);

  return (
    <RrhForm form={form} className="flex flex-col gap-4 overflow-auto">
      <RrhServerSelector serverOptions={serverOptions} />
    </RrhForm>
  );
};
