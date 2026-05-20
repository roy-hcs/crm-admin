import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CloudUpload, Trash2, ZoomIn } from 'lucide-react';
import { ControllerRenderProps, FieldPathByValue, FieldValues } from 'react-hook-form';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

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
  //   选择封面图
  const [active, setActive] = useState('');
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
    if (nextFiles.length === 1) {
      setActive('0');
    }
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
            accept=".jpg,.jpeg,.png"
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
          <div className={cn('flex flex-wrap gap-2', fileWrapperCls)}>
            {files.map((i, index) =>
              (() => {
                const key =
                  i instanceof File
                    ? `${i.name}-${index}`
                    : `${i.fileUrl || i.fileName || 'existing'}-${index}`;

                const preview = i instanceof File ? URL.createObjectURL(i) : i.fileUrl || undefined;

                return (
                  <div
                    key={key}
                    className={cn(
                      active === String(index) ? 'ring-primary ring-2' : '',
                      'relative',
                    )}
                    onClick={() => {
                      setActive(String(index));
                    }}
                  >
                    <div className="group relative size-12">
                      <img
                        src={preview}
                        alt="Preview"
                        loading="lazy"
                        className="size-12 rounded-sm object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-sm bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleImageDelete(index)}
                          className="flex size-6 items-center justify-center rounded-sm bg-white/20 transition-colors hover:bg-white/30"
                        >
                          <Trash2 className="size-3.5 text-white" />
                        </button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              type="button"
                              className="flex size-6 items-center justify-center rounded-sm bg-white/20 transition-colors hover:bg-white/30"
                            >
                              <ZoomIn className="size-3.5 text-white" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="border-0 bg-transparent p-0 shadow-none sm:max-w-[90vw]">
                            <div className="flex max-h-[90vh] items-center justify-center">
                              <img
                                src={preview}
                                alt="Preview Full"
                                className="max-h-[90vh] max-w-[90vw] object-contain"
                                loading="lazy"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
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
