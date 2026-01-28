import { PaymentOrderDepositItem } from '@/api/hooks/report';
import { useChangePaymentOrderStatus } from '@/api/hooks/report/report';
import { LabelItem } from '@/components/common/LabelItem';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import { FormSelect } from '@/components/form/FormSelect';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { FormProvider } from '@/contexts/form';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const PaymentOrderEditDialog = ({
  open,
  setOpen,
  paymentOrderItem,
  isLoading,
  onStatusChange,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  paymentOrderItem: PaymentOrderDepositItem;
  isLoading: boolean;
  onStatusChange: () => void;
}) => {
  const { t } = useTranslation();
  const orderInfo = paymentOrderItem.order;
  const orderInfos = [
    {
      label: t('table.fullName'),
      value: paymentOrderItem.userName || '',
    },
    {
      label: t('table.depositAccount'),
      value: paymentOrderItem.accountName || '',
    },
    {
      label: t('table.paymentChannel'),
      value: paymentOrderItem.channelName || '',
    },
    {
      label: t('table.depositAmount'),
      value: `${orderInfo.depositAmount} ${orderInfo.orderType === 1 ? orderInfo.destCurrency : orderInfo.baseCurrency}`,
    },
    {
      label: t('table.payAmount'),
      value: `${orderInfo.payAmount || 0} ${orderInfo.orderType === 1 ? orderInfo.baseCurrency : orderInfo.destCurrency}`,
    },
    {
      label: t('table.receiptAmount'),
      value: `${orderInfo.receiptAmount ? orderInfo.receiptAmount + ' ' + orderInfo.receiptCurrency : '-'}`,
    },
    {
      label: t('table.orderTime'),
      value: orderInfo.createTime,
    },
    {
      label: t('table.orderNumber'),
      value: orderInfo.orderId,
    },
  ];
  const form = useForm({
    defaultValues: {
      orderStatus: 1,
      createVerifyRecord: false,
    },
  });
  const {
    mutate: changePaymentOrderStatus,
    isPending: changePaymentOrderStatusIsPending,
    error: changePaymentOrderStatusError,
    status: changePaymentOrderStatusStatus,
  } = useChangePaymentOrderStatus();
  useEffect(() => {
    if (changePaymentOrderStatusError) {
      toast.error(changePaymentOrderStatusError.message);
    }
  }, [changePaymentOrderStatusError]);
  useEffect(() => {
    if (changePaymentOrderStatusStatus === 'success') {
      toast.success(t('table.statusChangeSuccess'));
      onStatusChange();
      setOpen(false);
    }
  }, [changePaymentOrderStatusStatus, setOpen, t, onStatusChange]);
  const onSubmit = (data: { orderStatus: number; createVerifyRecord: boolean }) => {
    changePaymentOrderStatus({
      id: orderInfo.id,
      userId: orderInfo.userId,
      orderStatus: data.orderStatus,
      createVerifyRecord: data.createVerifyRecord,
    });
  };
  const onCancel = () => {
    setOpen(false);
    form.reset();
  };
  return (
    <RrhDialog
      title={t('common.detail', { field: t('financial.paymentOrders.title') })}
      open={open}
      onOpenChange={setOpen}
      confirmShow={false}
      formLoading={isLoading || changePaymentOrderStatusIsPending}
      variant="large"
      footerShow={false}
    >
      <FormProvider form={form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <h3 className="text-card-foreground font-semibold">{t('table.orderInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {orderInfos.map(item => (
                <LabelItem
                  key={item.label}
                  label={item.label}
                  ContentDom={<div>{item.value}</div>}
                />
              ))}
            </div>
            <FormSelect
              verticalLabel
              name="orderStatus"
              label={t('table.payResult')}
              placeholder={t('common.pleaseSelect')}
              showRowValue={false}
              options={[
                { label: t('common.order.status.completed'), value: 1 },
                { label: t('common.order.status.canceled'), value: 2 },
              ]}
              className="mb-6 py-3"
            />
            <div className="border-muted col-span-full -mx-6 flex justify-between border-t px-6 py-6 sm:pb-0">
              <FormField
                name="createVerifyRecord"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex h-9 items-center gap-3">
                      <div className="flex basis-9/12 items-center">
                        <Switch
                          checked={field.value}
                          onCheckedChange={checked => field.onChange(checked)}
                        />
                      </div>
                      <FormLabel className="basis-3/12 whitespace-nowrap">
                        {t('table.createDepositVerifyRecord')}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
                control={form.control}
              />
              <div className="flex justify-end gap-4">
                <RrhButton variant="outline" type="button" className="px-4 py-2" onClick={onCancel}>
                  {t('common.Cancel')}
                </RrhButton>
                <RrhButton
                  type="submit"
                  className="px-4 py-2"
                  loading={changePaymentOrderStatusIsPending}
                >
                  {t('common.Confirm')}
                </RrhButton>
              </div>
            </div>
          </form>
        </Form>
      </FormProvider>
    </RrhDialog>
  );
};
