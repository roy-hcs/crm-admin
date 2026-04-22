import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { PageInfo } from '@/components/common/PageInfo';
import { useCloseOrder, useTicketDetail, useTicketFollow } from '@/api/hooks/ticket/ticket';
import { RrhButton } from '@/components/common/RrhButton';
import { TicketInfo } from './components/TicketInfo';
import { TicketReply } from './components/TicketReply';
import { RrhDeleteAlert } from '@/components/common/RrhDeleteAlert';
import { useState } from 'react';
import { useRoleList, useUserList } from '@/api/hooks/system';
import { RrhFollowAlert } from '@/components/common/RrhFollowAlert';

export const TicketDetailPage = () => {
  const { t } = useTranslation();
  const { data: userData, isLoading: userDataLoading } = useUserList();
  const { data: roleData, isLoading: roleDataLoading } = useRoleList();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const {
    data: ticketDetailRes,
    isLoading,
    refetch,
  } = useTicketDetail(orderId || '', {
    enabled: !!orderId,
  });
  const order = ticketDetailRes?.data.order;
  const replies = ticketDetailRes?.data.replies;
  const ccNames = ticketDetailRes?.data.ccNames || '';
  const [cancelSignal, setCancelSignal] = useState(0);
  const [submitSignal, setSubmitSignal] = useState(0);
  const [editStatus, setEditStatus] = useState(false);
  const [closeAlert, setCloseAlert] = useState(false);
  const { mutateAsync: close } = useCloseOrder();
  const { mutateAsync: modifyStatus } = useTicketFollow();
  const handleClose = () => {
    setCloseAlert(true);
  };

  const onSuccess = () => {
    refetch();
  };

  const handleCancel = () => {
    setCancelSignal(prev => prev + 1);
    setEditStatus(false);
  };

  const handleSubmit = () => {
    setSubmitSignal(prev => prev + 1);
  };

  if (isLoading || userDataLoading || roleDataLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />;
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex justify-between px-2">
        <div className="flex items-center gap-2">
          <PageInfo wrapperCls="py-3" title={t('ticketList.ticketDetail')} />
          <RrhFollowAlert<{
            id: string;
            follow: number;
          }>
            params={{
              id: String(order?.id),
              follow: order?.isFollow === 1 ? 0 : 1,
            }}
            tipsText={order?.isFollow === 1 ? t('ticketList.confirm.stop') : ''}
            checked={order?.isFollow === 1}
            confirmFunction={modifyStatus}
            onSuccess={refetch}
          />
        </div>
        <div className="flex items-center gap-3">
          {editStatus ? (
            <>
              <RrhButton onClick={handleCancel}>{t('common.Cancel')}</RrhButton>
              <RrhButton onClick={handleSubmit}>{t('common.submit')}</RrhButton>
            </>
          ) : (
            <>
              {
                // 2代表已关闭的工单，其他状态才显示关闭按钮
                order && String(order?.status) !== '2' && (
                  <RrhButton onClick={handleClose} variant="outline">
                    {t('ticketList.closeTicket')}
                  </RrhButton>
                )
              }
              <RrhButton
                onClick={() => {
                  setEditStatus(true);
                }}
              >
                {t('common.modify', {
                  field: '',
                })}
              </RrhButton>
            </>
          )}
        </div>
      </div>
      <div className="relative flex flex-col gap-3 md:flex-row md:gap-8">
        <div className="md:max-w-93.5 md:min-w-93.5">
          {order && (
            <TicketInfo
              order={order}
              ccNames={ccNames}
              editStatus={editStatus}
              roleOptions={(roleData?.rows || []).map(i => ({
                label: i.roleName,
                value: i.roleId,
              }))}
              userOptions={(userData?.rows || []).map(i => ({
                label: `${i.userLastName || ''} ${i.userName || ''}`,
                value: i.userId,
              }))}
              cancelSignal={cancelSignal}
              submitSignal={submitSignal}
              onSuccess={() => {
                setEditStatus(false);
                refetch();
              }}
            />
          )}
        </div>
        <div className="w-full">
          <TicketReply onSuccess={onSuccess} replies={replies || []} orderId={orderId || ''} />
        </div>
      </div>

      <RrhDeleteAlert<{
        ids: string;
      }>
        open={closeAlert}
        setOpen={setCloseAlert}
        onSuccess={onSuccess}
        confirmFunction={close}
        params={{ ids: orderId || '' }}
        tipsText={t('ticketList.closeOrder')}
      />
    </div>
  );
};
