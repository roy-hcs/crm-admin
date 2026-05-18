import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';

export function RrhRenewDialog() {
  const { t } = useTranslation();

  const accountInfo = [
    {
      label: 'Mobile',
      value: '(+852) 6578 7297',
    },
    {
      label: 'Skype',
      value: ' live:.cid.bb378fcef8496c58',
    },
    {
      label: 'Email',
      value: 'cs@haame.com',
    },
  ];

  return (
    <RrhDialog
      title={t('common.SystemPrompt')}
      trigger={<RrhButton type="button">{t('table.renew')}</RrhButton>}
      variant="small"
      footerShow={false}
    >
      <div>
        {accountInfo.map(item => (
          <div key={item.label} className="flex flex-col gap-2 py-3">
            <label className="text-sm font-medium">{item.label}</label>
            <div className="text-muted-foreground flex items-center gap-3">
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </RrhDialog>
  );
}
