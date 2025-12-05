import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 数据过期时间：24小时
const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

interface TransferDataItem<T = unknown> {
  data: T;
  timestamp: number;
}

interface PageTransferStore {
  transferData: Record<string, TransferDataItem>;

  // 存储数据
  setTransferData: <T>(key: string, data: T) => void;

  // 获取数据（非破坏性读取，支持多次读取）
  getTransferData: <T>(key: string) => T | null;

  // 清除指定页面数据
  clearTransferData: (key: string) => void;

  // 清除所有数据
  clearAllTransferData: () => void;
}

// 自动清理过期数据的函数
const cleanupExpiredData = (
  data: Record<string, TransferDataItem>,
): Record<string, TransferDataItem> => {
  const now = Date.now();
  const cleaned: Record<string, TransferDataItem> = {};

  for (const [key, value] of Object.entries(data)) {
    if (now - value.timestamp < EXPIRATION_TIME) {
      cleaned[key] = value;
    }
  }

  return cleaned;
};

export const usePageTransferStore = create<PageTransferStore>()(
  persist(
    (set, get) => ({
      transferData: {},

      setTransferData: (key, data) => {
        // 存储数据时自动清理过期数据
        set(state => ({
          transferData: cleanupExpiredData({
            ...state.transferData,
            [key]: {
              data,
              timestamp: Date.now(),
            },
          }),
        }));
      },

      getTransferData: <T>(key: string): T | null => {
        // 读取数据时自动清理过期数据
        const state = get();
        const cleaned = cleanupExpiredData(state.transferData);

        // 如果清理后的数据有变化，更新状态
        if (Object.keys(cleaned).length !== Object.keys(state.transferData).length) {
          set({ transferData: cleaned });
        }

        const item = cleaned[key];
        if (!item) return null;

        // 检查是否过期
        const now = Date.now();
        if (now - item.timestamp >= EXPIRATION_TIME) {
          return null;
        }

        return item.data as T;
      },

      clearTransferData: key => {
        set(state => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [key]: _, ...rest } = state.transferData;
          return { transferData: rest };
        });
      },

      clearAllTransferData: () => {
        set({ transferData: {} });
      },
    }),
    {
      name: 'page-transfer-storage',
      storage: {
        getItem: name => {
          try {
            const str = sessionStorage.getItem(name);
            return str ? JSON.parse(str) : null;
          } catch (error) {
            console.error('Failed to parse page transfer data:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            sessionStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('Failed to save page transfer data:', error);
          }
        },
        removeItem: name => sessionStorage.removeItem(name),
      },
    },
  ),
);
