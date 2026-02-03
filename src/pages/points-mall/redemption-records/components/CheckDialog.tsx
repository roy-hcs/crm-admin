import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormProvider } from '@/contexts/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { RrhDialog } from '@/components/common/RrhDialog';
import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';
import { GoodDetailInfo, useExchangeDetailInfo, useExchangeVerify } from '@/api/hooks/pointsMall';
import { FormTextarea } from '@/components/form/FormTextarea';
import { pointsHistoryPayType } from '@/lib/const';
import { toast } from 'sonner';

type FormValues = {
  verifyStatus?: string;
  remark: string;
};

const schemaFun = (t: TFunction<'translation', undefined>) => {
  return {
    remark: z.string().min(1, t('rules.required', { field: t('table.remarks') })),
  };
};

export const CheckDialog = ({
  onSuccess,
  id,
  open,
  setOpen,
}: {
  onSuccess: () => void;
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { mutateAsync: getDetailInfo } = useExchangeDetailInfo();
  const { mutateAsync: exchangeVerify } = useExchangeVerify();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailsData, setDetailsData] = useState<GoodDetailInfo>();

  const schema = useMemo(() => z.object(schemaFun(t)), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      verifyStatus: '1',
      remark: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const param = {
        verifyStatus: data?.verifyStatus || '',
        id: id || '',
        remark: data.remark,
      };
      const res = await exchangeVerify(param);
      if (res.code === 0) {
        toast.success(t('common.success'));
        setOpen(false);
        form.reset();
        onSuccess?.();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  const onConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    if (open && id) {
      async function fetchData() {
        const res = await getDetailInfo({ id: id || '' });
        if (res.code === 0) {
          setDetailsData(res.data);
        }
      }
      fetchData();
    }
  }, [getDetailInfo, open, id]);

  const dataList = useMemo(() => {
    const payMentPlan = pointsHistoryPayType.find(i => i.value === detailsData?.payType)?.label;
    return [
      {
        label: t('rewardRecords.rewardTarget'),
        value: `${detailsData?.userName}(${detailsData?.showId}) - ${detailsData?.email}`,
      },
      {
        label: t('redemptionRecords.goodsName'),
        value: `${detailsData?.goodsName} / ${detailsData?.goodsId}`,
      },
      {
        label: t('redemptionRecords.exchangeAccount'),
        value: detailsData?.exchangeAccount || '-',
        visible: detailsData?.goodsType === '1' && detailsData?.virtualGoodsType !== '1',
      },
      {
        label: t('redemptionRecords.payMent'),
        value: payMentPlan ? t(payMentPlan) : '-',
      },
      {
        label: t('redemptionRecords.pay'),
        type: 'pointsPayment',
        visible: detailsData?.payType === '1',
      },
      {
        label: t('redemptionRecords.pay'),
        type: 'combinedPayment',
        visible: detailsData?.payType === '2',
      },
      {
        label: t('redemptionRecords.receiveAddress'),
        value: `${detailsData?.receiveName} - ${detailsData?.receivePhone} / ${detailsData?.receiveAddress}`,
        visible: detailsData?.goodsType === '2',
      },
    ].filter(item => item.visible !== false);
  }, [detailsData, t]);

  return (
    <RrhDialog
      title={t('table.audit')}
      isConfirmDisabled={isSubmitting}
      open={open}
      onOpenChange={setOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="middle"
      type="submit"
      formLoading={isSubmitting}
    >
      <FormProvider form={form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1">
            {dataList.map((item, index) => {
              if (item.type === 'pointsPayment' || item.type === 'combinedPayment') {
                if (item.type === 'pointsPayment') {
                  // 积分支付
                  return (
                    <div className="grid gap-2 py-3" key={`${item.label}-${index}`}>
                      <div className="text-foreground text-sm leading-5 font-medium">
                        {item.label}
                      </div>
                      <div className="text-muted-foreground text-sm leading-5">
                        {detailsData?.exchangeType === '1'
                          ? `+${detailsData?.exchangePoints} / ${detailsData?.exchangeTime}`
                          : `-${detailsData?.exchangePoints} / ${detailsData?.exchangeTime}`}
                      </div>
                    </div>
                  );
                } else {
                  // 组合支付
                  return (
                    <div className="grid gap-2 py-3" key={`${item.label}-${index}`}>
                      <div className="text-foreground text-sm leading-5 font-medium">
                        {item.label}
                      </div>
                      <div className="bg-primary-foreground grid grid-cols-3 rounded-sm px-6 py-4">
                        <div className="grid gap-2">
                          <div className="text-muted-foreground text-xs leading-3">
                            {t('redemptionRecords.pointsDeduction')}
                          </div>
                          <div className="text-accent-foreground text-sm leading-5">
                            {detailsData?.exchangeType === '1'
                              ? `+${detailsData?.exchangePoints}`
                              : `-${detailsData?.exchangePoints}`}
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <div className="text-muted-foreground text-xs leading-3">
                            {t('redemptionRecords.paymentAmount')}
                          </div>
                          <div className="text-accent-foreground text-sm leading-5">
                            {detailsData?.paymentAmount
                              ? `${detailsData?.paymentAmount} ${detailsData?.currency || 'USD'}`
                              : '-'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              } else {
                // 其他
                return (
                  <div className="grid gap-2 py-3" key={`${item.label}-${index}`}>
                    <div className="text-foreground text-sm leading-5 font-medium">
                      {item.label}
                    </div>
                    <div className="text-muted-foreground text-sm leading-5">
                      {item.value || '-'}
                    </div>
                  </div>
                );
              }
            })}
            <div className="py-3">
              <FormField
                name="verifyStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="leading-5">
                        {t('redemptionRecords.confirmStatus')}
                      </FormLabel>
                      <FormControl>
                        <RrhSwitchGroup
                          value={field.value ?? '0'}
                          onValueChange={value => {
                            field.onChange(value);
                          }}
                          labelClassName="font-medium"
                          switchItems={[
                            {
                              value: '1',
                              label: t('table.pass'),
                            },
                            {
                              value: '0',
                              label: t('table.refuse'),
                            },
                          ]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="py-3">
              <FormTextarea
                name="remark"
                label={t('table.remarks')}
                verticalLabel
                placeholder={t('rules.limitLength', { field: 50 })}
                maxLength={50}
              />
            </div>
          </form>
        </Form>
      </FormProvider>
    </RrhDialog>
  );
};
