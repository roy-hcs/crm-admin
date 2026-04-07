import { useUploadFile } from '@/api/hooks/system/system';
import { RrhEditor } from '@/components/editor/RrhEditor';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

export const RichTextEditor = ({
  title,
  placeholder,
  field,
}: {
  title: string;
  placeholder: string;
  field: ControllerRenderProps<FieldValues>;
}) => {
  const { mutateAsync: uploadFunc } = useUploadFile();
  async function uploadImage(file: File): Promise<string> {
    try {
      const res = await uploadFunc(file);
      if (res.code === 0) {
        return res.url;
      } else {
        throw new Error('Image upload failed: Unexpected response code');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error instanceof Error ? error : new Error('Image upload failed');
    }
  }
  return (
    <FormItem>
      <FormLabel>{title}</FormLabel>
      <FormControl>
        <RrhEditor
          onUploadImage={uploadImage}
          placeholder={placeholder}
          value={field.value || ''}
          onChange={value => {
            field.onChange(value);
          }}
        />
      </FormControl>
      <FormMessage className="text-end" />
    </FormItem>
  );
};
