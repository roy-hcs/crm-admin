import { toast } from 'sonner';

export type ReusableUploadItem =
  | File
  | {
      id?: string | null;
      linkId?: string | null;
      fileName?: string | null;
      fileUrl?: string | null;
      sort?: number | null;
    };

/**
 * 并发上传数组中的所有 File 类型值
 * 非 File 的已有附件直接复用，不执行上传
 */
export async function uploadFilesInArr(
  arr: ReusableUploadItem[] | undefined,
  uploadFn: (file: File) => Promise<{ code: number; url: string; msg?: string }>,
  errorMsg: string = 'Upload failed',
): Promise<Array<{ fileUrls: string; fileNames: string }>> {
  if (!arr) return [];

  const tasks = arr.map(async file => {
    if (file instanceof File) {
      try {
        const res = await uploadFn(file);
        if (res.code === 0) {
          return { fileUrls: res.url, fileNames: file.name };
        }
        toast.error(errorMsg);
        return { fileUrls: '', fileNames: '' };
      } catch (e) {
        console.error(e);
        toast.error(errorMsg);
        return { fileUrls: '', fileNames: '' };
      }
    }

    if (file?.fileUrl || file?.fileName) {
      return {
        fileUrls: file.fileUrl || '',
        fileNames: file.fileName || '',
      };
    }

    return { fileUrls: '', fileNames: '' };
  });

  const results = await Promise.all(tasks);
  return results.map(({ fileUrls, fileNames }) => ({ fileUrls, fileNames }));
}
