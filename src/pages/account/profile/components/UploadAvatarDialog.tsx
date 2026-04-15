import { RrhButton } from '@/components/common/RrhButton';
import { RrhDialog } from '@/components/common/RrhDialog';
import Cropper, { type Area } from 'react-easy-crop';
import { Upload } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', reject);
    image.src = url;
  });

const getCroppedImageFile = async (imageSrc: string, cropAreaPixels: Area, fileName: string) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context is not available');
  }

  const cropWidth = Math.max(1, Math.round(cropAreaPixels.width));
  const cropHeight = Math.max(1, Math.round(cropAreaPixels.height));
  canvas.width = cropWidth;
  canvas.height = cropHeight;

  ctx.drawImage(
    image,
    cropAreaPixels.x,
    cropAreaPixels.y,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight,
  );

  const ext = fileName.split('.').pop()?.toLowerCase() || 'png';
  const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
  const safeMimeType = mimeType;

  const blob = await new Promise<Blob | null>(resolve => {
    canvas.toBlob(resolve, safeMimeType, 0.92);
  });

  if (!blob) {
    throw new Error('Failed to generate cropped image');
  }

  return new File([blob], fileName, { type: safeMimeType });
};

export const UploadAvatarDialog = ({
  onSuccess,
  FileType,
}: {
  onSuccess?: (file: File) => void;
  FileType: string[];
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [fileName, setFileName] = useState('avatar.png');
  const [errorText, setErrorText] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canConfirm = useMemo(() => {
    return !!imageSrc && !!croppedAreaPixels && !isSubmitting;
  }, [croppedAreaPixels, imageSrc, isSubmitting]);

  const resetState = () => {
    setImageSrc('');
    setErrorText('');
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onClose = (open: boolean) => {
    if (!open) {
      resetState();
    }
    setOpen(open);
  };

  const onCancel = () => {
    resetState();
    setOpen(false);
  };

  const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const max = file.size > 2 * 1024 * 1024;
    if (max) {
      setErrorText(t('rules.maxSize', { maxSize: '2' }));
      return;
    }
    setFileName(file.name);
    setErrorText('');
    setCrop({ x: 0, y: 0 });
    setZoom(1);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.readAsDataURL(file);
  };

  const onConfirm = async () => {
    //如果没有图片或者裁剪区域，说明没有上传或者没有裁剪完成
    if (!imageSrc || !croppedAreaPixels) {
      return;
    }
    try {
      setIsSubmitting(true);
      const croppedFile = await getCroppedImageFile(imageSrc, croppedAreaPixels, fileName);
      onSuccess?.(croppedFile);
      resetState();
      setOpen(false);
    } catch {
      setErrorText(t('common.AnErrorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RrhDialog
      trigger={
        <RrhButton className="border" variant="ghost" Icon={<Upload className="size-4" />}>
          {t('profile.uploadAvatar')}
        </RrhButton>
      }
      title={t('profile.uploadAvatar')}
      isConfirmDisabled={!canConfirm}
      open={open}
      confirmText={t('common.Confirm')}
      onOpenChange={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      variant="large"
      type="submit"
      formLoading={isSubmitting}
    >
      <div className="grid gap-4 py-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={FileType.join(',')}
          onChange={onSelectFile}
          className="block w-full text-sm"
        />

        <div className="relative h-72 w-full overflow-hidden rounded-md border bg-black/5">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
              cropShape="round"
              showGrid={false}
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
              {t('profile.selectImageForCrop')}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor="avatar-zoom" className="text-sm">
            {t('profile.zoom')}
          </label>
          <input
            id="avatar-zoom"
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            disabled={!imageSrc}
          />
        </div>

        {errorText ? <p className="text-sm text-red-500">{errorText}</p> : null}
      </div>
    </RrhDialog>
  );
};
