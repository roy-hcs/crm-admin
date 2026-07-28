import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ImageUp, Trash2, ZoomIn } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type UploadValue = File | string | null | undefined;

type UploadFileProps = {
  field: ControllerRenderProps<FieldValues, string>;
  label: string;
  description?: string;
  accept?: string;
  maxSizeMB?: number;
  allowedExtensions?: string[];
};

function getFileExtension(fileName: string) {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot < 0) return '';
  return fileName.slice(lastDot + 1).toLowerCase();
}

export const UploadFile = ({
  field,
  label,
  description,
  accept = '.jpg,.jpeg,.png',
  maxSizeMB = 10,
  allowedExtensions = ['jpg', 'jpeg', 'png'],
}: UploadFileProps) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(() => {
    if (typeof field.value === 'string' && field.value) return field.value;
    if (field.value instanceof File) return URL.createObjectURL(field.value);
    return null;
  });

  useEffect(() => {
    if (!field.value) {
      setPreview(null);
      return;
    }

    if (typeof field.value === 'string') {
      setPreview(field.value);
      return;
    }

    if (field.value instanceof File) {
      const url = URL.createObjectURL(field.value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [field.value]);

  const normalizedExtensions = useMemo(
    () => allowedExtensions.map(ext => ext.replace('.', '').toLowerCase()),
    [allowedExtensions],
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(
        t('rules.maxSize', {
          maxSize: `${maxSizeMB}MB`,
        }),
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const extension = getFileExtension(file.name);
    if (normalizedExtensions.length > 0 && !normalizedExtensions.includes(extension)) {
      toast.error(
        t('rules.attachmentDescription', {
          fileTypes: normalizedExtensions.map(ext => ext.toUpperCase()).join('/'),
          maxSize: maxSizeMB,
        }),
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    field.onChange(file as UploadValue);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = () => {
    field.onChange('' as UploadValue);
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
            accept={accept}
            className="hidden"
            onChange={handleUpload}
          />
          {preview ? (
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
                  onClick={handleDelete}
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
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-muted hover:bg-muted/80 flex size-12 cursor-pointer items-center justify-center rounded-sm transition-colors"
            >
              <ImageUp className="size-3.5" />
            </div>
          )}
        </div>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};
