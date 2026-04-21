import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CloudUpload, FileIcon, X } from 'lucide-react';
import { ControllerRenderProps, FieldPathByValue, FieldValues } from 'react-hook-form';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export type ExistingUploadFile = {
  id?: string | null;
  linkId?: string | null;
  fileName?: string | null;
  fileUrl?: string | null;
  sort?: number | null;
};

export type UploadItem = File | ExistingUploadFile;

interface UploadFileProps<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<
    TFieldValues,
    FieldPathByValue<TFieldValues, UploadItem[] | undefined>
  >;
  label: string;
  description?: string;
  fileWrapperCls?: string;
}

export const UploadFile = <TFieldValues extends FieldValues>({
  field,
  label,
  description,
  fileWrapperCls,
}: UploadFileProps<TFieldValues>) => {
  const { t } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const files = (field.value as UploadItem[] | undefined) || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // 大于10m的文件不允许上传
    const validFiles = selectedFiles.filter(file => file.size <= 10 * 1024 * 1024);
    if (validFiles.length !== selectedFiles.length) {
      toast.error(
        t('rules.maxSize', {
          maxSize: '10MB',
        }),
      );
      return;
    }
    const nextFiles = [...files, ...validFiles];
    field.onChange(nextFiles);

    // 清空 input 的值，允许重复选择同名文件
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageDelete = (deleteIndex: number) => {
    field.onChange(files.filter((_, index) => index !== deleteIndex));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className={cn('grid', files.length > 0 ? 'gap-3' : '')}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.doc,.docx,.ppt,.pptx,.xlsx,.pdf,.jpg,.jpeg,.png,.gif"
            className="hidden"
            onChange={handleImageUpload}
            multiple
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-xl border border-dashed px-4 py-6"
          >
            <div className="bg-primary/9 mx-auto flex size-10 items-center justify-center rounded-full">
              <CloudUpload className="text-primary size-4" />
            </div>
          </div>
          <div className={cn('grid grid-cols-1 gap-3 md:grid-cols-2', fileWrapperCls)}>
            {files.map((i, index) =>
              (() => {
                const name = i instanceof File ? i.name : (i.fileName ?? '-');
                // 如果是 File 对象，显示文件大小；如果是 ExistingUploadFile 对象，显示'-'
                const sizeText = i instanceof File ? `${(i.size / 1024).toFixed(2)} KB` : '-';
                const key =
                  i instanceof File
                    ? `${i.name}-${index}`
                    : `${i.fileUrl || i.fileName || 'existing'}-${index}`;

                return (
                  <div
                    key={key}
                    className="bg-primary-foreground flex items-center justify-between gap-2 rounded-md px-3 py-2"
                  >
                    <div className="flex">
                      <FileIcon className="text-foreground size-4" />
                      <span className="text-foreground mr-2 ml-1 max-w-20 truncate text-xs leading-4 font-medium">
                        {name}
                      </span>
                      <span className="text-muted-foreground text-xs leading-4">{sizeText}</span>
                    </div>
                    <X
                      className="text-muted-foreground size-4 cursor-pointer"
                      onClick={() => handleImageDelete(index)}
                    />
                  </div>
                );
              })(),
            )}
          </div>
        </div>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};
