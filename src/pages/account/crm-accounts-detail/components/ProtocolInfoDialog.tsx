import { ProtocolItem } from '@/api/hooks/agent/types';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhPdfViewer } from '@/components/common/RrhPdfViewer';
import { useTranslation } from 'react-i18next';

export const ProtocolInfoDialog = ({
  open,
  setOpen,
  protocolItem,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  protocolItem: ProtocolItem | null;
}) => {
  const { t } = useTranslation();
  if (!protocolItem) {
    return null;
  }
  const attaches = protocolItem.enclosureUrl
    ? (JSON.parse(protocolItem.enclosureUrl) as { url: string; name: string }[])
    : [];
  return (
    <RrhDialog
      title={protocolItem.protocolName}
      open={open}
      variant="large"
      className="!max-h-[80vh h-[90vh]"
      onOpenChange={setOpen}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-1 flex-col gap-4">
          <div>{t('table.protocolContent')}:</div>
          {protocolItem.type === 1 ? (
            <div
              className="min-h-20 flex-1 rounded-lg border p-4"
              dangerouslySetInnerHTML={{ __html: protocolItem.content }}
            ></div>
          ) : (
            <RrhPdfViewer
              url={protocolItem.fileUrl}
              className="min-h-20 flex-1 rounded-lg border p-4"
            />
          )}
        </div>
        <div>
          <div>{t('table.signature')}:</div>
          {protocolItem.signatureUrl && (
            <img loading="lazy" src={protocolItem.signatureUrl} alt="signature" />
          )}
        </div>
        {/* this is original code <a th:href="${'/common/urlDownload?url='+one.url+'&fileName='+one.name}" th:download="${one.name}">[[${one.name}]]</a> */}
        {/* not sure if enclosureUrl is deprecated, not sure if my conclusion structure of it is right, keep the same structure with the original code here first */}
        {protocolItem.enclosureUrl && (
          <div>
            <div>{t('ticketList.attachment')}:</div>
            {attaches.map((attach, index) => (
              <div key={index}>
                <a
                  href={`/common/urlDownload?url=${attach.url}&fileName=${attach.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {attach.name}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </RrhDialog>
  );
};
