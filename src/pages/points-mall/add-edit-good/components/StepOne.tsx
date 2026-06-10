import { FormCheckBoxGroup } from '@/components/form/FormCheckBoxGroup';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useTranslation } from 'react-i18next';
import { UploadFile } from './UploadFile';
import { FormSwitch } from '@/components/form/FormSwitch';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import { SelectOption } from '@/api/types';
import { FormSelectCountries } from './FormSelectCountries';
import { FormInputWithUnit } from '@/components/form/FormInputWithUnit';
import { Plus } from 'lucide-react';
import { RrhButton } from '@/components/common/RrhButton';
import { useCrmFormContext } from '@/contexts/form';
import { useFieldArray } from 'react-hook-form';
import { FormValues } from '../form-types';
import { FormSwitchGroup } from '@/components/form/FormSwitchGroup';

export function StepOne({
  payTypeValue,
  firstClassificationIdValue,
  goodsTypeValue,
  roleOptions,
}: {
  payTypeValue: string;
  firstClassificationIdValue: string;
  goodsTypeValue: string;
  roleOptions: SelectOption[];
}) {
  const { t } = useTranslation();
  const { form } = useCrmFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'combinationPaymentList',
  });

  return (
    <div className="grid gap-6">
      <FormInput
        name="goodName"
        label={t('products.name')}
        placeholder={t('rules.limitLength', {
          field: 50,
        })}
        maxLength={50}
      />
      <FormCheckBoxGroup
        label={t('redemptionRecords.payMent')}
        name="payType"
        options={[
          { value: '1', label: t('redemptionRecords.pointsPayment'), disabled: true },
          { value: '2', label: t('redemptionRecords.combinedPayment') },
        ]}
      />
      <FormInput
        name="exchangePoints"
        label={t('products.exchangePoints')}
        placeholder={t('products.enterExchangePoints')}
      />
      {payTypeValue.includes('2') && (
        <div className="grid gap-3">
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-end gap-3">
              <div className="flex-1">
                <FormInput
                  name={`combinationPaymentList.${index}.exchangePoint`}
                  label={index === 0 ? t('products.combinationPayment') : ''}
                  placeholder={t('products.enterExchangePoints')}
                />
              </div>
              <div className="flex h-10 w-3.5 items-center">
                <Plus className="size-3" />
              </div>
              <div className="flex-1">
                <FormInputWithUnit
                  name={`combinationPaymentList.${index}.exchangeAmount`}
                  unit="USD"
                  placeholder={t('products.enterExchangeAmount')}
                />
              </div>
              <div className="flex items-center gap-2">
                <RrhButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ exchangePoint: '', exchangeAmount: '' })}
                >
                  +
                </RrhButton>
                <RrhButton
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={fields.length <= 1}
                  onClick={() => {
                    if (fields.length > 1) {
                      remove(index);
                    }
                  }}
                >
                  -
                </RrhButton>
              </div>
            </div>
          ))}
        </div>
      )}
      <FormSwitch name="status" label={t('table.status')} />
      <FormInput name="sort" label={t('table.sort')} placeholder="1-99999" />
      <FormItem>
        <div>
          <FormLabel>{t('products.productCategory')}</FormLabel>
        </div>
        <div className="grid gap-2">
          <FormSelect
            verticalLabel={false}
            options={[
              { label: t('products.cosmetics'), value: '1' },
              { label: t('products.electronics'), value: '2' },
            ]}
            name="firstClassificationId"
            showRowValue={false}
            placeholder={t('common.pleaseSelect')}
          />
          <FormSelect
            verticalLabel={false}
            options={
              firstClassificationIdValue === '1'
                ? [
                    { label: t('products.cosmeticsOptions.1'), value: '1-1' },
                    { label: t('products.cosmeticsOptions.2'), value: '1-2' },
                  ]
                : firstClassificationIdValue === '2'
                  ? [
                      { label: t('products.electronicsOptions.1'), value: '2-1' },
                      { label: t('products.electronicsOptions.2'), value: '2-2' },
                    ]
                  : []
            }
            name="secondClassificationId"
            showRowValue={false}
            placeholder={t('common.pleaseSelect')}
          />
        </div>
      </FormItem>
      <FormSwitchGroup
        name="goodsType"
        label={t('products.goodsType')}
        switchItems={[
          {
            value: '1',
            label: t('products.virtualGoods'),
          },
          {
            value: '2',
            label: t('products.physicalGoods'),
          },
        ]}
      />
      {goodsTypeValue === '1' && (
        <FormSwitchGroup
          name="virtualGoodsType"
          label={t('products.goodsType')}
          switchItems={[
            {
              value: '1',
              label: t('products.virtualGoodsOptions.1'),
            },
            {
              value: '2',
              label: t('products.virtualGoodsOptions.2'),
            },
            {
              value: '3',
              label: t('products.virtualGoodsOptions.3'),
            },
          ]}
        />
      )}
      <FormField
        name="fileList"
        render={({ field }) => {
          return (
            <UploadFile
              label={t('products.goodPreviewImage')}
              field={field}
              description={t('ticketList.attachmentDescription', {
                fileTypes: 'jpg, jpeg, png',
                maxSize: 10,
              })}
            />
          );
        }}
      />
      <FormSelectCountries
        name="countryId"
        label={t('products.countryId')}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('products.countryIdDesc')}
          </div>
        }
      />
      <FormMultiSelect
        name="applicableRoles"
        label={t('products.applicableRoles')}
        verticalLabel
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={roleOptions}
        labeTipsDom={
          <div className="text-muted-foreground text-xs leading-4">
            {t('products.applicableRolesDesc')}
          </div>
        }
      />
    </div>
  );
}
