import { usePointsIntro, useSubmitPointsIntro } from '@/api/hooks/pointsMall';
import { RrhButton } from '@/components/common/RrhButton';
import { RrhCard } from '@/components/common/RrhCard';
import { RrhCircleLoading } from '@/components/common/RrhCircleLoading';
import { RrhSwitchGroup } from '@/components/common/RrhSwitchGroup';
import { FormField } from '@/components/ui/form';
import { useCrmFormContext } from '@/contexts/form';
import { useGlobalLoading } from '@/contexts/loading';
import { cn } from '@/lib/utils';
import { RichTextEditor } from '@/pages/message/management/components/RichTextEditor';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function PointStore({ success }: { success: () => void }) {
  const { data: pointsIntro, isLoading } = usePointsIntro();
  const { withLoading } = useGlobalLoading();
  const { mutateAsync: submitPointsIntro } = useSubmitPointsIntro();
  const languageList = useMemo(
    () => pointsIntro?.data.infoList || [],
    [pointsIntro?.data.infoList],
  );
  const { t } = useTranslation();
  const [activeLang, setActiveLang] = useState('zh-CN');
  const { form } = useCrmFormContext<{ content?: Record<string, string> }>();

  useEffect(() => {
    if (!languageList.length) return;

    const nextContent = languageList.reduce<Record<string, string>>((acc, item) => {
      if (item.language) {
        acc[item.language] = item.pointsIntro || '';
      }
      return acc;
    }, {});

    const currentContent = form.getValues('content') || {};
    const hasSameKeys =
      Object.keys(currentContent).length === Object.keys(nextContent).length &&
      Object.keys(nextContent).every(key => currentContent[key] === nextContent[key]);

    if (hasSameKeys) return;

    form.setValue('content', nextContent, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [form, languageList]);

  useEffect(() => {
    if (!languageList.length) return;
    if (languageList.some(item => item.language === activeLang)) return;
    setActiveLang(languageList[0].language || '');
  }, [activeLang, languageList]);

  const handleSubmit = async () => {
    if (form.getValues().content?.[activeLang] === '') {
      toast.error(
        t('rules.required', {
          field: t('pointsMallSettings.explanation', { field: activeLang }),
        }),
      );
      return;
    }
    const id = pointsIntro?.data.infoList?.find(item => item.language === activeLang)?.id;
    await withLoading(async () => {
      try {
        const params = {
          id: id || '',
          pointsIntro: form.getValues().content?.[activeLang] || '',
          language: activeLang,
        };
        const res = await submitPointsIntro(params);
        if (res.code === 0) {
          toast.success(t('common.success'));
          success();
        } else {
          toast.error(res.msg);
        }
      } catch {
        toast.error(t('common.AnErrorOccurred'));
      }
    });
  };
  if (isLoading) {
    return (
      <div className="h-100">
        <RrhCircleLoading />;
      </div>
    );
  }
  return (
    <RrhCard>
      <RrhSwitchGroup
        value={activeLang}
        onValueChange={value => {
          setActiveLang(value);
        }}
        labelClassName="font-medium"
        switchItems={(languageList || [])?.map(i => ({
          value: i?.language || '',
          label: i?.languageName || '',
        }))}
      />
      <div>
        {languageList.map(i => {
          return (
            <div key={i.language} className={cn(activeLang === i.language ? 'block' : 'hidden')}>
              <div className="py-6">
                <FormField
                  name={`content.${i.language}`}
                  render={({ field }) => {
                    return (
                      <RichTextEditor
                        field={field}
                        title={t('pointsMallSettings.explanation', { field: i.language })}
                        placeholder={t('pointsMallSettings.explanationPlaceholder')}
                      />
                    );
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-right">
        <RrhButton onClick={handleSubmit}>{t('common.submit')}</RrhButton>
      </div>
    </RrhCard>
  );
}
