import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageUp, Trash2, ZoomIn } from 'lucide-react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { useRef, useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

interface UploadFileProps {
  field: ControllerRenderProps<FieldValues, string>;
  label: string;
  description?: string;
}

export const UploadFile = ({ field, label, description }: UploadFileProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(() => {
    if (typeof field.value === 'string') return field.value;
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
    } else if (field.value instanceof File) {
      const url = URL.createObjectURL(field.value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [field.value]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      field.onChange(file);
    }
  };

  const handleImageDelete = () => {
    field.onChange('');
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
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          {preview ? (
            <div className="group relative size-12">
              <img
                src={preview}
                alt="Preview"
                loading="lazy"
                className="size-12 rounded-sm object-cover"
              />
              {/* 黑色遮罩和图标 */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-sm bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={handleImageDelete}
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
