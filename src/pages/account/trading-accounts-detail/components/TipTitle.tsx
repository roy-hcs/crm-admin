import { CircleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function TipTitle() {
  const { t } = useTranslation();

  return (
    <div className="text-destructive bg-destructive/5 flex gap-3 rounded-lg px-4 py-3">
      <CircleAlert className="text-destructive mt-0.5 size-4" />
      <div>
        <div className="font-medium">{t('common.tips')}</div>
      </div>
    </div>
  );
}
