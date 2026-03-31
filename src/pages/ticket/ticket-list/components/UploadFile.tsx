import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Trash2 } from 'lucide-react';
import { ControllerRenderProps, FieldPathByValue, FieldValues } from 'react-hook-form';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface UploadFileProps<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<TFieldValues, FieldPathByValue<TFieldValues, File[] | undefined>>;
  label: string;
  description?: string;
}

export const UploadFile = <TFieldValues extends FieldValues>({
  field,
  label,
  description,
}: UploadFileProps<TFieldValues>) => {
  const { t } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const files = (field.value as File[] | undefined) || [];

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

  const handleImageDelete = (fileToDelete: File) => {
    field.onChange(files.filter(f => f !== fileToDelete));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div>
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
            className="bg-muted hover:bg-muted/80 flex size-12 cursor-pointer items-center justify-center rounded-sm transition-colors"
          >
            选择文件
          </div>
          <div>
            {files.map((i, index) => (
              <div key={i.name + index} className="mt-2 flex items-center gap-2">
                <span>{i.name}</span>
                <span>{(i.size / 1024).toFixed(2)} KB</span>
                <Trash2
                  className="text-destructive size-4 cursor-pointer"
                  onClick={() => handleImageDelete(i)}
                />
              </div>
            ))}
          </div>
        </div>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};
