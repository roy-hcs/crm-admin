import { FC } from 'react';
import { FormSelect } from '../form/FormSelect';
import { BaseOption } from './RrhSelect';
import { useTranslation } from 'react-i18next';
import { serverMap } from '@/lib/constant';
import { ServerItem } from '@/api/hooks/system';

export const RrhServerSelector: FC<{
  name?: string;
  label?: string;
  serverOptions: ServerItem[];
}> = ({ name = 'serverId', label, serverOptions }) => {
  const { t } = useTranslation();
  return (
    <FormSelect<
      Record<string, string>,
      BaseOption & {
        serviceProperty: number;
        serviceType: number;
      }
    >
      verticalLabel
      name={name}
      label={label ?? t('table.server')}
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
  );
};
