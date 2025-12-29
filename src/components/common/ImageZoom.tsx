import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

type ImageZoomProps = {
  src: string;
  alt?: string;
  thumbnailClassName?: string;
  fullImageClassName?: string;
};
export const ImageZoom = ({
  src,
  alt = '',
  thumbnailClassName,
  fullImageClassName,
}: ImageZoomProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={src}
          alt={alt}
          className={['cursor-zoom-in rounded-md', thumbnailClassName].filter(Boolean).join(' ')}
        />
      </DialogTrigger>
      <DialogContent
        className="border-0 bg-transparent p-0 shadow-none sm:max-w-[90vw]"
        aria-describedby={undefined}
      >
        <div className="flex max-h-[90vh] items-center justify-center">
          <img
            src={src}
            alt={alt}
            className={['max-h-[90vh] max-w-[90vw] object-contain', fullImageClassName]
              .filter(Boolean)
              .join(' ')}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
