import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSelect } from '@/components/form/FormSelect';
import { useTranslation } from 'react-i18next';
import { SelectRadio } from './SelectRadio';
import { Checkbox } from '@/components/ui/checkbox';
import { RrhCheckBoxGroup } from '@/components/common/RrhCheckBoxGroup';
import { cn } from '@/lib/utils';
import { FormMultiSelect } from '@/components/form/FormMultiSelect';
import FormDateInput from '@/components/form/FormDateInput';
import { infoTypeOptions, receiveTypeOptions } from '@/lib/const';
import { useUserRoleList } from '@/api/hooks/system';
import { FormSearchMultiSelect } from '@/components/form/FormSearchMultiSelect';
import { useCrmUsers, useCrmUserTags } from '@/api/hooks/system/system';
import { SelectUpperDropdown } from '@/components/common/SelectUpperDropdown';
import { FormValues } from './schema';

export function StepOneFields({
  source,
  languageOptions,
  emailOptions,
  msgTemplateOptions,
  primaryLanguageOptions,
  setPrimaryLanguageOptions,
  form,
}: {
  source: 'MessageManagementPage' | 'Customer';
  languageOptions: Array<{ label: string; value: string }>;
  emailOptions: Array<{ label: string; value: string }>;
  msgTemplateOptions: Array<{ label: string; value: string; content: string }>;
  primaryLanguageOptions: Array<{ label: string; value: string }>;
  setPrimaryLanguageOptions: (opts: Array<{ label: string; value: string }>) => void;
  form: UseFormReturn<FormValues>;
}) {
  const { t } = useTranslation();
  const { data: RoleRes } = useUserRoleList({});
  const { mutateAsync: getCrmUsers } = useCrmUsers();
  const { mutateAsync: getCrmUsersTags } = useCrmUserTags();

  const type = form.watch('type');
  const isNow = form.watch('isNow');
  const language = form.watch('language');
  const receiveType = form.watch('receiveType');

  const fetchCrmUserOptions = useCallback(
    async (params: { pageNum: number; pageSize: number; keyword: string }) => {
      const res = await getCrmUsers({
        origin: '0',
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        params: { threeCons: params.keyword },
      });
      const rows = res.rows || [];
      const total = Number(res.total || 0);
      return {
        list: rows
          .filter(user => user.id || user.showId)
          .map(user => ({
            value: user.id || user.showId || '',
            label: [user.showId, user.name, user.lastName].filter(Boolean).join(' - '),
          })),
        total,
        hasMore: params.pageNum * params.pageSize < total,
      };
    },
    [getCrmUsers],
  );

  const fetchCrmUserTagsOptions = useCallback(
    async (params: { pageNum: number; pageSize: number; keyword: string }) => {
      const res = await getCrmUsersTags({
        status: '1',
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        params: { threeCons: params.keyword },
      });
      const rows = res.rows || [];
      const total = Number(res.total || 0);
      return {
        list: rows.filter(tag => tag.id).map(tag => ({ value: tag.id, label: tag.tagName })),
        total,
        hasMore: params.pageNum * params.pageSize < total,
      };
    },
    [getCrmUsersTags],
  );

  return (
    <div className="grid gap-6">
      <FormSelect
        name="type"
        label={t('table.infoType')}
        verticalLabel
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={infoTypeOptions.map(i => ({ label: t(i.label), value: i.value }))}
      />

      <FormField
        name="isNow"
        render={({ field }) => (
          <SelectRadio
            title={t('messageManagement.sendMethod')}
            verticalLabel
            field={field}
            radioItems={[
              { value: '1', label: t('messageManagement.immediate') },
              { value: '0', label: t('messageManagement.scheduled') },
            ]}
          />
        )}
      />

      {/* 邮件通知专属 */}
      {type === '2' ? (
        <FormMultiSelect
          name="sendEmails"
          label={t('table.sendEmailAddress')}
          verticalLabel
          placeholder={t('common.pleaseSelect')}
          showRowValue={false}
          options={emailOptions}
        />
      ) : null}

      {/* 定时发送 */}
      {isNow === '0' ? (
        <FormDateInput label={t('table.sendTime')} name="sendTime" showTime />
      ) : null}

      {/* 弹窗通知专属 */}
      {type === '0' ? (
        <FormDateInput label={t('messageManagement.expireTime')} name="expireTime" showTime />
      ) : null}

      {/* 在消息管理 新增修改消息来源 才使用选择接受对象 在customer来源中 默认接受对象就是当前用户 */}
      {source === 'MessageManagementPage' && (
        <FormField
          name="receiveType"
          render={({ field }) => (
            <SelectRadio
              title={t('table.receiver')}
              verticalLabel
              field={field}
              orientation="horizontal"
              radioItems={receiveTypeOptions.map(i => ({ label: t(i.label), value: i.value }))}
            />
          )}
        />
      )}

      {receiveType === '2' && (
        <FormMultiSelect
          verticalLabel
          name="roles"
          label={t('messageManagement.receiveTypeOption.2')}
          placeholder={t('common.pleaseSelect')}
          options={(RoleRes?.rows || []).map(i => ({ label: i.roleName, value: i.roleId }))}
        />
      )}
      {receiveType === '0' && (
        <FormSearchMultiSelect
          verticalLabel
          name="userIds"
          label={t('messageManagement.receiveTypeOption.0')}
          placeholder={t('common.pleaseSelect')}
          fetchOptions={fetchCrmUserOptions}
        />
      )}
      {receiveType === '3' && <SelectUpperDropdown />}
      {receiveType === '4' && (
        <FormSearchMultiSelect
          verticalLabel
          name="tags"
          label={t('messageManagement.receiveTypeOption.4')}
          placeholder={t('common.pleaseSelect')}
          fetchOptions={fetchCrmUserTagsOptions}
        />
      )}

      <FormSelect
        name="template"
        label={t('messageManagement.messageTemplate')}
        verticalLabel
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={msgTemplateOptions}
      />

      <FormField
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <div className="flex w-full justify-between">
                <div>{t('messageManagement.sendLanguage')}</div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    className={cn('data-[state=checked]:border-slate-700')}
                    checked={
                      language?.length === languageOptions.map(i => i.value).join(',')?.length
                    }
                    onCheckedChange={() => {
                      if (
                        language?.length === languageOptions.map(i => i.value).join(',')?.length
                      ) {
                        field.onChange('');
                        setPrimaryLanguageOptions([]);
                      } else {
                        field.onChange(languageOptions.map(i => i.value).join(','));
                        setPrimaryLanguageOptions(languageOptions);
                      }
                      form.setValue('primaryLanguage', '');
                    }}
                    aria-label="Select row"
                  />
                  <span>{t('common.selectAll')}</span>
                </div>
              </div>
            </FormLabel>
            <FormControl>
              <RrhCheckBoxGroup
                onValueChange={v => {
                  field.onChange(v);
                  // 把选中的语言设置进primaryLanguage的选项里
                  setPrimaryLanguageOptions(languageOptions.filter(i => v.includes(i.value)));
                  form.setValue('primaryLanguage', '');
                }}
                value={field.value}
                labelClassName="font-medium"
                checkItems={languageOptions}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormSelect
        name="primaryLanguage"
        label={t('messageManagement.mainLanguage')}
        verticalLabel
        placeholder={t('common.pleaseSelect')}
        showRowValue={false}
        options={primaryLanguageOptions}
      />
    </div>
  );
}
