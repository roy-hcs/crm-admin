import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { useGetEmailMsgDetail } from '@/api/hooks/system/system';

export const ViewEmailDetailDialog = ({
  open: openProp,
  setOpen: onOpenChange,
  userMsgId,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  userMsgId: string;
}) => {
  const { t } = useTranslation();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const { mutateAsync: getDetail, isPending } = useGetEmailMsgDetail();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!open || !userMsgId) return;

    (async () => {
      const res = await getDetail(userMsgId);
      if (res?.data?.content) {
        const iframe = iframeRef.current;
        if (!iframe) return;

        // 写入 HTML 内容
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(res.data.content);
          doc.close();

          if (doc.documentElement) {
            doc.documentElement.style.overflow = 'hidden';
          }
          if (doc.body) {
            doc.body.style.overflow = 'hidden';
            doc.body.style.margin = '0';
          }

          // 调整 iframe 高度以适应内容（可选）
          const resize = () => {
            const height = Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight || 0);
            let width = Math.max(doc.documentElement.scrollWidth, doc.body?.scrollWidth || 0);
            const maxWidth = Math.floor(window.innerWidth * 0.9);

            iframe.style.height = `${height}px`;
            if (width < 600) {
              width = 600;
            }
            iframe.style.width = `${Math.min(width, maxWidth)}px`;
          };
          resize();
          // 若内容中有图片，等图片加载完再调整
          const images = doc.querySelectorAll('img');
          let loadedCount = 0;
          images.forEach(img => {
            if (img.complete) {
              loadedCount++;
              if (loadedCount === images.length) resize();
            } else {
              img.addEventListener('load', resize);
              img.addEventListener('error', resize); // 加载失败也要调整
            }
          });
        }
      }
    })();
  }, [open, getDetail, userMsgId]);

  const onCancel = () => {
    setOpen(false);
  };

  const onClose = (open: boolean) => {
    setOpen(open);
  };

  return (
    <RrhDialog
      title={t('emailLogsPage.emailPreview')}
      isConfirmDisabled={isPending}
      open={open}
      onOpenChange={onClose}
      onCancel={onCancel}
      variant="adaptive"
      className="md:max-w-[92vw]"
      contentClassName="max-h-[calc(90vh-96px)]"
      type="view"
      formLoading={isPending}
      confirmShow={false}
    >
      <div className="flex justify-center">
        <iframe
          ref={iframeRef}
          style={{ border: 'none', minHeight: '120px' }}
          title="HTML Preview"
          sandbox="allow-same-origin" // 如果需要允许加载同源资源，可添加，但注意安全
        />
      </div>
    </RrhDialog>
  );
};
