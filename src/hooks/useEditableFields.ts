import { useState, useCallback } from 'react';

export function useEditableFields<T extends string>(
  initialData: Record<T, string>,
  editableKeys: T[],
) {
  // 构建初始状态（包含数据和编辑状态）
  const [fields, setFields] = useState(() => {
    const initial: Record<string, string | boolean> = {};
    editableKeys.forEach(key => {
      initial[key] = initialData[key] || '';
      initial[`${key}Editable`] = false;
    });
    return initial;
  });

  // 临时编辑值
  const [editingValues, setEditingValues] = useState<Partial<Record<T, string>>>({});

  // 切换编辑状态
  const toggleEditable = useCallback((key: T) => {
    setFields(prev => ({
      ...prev,
      [`${key}Editable`]: !prev[`${key}Editable`],
    }));
  }, []);

  // 开始编辑
  const startEdit = useCallback(
    (key: T) => {
      setEditingValues(prev => ({
        ...prev,
        [key]: fields[key] as string,
      }));
      toggleEditable(key);
    },
    [fields, toggleEditable],
  );

  // 更新临时值
  const updateEditingValue = useCallback((key: T, value: string) => {
    setEditingValues(prev => ({ ...prev, [key]: value }));
  }, []);

  // 取消编辑
  const cancelEdit = useCallback(
    (key: T) => {
      setEditingValues(prev => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _ignored, ...rest } = prev;
        return rest as Partial<Record<T, string>>;
      });
      toggleEditable(key);
    },
    [toggleEditable],
  );

  // 确认编辑
  const confirmEdit = useCallback(
    (key: T) => {
      const newValue = editingValues[key];
      if (newValue !== undefined) {
        setFields(prev => ({
          ...prev,
          [key]: newValue,
        }));
        setEditingValues(prev => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [key]: _ignored, ...rest } = prev;
          return rest as Partial<Record<T, string>>;
        });
      }
      toggleEditable(key);
    },
    [editingValues, toggleEditable],
  );

  // 获取当前显示的值（编辑中显示临时值，否则显示确认的值）
  const getDisplayValue = useCallback(
    (key: T) => {
      return editingValues[key] ?? (fields[key] as string);
    },
    [editingValues, fields],
  );

  // 检查是否正在编辑
  const isEditing = useCallback(
    (key: T) => {
      return fields[`${key}Editable`] as boolean;
    },
    [fields],
  );

  // 获取所有确认的数据
  const getConfirmedData = useCallback(() => {
    const data: Partial<Record<T, string>> = {};
    editableKeys.forEach(key => {
      data[key] = fields[key] as string;
    });
    return data;
  }, [fields, editableKeys]);

  return {
    fields,
    editingValues,
    startEdit,
    updateEditingValue,
    cancelEdit,
    confirmEdit,
    getDisplayValue,
    isEditing,
    getConfirmedData,
  };
}
