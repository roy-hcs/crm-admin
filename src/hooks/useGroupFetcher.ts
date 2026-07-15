import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useGetGroup } from '@/api/hooks/system/system';

type OptionItem = { label: string; value: string };

type UseGroupFetcherOptions = {
  serverId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  /** serverId 变化时需要清空的字段名，不传则不清空 */
  fieldToClear?: string;
};

/**
 * 根据 serverId 获取服务器分组列表。
 * serverId 变化时自动重新拉取，并清空 fieldToClear 指定的表单字段。
 */
export function useGroupFetcher({ serverId, form, fieldToClear }: UseGroupFetcherOptions): {
  groupList: OptionItem[];
  groupLoading: boolean;
} {
  const [groupList, setGroupList] = useState<OptionItem[]>([]);
  const [groupLoading, setGroupLoading] = useState(false);
  const { mutateAsync: getGroupData } = useGetGroup();

  useEffect(() => {
    if (!serverId) return;
    let mounted = true;
    const fetchGroups = async () => {
      if (mounted) setGroupLoading(true);
      try {
        const groups = await getGroupData(serverId);
        if (!mounted) return;
        if (groups?.length > 0) {
          setGroupList(
            groups.filter(Boolean).map((item: string) => ({ label: item, value: item })),
          );
        } else {
          setGroupList([]);
        }
      } catch (error) {
        console.error(error);
        if (mounted) setGroupList([]);
      } finally {
        if (mounted) setGroupLoading(false);
      }
    };
    fetchGroups();
    if (fieldToClear) form.setValue(fieldToClear, '');
    return () => {
      mounted = false;
    };
  }, [form, getGroupData, serverId, fieldToClear]);

  return { groupList, groupLoading };
}
