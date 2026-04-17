import { useEffect } from 'react';
import { useForm } from 'react-hook-form';


import { ServerItem } from '@/api/hooks/workbench';
import { RrhServerSelector } from '@/components/common/RrhServerSelector';
import { RrhForm } from '@/components/form/RrhForm';
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

  // 当父级提供初始 serverId 或服务器列表加载完成后自动填充
  if (!form.getValues('serverId') && (initialServerId || serverOptions[0])) {
    const auto = initialServerId || serverOptions[0]?.id || '';
    if (auto) form.setValue('serverId', auto, { shouldDirty: false, shouldTouch: false });
  }

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
