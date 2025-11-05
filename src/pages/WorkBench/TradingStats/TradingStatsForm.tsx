import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider } from '@/contexts/form';
import { FormSelect } from '@/components/form/FormSelect';
import { Form } from '@/components/ui/form';
import { useTranslation } from 'react-i18next';
import { ServerItem } from '@/api/hooks/system/types';
import { serverMap } from '@/lib/constant';
import { BaseOption } from '@/components/common/RrhSelect';
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
  const { t } = useTranslation();
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
    <FormProvider form={form}>
      <Form {...form}>
        <form className="flex flex-col gap-4 overflow-auto">
          <FormSelect<
            Record<string, string>,
            BaseOption & {
              serviceProperty: number;
              serviceType: number;
            }
          >
            verticalLabel
            name="serverId"
            label={t('table.server')}
            placeholder={t('common.pleaseSelect')}
            showRowValue={false}
            options={serverOptions.map(item => ({
              label: item.serverName,
              value: item.id,
              serviceProperty: item.serviceProperty,
              serviceType: item.serviceType,
            }))}
            renderItem={option => {
              return (
                <div>
                  <span>{option.serviceProperty === 1 ? t('common.live') : t('common.demo')}</span>
                  {option.serviceType && <span> {serverMap[option.serviceType]} | </span>}
                  <span>{option.label}</span>
                </div>
              );
            }}
          />
        </form>
      </Form>
    </FormProvider>
  );
};
