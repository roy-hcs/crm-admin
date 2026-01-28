import { useTranslation } from 'react-i18next';
import { RrhDialog } from './RrhDialog';
import { RrhButton } from './RrhButton';
import { FileOutput } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { downloadFile } from '@/lib/utils';

export function ExportButton<T>({
  exportFunction,
  params,
  exportLoading,
  title,
}: {
  exportFunction: (params: T) => Promise<{ code: number; msg: string }>;
  params: T;
  exportLoading: boolean;
  title: string;
}) {
  const { t } = useTranslation();
  const [exportOpen, setExportOpen] = useState(false);
  const handleExport = async () => {
    try {
      const result = await exportFunction(params);

      if (result?.code !== 0 && result?.msg) {
        toast.error(result.msg, { duration: 5000 });
      } else if (result?.code === 0 && result?.msg) {
        downloadFile(result.msg);
        setExportOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(t('common.exportFailed'), { duration: 5000 });
    }
  };
  return (
    <RrhDialog
      title={t('common.SystemPrompt')}
      open={exportOpen}
      onOpenChange={setExportOpen}
      formLoading={exportLoading}
      trigger={
        <RrhButton variant="outline">
          <FileOutput />
          {t('table.export')}
        </RrhButton>
      }
      variant="small"
      footerShow={false}
    >
      <div>
        <div>{t('table.exportAllDataTip', { field: title })}</div>
        <div className="mt-4 flex justify-end gap-4 pb-4 md:pb-0">
          <RrhButton variant="outline" onClick={() => setExportOpen(false)}>
            {t('common.Cancel')}
          </RrhButton>
          <RrhButton variant="default" onClick={handleExport}>
            {t('common.Confirm')}
          </RrhButton>
        </div>
      </div>
    </RrhDialog>
  );
}
