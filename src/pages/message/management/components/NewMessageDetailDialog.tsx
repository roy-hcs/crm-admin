import { MsgDetail, useMsgDetail } from '@/api/hooks/message';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhTag } from '@/components/common/RrhTag';
import { infoTypeOptions, receiveTypeOptions } from '@/lib/const';
import { Dispatch, JSX, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const NewMessageDetailDialog = ({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id?: string;
}) => {
  const { t } = useTranslation();
  const { mutateAsync: getMsg } = useMsgDetail();
  const [initLoading, setInitLoading] = useState(false);
  const [detail, setDetail] = useState<MsgDetail | null>(null);

  const infoList = useMemo(() => {
    if (!detail) return [];
    const type = infoTypeOptions.find(i => i.value === String(detail.msg.type))?.label;
    const content =
      detail.msgLangs.find(i => i.language === detail.msg.primaryLanguage)?.content || '';

    const receiveType =
      receiveTypeOptions.find(i => i.value === String(detail.msg.receiveType))?.label || '';

    const sendStatus = detail.msg.status;
    const sendStatusMap: Record<'-1' | '0' | '1' | '2', JSX.Element> = {
      '-1': <RrhTag type="error">{t('common.failedToSend')}</RrhTag>,
      '0': <RrhTag type="warning">{t('common.toBeSent')}</RrhTag>,
      '1': <RrhTag type="success">{t('common.hasBeenSent')}</RrhTag>,
      '2': <RrhTag type="info">{t('common.sending')}</RrhTag>,
    };
    type SendStatusKey = '-1' | '0' | '1' | '2';
    return [
      {
        label: t('table.infoType'),
        value: <div>{type ? t(type) : ''}</div>,
      },
      {
        label: t('table.sendTime'),
        value: <div>{detail?.msg.sendTime || ''}</div>,
      },
      {
        label: t('table.receiver'),
        value: <div>{receiveType ? t(receiveType) : ''}</div>,
      },
      {
        label: t('messageManagement.sendStatus'),
        value: sendStatusMap[String(sendStatus) as SendStatusKey] || '',
      },
      {
        label: t('table.title'),
        value: <div>{detail?.msg.title || ''}</div>,
      },
      {
        label: t('table.content'),
        // 渲染html字符串
        value: <div dangerouslySetInnerHTML={{ __html: content }} />,
      },
    ];
  }, [detail, t]);

  useEffect(() => {
    if (!open || !id) return;

    async function getDetail() {
      try {
        setInitLoading(true);
        // 每次打开弹窗重新加载前，先清空旧数据，避免短暂显示上一次内容
        setDetail(null);
        const res = await getMsg(String(id) || '');
        if (res?.code !== 0) return;
        setDetail(res.data);
      } finally {
        setInitLoading(false);
      }
    }
    getDetail();
  }, [getMsg, id, open]);
  return (
    <RrhDialog
      title={t('messageManagement.detail')}
      open={open}
      onOpenChange={setOpen}
      confirmShow={false}
      formLoading={initLoading}
      variant="large"
    >
      <div>
        {infoList.map(item => (
          <LabelItem key={item.label} label={item.label} ContentDom={item.value} />
        ))}
      </div>
    </RrhDialog>
  );
};
