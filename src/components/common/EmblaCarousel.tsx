import { cn } from '@/lib/utils';
import { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';

export const EmblaCarousel: FC<
  PropsWithChildren<{
    PreButton?: FC<{ onClick: () => void; disabled?: boolean }>;
    NextButton?: FC<{ onClick: () => void; disabled?: boolean }>;
    btnsContainCls?: string;
    options?: EmblaOptionsType;
    plugins?: EmblaPluginType[];
  }>
> = ({ PreButton, NextButton, btnsContainCls, options, plugins, children }) => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);
  const goToPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const goToNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="embla relative overflow-hidden px-6" ref={emblaRef}>
      <div className="embla__container flex gap-4">{children}</div>
      <div
        className={cn(
          'absolute top-1/2 right-0 flex h-full -translate-y-1/2 transform justify-between',
          btnsContainCls,
        )}
      >
        {NextButton ? (
          <NextButton onClick={goToNext} disabled={nextBtnDisabled} />
        ) : (
          <button disabled={nextBtnDisabled} onClick={goToNext}>
            next
          </button>
        )}
      </div>
      <div
        className={cn(
          'absolute top-1/2 left-0 flex h-full -translate-y-1/2 transform justify-between',
          btnsContainCls,
        )}
      >
        {PreButton ? (
          <PreButton onClick={goToPrev} disabled={prevBtnDisabled} />
        ) : (
          <button disabled={prevBtnDisabled} onClick={goToPrev}>
            pre
          </button>
        )}
      </div>
    </div>
  );
};
