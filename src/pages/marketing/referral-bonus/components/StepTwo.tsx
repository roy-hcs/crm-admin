import { RrhCard } from '@/components/common/RrhCard';
import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';
import { FormField } from '@/components/ui/form';
import { useCrmFormContext } from '@/contexts/form';
import { RichTextEditor } from '@/pages/message/management/components/RichTextEditor';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FormValues, ReferralBonusLanguageOption } from '../types';
import { FormInput } from '@/components/form/FormInput';
import { UploadFile } from '../../ads/components/components/UploadFile';

export function StepTwo({ languageOptions }: { languageOptions: ReferralBonusLanguageOption[] }) {
  const { t } = useTranslation();
  const { form } = useCrmFormContext<FormValues>();
  const { fields: titleLanguageFields } = useFieldArray({
    control: form.control,
    name: 'titleLanguageList',
  });
  const [activeLang, setActiveLang] = useState('zh-CN');

  useEffect(() => {
    if (!languageOptions?.length) return;
    const hasActiveLang = languageOptions.some(item => item.language === activeLang);
    if (!hasActiveLang) {
      setActiveLang(languageOptions[0]?.language || 'zh-CN');
    }
  }, [activeLang, languageOptions]);

  const activeFieldIndex = useMemo(() => {
    return titleLanguageFields.findIndex(field => field.language === activeLang);
  }, [activeLang, titleLanguageFields]);

  return (
    <RrhCard>
      <RrhSwitchGroup
        value={activeLang}
        onValueChange={value => {
          setActiveLang(value);
        }}
        labelClassName="font-medium"
        switchItems={(languageOptions || []).map(i => ({
          value: i?.language || '',
          label: i?.languageLabel || '',
        }))}
      />
      <div>
        {activeFieldIndex >= 0 && (
          <div key={titleLanguageFields[activeFieldIndex]?.id}>
            <FormInput
              className="py-6"
              name={`titleLanguageList.${activeFieldIndex}.rewardTitle`}
              label={t('rewardConfigPage.rewardTitle')}
              placeholder={t('rules.limitLength', {
                field: 12,
              })}
              maxLength={12}
            />

            <FormField
              name={`titleLanguageList.${activeFieldIndex}.icon`}
              render={({ field }) => {
                return (
                  <UploadFile
                    label={t('rewardConfigPage.activityImage')}
                    field={field}
                    description={t('ticketList.attachmentDescription', {
                      fileTypes: 'jpg, jpeg, png',
                      maxSize: 10,
                    })}
                  />
                );
              }}
            />

            <FormField
              name={`titleLanguageList.${activeFieldIndex}.activityContent`}
              render={({ field }) => {
                return (
                  <RichTextEditor
                    className="py-6"
                    field={field}
                    title={t('rewardConfigPage.eventIntroduction')}
                  />
                );
              }}
            />
          </div>
        )}
      </div>
    </RrhCard>
  );
}
