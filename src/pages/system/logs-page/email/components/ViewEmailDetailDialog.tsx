import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhButton } from '@/components/common/RrhButton';
import { Input } from '@/components/ui/input';
import { useGetEmailMsgDetail, useShowEmailVerifyCode } from '@/api/hooks/system/system';
import { toast } from 'sonner';

const maskedCodeReg = /\*{6}<\/span>/;

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
  const {
    data: emailMsgDetail,
    isLoading: getDetailLoading,
    isError,
  } = useGetEmailMsgDetail(userMsgId, {
    enabled: !!userMsgId && open,
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeElement, setIframeElement] = useState<HTMLIFrameElement | null>(null);
  // Google 验证码校验通过后的未脱敏内容
  const [verifiedContent, setVerifiedContent] = useState('');
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [googleCode, setGoogleCode] = useState('');
  const { mutateAsync: showVerifyCode, isPending: verifyLoading } = useShowEmailVerifyCode();

  const rawContent = emailMsgDetail?.data?.content || '';
  const displayContent = verifiedContent || rawContent;
  const hasMaskedCode = !!rawContent && maskedCodeReg.test(rawContent);

  useEffect(() => {
    setVerifiedContent('');
    setVerifyOpen(false);
    setGoogleCode('');
  }, [userMsgId]);

  useEffect(() => {
    if (!open) return;
    const iframe = iframeElement;
    if (displayContent && iframe) {
      if (!iframe) return;

      // 写入 HTML 内容
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(displayContent);
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
  }, [open, displayContent, iframeElement]);

  useEffect(() => {
    if (isError) toast.error(t('common.AnErrorOccurred'));
  }, [isError, t]);

  const onCancel = () => {
    setOpen(false);
  };

  const onVerifySubmit = async () => {
    const code = googleCode.trim();
    if (!code) {
      toast.error(t('common.pleaseInput', { field: t('common.googleAuthCode') }));
      return;
    }
    try {
      const res = await showVerifyCode({ id: userMsgId, googleCode: code });
      if (res.code === 0) {
        setVerifiedContent(res.data || '');
        setVerifyOpen(false);
        setGoogleCode('');
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error verifying google code:', error);
    }
  };

  const onClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setVerifyOpen(false);
      setGoogleCode('');
      // 清空 iframe 内容
      const iframe = iframeRef.current;
      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write('');
          doc.close();
        }
      }
    }
  };

  return (
    <>
      <RrhDialog
        title={t('emailLogsPage.emailPreview')}
        isConfirmDisabled={getDetailLoading}
        open={open}
        onOpenChange={onClose}
        onCancel={onCancel}
        variant="adaptive"
        className="md:max-w-[92vw]"
        contentClassName="max-h-[calc(90vh-96px)]"
        type="view"
        formLoading={getDetailLoading}
        confirmShow={false}
      >
        {hasMaskedCode && !verifiedContent && (
          <div className="mb-2 flex justify-end">
            <RrhButton
              variant="outline"
              size="sm"
              onClick={() => setVerifyOpen(true)}
              className="cursor-pointer"
            >
              {t('emailLogsPage.viewVerifyCode')}
            </RrhButton>
          </div>
        )}
        <div className="flex justify-center">
          <iframe
            ref={node => {
              iframeRef.current = node;
              setIframeElement(node);
            }}
            style={{ border: 'none', minHeight: '120px' }}
            title="HTML Preview"
            sandbox="allow-same-origin" // 如果需要允许加载同源资源，可添加，但注意安全
          />
        </div>
      </RrhDialog>
      <RrhDialog
        title={t('emailLogsPage.viewVerifyCode')}
        open={verifyOpen}
        onOpenChange={setVerifyOpen}
        onCancel={() => {
          setVerifyOpen(false);
          setGoogleCode('');
        }}
        onConfirm={onVerifySubmit}
        isConfirmDisabled={verifyLoading}
        formLoading={verifyLoading}
        variant="middle"
        type="submit"
      >
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">{t('emailLogsPage.viewVerifyCodeTip')}</p>
          <Input
            value={googleCode}
            onChange={e => setGoogleCode(e.target.value.replace(/\D/g, ''))}
            placeholder={t('common.pleaseInput', { field: t('common.googleAuthCode') })}
            autoComplete="off"
            inputMode="numeric"
          />
          <Link to="/account/profile" className="text-primary text-xs hover:underline">
            {t('common.googleAuthBindTip')}
          </Link>
        </div>
      </RrhDialog>
    </>
  );
};
