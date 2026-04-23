import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhForm } from '@/components/form/RrhForm';
import { useEditLoyaltyReward, useGetBaseSettings } from '@/api/hooks/copyTrading';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useGlobalLoading } from '@/contexts/loading';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { PageInfo } from '@/components/common/PageInfo';
import { ToolTip } from '@/components/common/ToolTip';
import { CircleAlert } from 'lucide-react';

type FormValues = {
  id: string;
  performanceFeeReduce: string;
  performanceFeeRebatBonus: string;
};

const normalizePositiveNumberWithTwoDecimalsInput = (raw: string) => {
  let normalized = raw.replace(/[^\d.]/g, '');
  const firstDotIndex = normalized.indexOf('.');
  if (firstDotIndex !== -1) {
    normalized =
      normalized.slice(0, firstDotIndex + 1) +
      normalized.slice(firstDotIndex + 1).replace(/\./g, '');
  }

  const [integerPartRaw = '', decimalPartRaw = ''] = normalized.split('.');
  const integerPart = integerPartRaw.replace(/^0+(?=\d)/, '');
  const decimalPart = decimalPartRaw.slice(0, 2);

  if (!integerPart && !decimalPart && !normalized.includes('.')) return '';
  if (normalized.includes('.')) {
    return `${integerPart || '0'}.${decimalPart}`;
  }

  // Pure integer input does not allow 0, to keep it positive.
  return integerPart === '0' ? '' : integerPart;
};

export function LoyaltyReward() {
  const { t } = useTranslation();
  const { withLoading } = useGlobalLoading();
  const { data, isLoading: initLoading } = useGetBaseSettings();
  const { mutateAsync: edit } = useEditLoyaltyReward();
  const userVipItem = data?.data?.userVipList?.[0];
  const id = userVipItem?.id || '';
  const performanceFeeReduce = `${userVipItem?.performanceFeeReduce ?? ''}`;
  const performanceFeeRebatBonus = `${userVipItem?.performanceFeeRebatBonus ?? ''}`;
  const name = userVipItem?.name || '';
  const userCount = userVipItem?.userCount || 0;
  const hasInitializedRef = useRef(false);

  const form = useForm<FormValues>({
    defaultValues: {
      id: '',
      performanceFeeReduce: '',
      performanceFeeRebatBonus: '',
    },
  });

  useEffect(() => {
    if (!id || hasInitializedRef.current) return;
    form.reset({
      id: id,
      performanceFeeReduce: performanceFeeReduce,
      performanceFeeRebatBonus: performanceFeeRebatBonus,
    });
    hasInitializedRef.current = true;
  }, [form, id, performanceFeeRebatBonus, performanceFeeReduce]);

  const onSubmit = async (data: FormValues) => {
    await withLoading(async () => {
      try {
        const params = {
          tab: 5,
          vipData: JSON.stringify({
            id: data.id,
            performanceFeeReduce: data.performanceFeeReduce,
            performanceFeeRebatBonus: data.performanceFeeRebatBonus,
          }),
        };
        const res = await edit(params);
        if (res.code === 0) {
          toast.success(t('common.success'));
        } else {
          toast.error(res.msg);
        }
      } catch {
        toast.error(t('common.AnErrorOccurred'));
      }
    });
  };

  if (initLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />
      </div>
    );
  }
  return (
    <RrhForm form={form} className="grid gap-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <PageInfo
        title={t('copyTradingSettings.loyaltyLevel')}
        desc={t('copyTradingSettings.loyaltyLevelDesc')}
      />

      <div>{name}</div>
      <div>1</div>
      <div>{userCount}</div>

      <FormField
        name="performanceFeeReduce"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel className="leading-5">
                {t('copyTradingSettings.performanceFeeReduce')}
              </FormLabel>
              <div>
                <ToolTip
                  content={
                    <span className="whitespace-pre-line">
                      {t('copyTradingSettings.performanceFeeReduceTip')}
                    </span>
                  }
                >
                  <CircleAlert className="text-muted-foreground size-4" />
                </ToolTip>
              </div>
            </div>
            <FormControl>
              <Input
                className="h-10 text-sm"
                inputMode="decimal"
                pattern="^([1-9]\d*)(\.\d{0,2})?$"
                value={field.value}
                onChange={e =>
                  field.onChange(normalizePositiveNumberWithTwoDecimalsInput(e.target.value))
                }
                placeholder={t('copyTradingSettings.enterExtraReward')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="performanceFeeRebatBonus"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel className="leading-5">
                {t('copyTradingSettings.performanceFeeRebatBonus')}
              </FormLabel>
              <div>
                <ToolTip
                  content={
                    <span className="whitespace-pre-line">
                      {t('copyTradingSettings.performanceFeeRebatBonusTip')}
                    </span>
                  }
                >
                  <CircleAlert className="text-muted-foreground size-4" />
                </ToolTip>
              </div>
            </div>
            <FormControl>
              <Input
                className="h-10 text-sm"
                inputMode="decimal"
                pattern="^([1-9]\d*)(\.\d{0,2})?$"
                value={field.value}
                onChange={e =>
                  field.onChange(normalizePositiveNumberWithTwoDecimalsInput(e.target.value))
                }
                placeholder={t('copyTradingSettings.enterExtraReward')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="text-right">
        <RrhButton type="submit" variant="default" disabled={!form.formState.isDirty}>
          {t('common.Confirm')}
        </RrhButton>
      </div>
    </RrhForm>
  );
}
