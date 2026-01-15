import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { TagUserItem } from '@/api/hooks/account';
import { EmblaCarousel } from '@/components/common/EmblaCarousel';
import { ChevronsDown, CircleChevronLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { RrhButton } from '@/components/common/RrhButton';

const TagItem: FC<TagUserItem & { setTags: (id: string) => void; className?: string }> = ({
  userCount,
  id,
  tagName,
  setTags,
  className,
}) => {
  return (
    <div
      onClick={() => setTags(id)}
      className={cn(
        'bg-card group/tag border-border relative min-w-27.5 cursor-pointer rounded-lg border p-3',
        className,
      )}
    >
      <div className="mb-1 text-xs">{tagName}</div>
      <div className="font-medium">{userCount}</div>
      <Search className="absolute top-2 right-2 hidden size-3 group-hover/tag:block" />
    </div>
  );
};

export const AccountTags = ({
  setTags,
  userCount,
  tagUserCountListLoading,
  tagUserCountList,
}: {
  setTags: Dispatch<SetStateAction<string>>;
  userCount: string;
  tagUserCountListLoading: boolean;
  tagUserCountList: TagUserItem[];
}) => {
  const { t } = useTranslation();
  const [folded, setFolded] = useState(true);
  const [showToggle, setShowToggle] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        // 临时展开以检测完整内容高度
        const currentMaxHeight = contentRef.current.style.maxHeight;
        contentRef.current.style.maxHeight = 'none';

        const isOverflowing = contentRef.current.scrollHeight > 96; // 96px = max-h-24 (24 * 4)

        // 恢复原状态
        contentRef.current.style.maxHeight = currentMaxHeight;

        setShowToggle(isOverflowing);
      }
    };

    // 延迟检测以确保DOM已完全渲染
    const timeoutId = setTimeout(checkOverflow, 0);

    window.addEventListener('resize', checkOverflow);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [tagUserCountList]);

  return (
    <>
      <div className="group/swiper mt-4 flex items-center gap-4 md:hidden">
        <TagItem
          tagName="总计(客户)"
          userCount={userCount || '0'}
          setTags={setTags}
          id={''}
          className="shrink-0"
        />
        {tagUserCountListLoading ? (
          <div className="flex h-full basis-full animate-pulse items-center justify-center">
            {t('common.loading')}
          </div>
        ) : (
          <EmblaCarousel
            options={{
              align: 'start',
              containScroll: 'trimSnaps',
            }}
            PreButton={({ onClick, disabled }) => (
              <button
                onClick={onClick}
                disabled={disabled}
                className="hidden h-full cursor-pointer group-hover/swiper:block disabled:cursor-not-allowed"
              >
                <CircleChevronLeft className="text-foreground" />
              </button>
            )}
            NextButton={({ onClick, disabled }) => (
              <button
                onClick={onClick}
                disabled={disabled}
                className="hidden h-full cursor-pointer group-hover/swiper:block disabled:cursor-not-allowed"
              >
                <CircleChevronLeft className="text-foreground rotate-180" />
              </button>
            )}
            wrapperCls="gap-1"
          >
            {tagUserCountList.map(item => (
              <TagItem
                key={item.id}
                id={item.id}
                tagName={item.tagName}
                userCount={item.userCount}
                setTags={setTags}
                className="shrink-0 grow-0"
              />
            ))}
          </EmblaCarousel>
        )}
      </div>
      <div className="hidden md:block">
        <div
          ref={contentRef}
          className={cn(
            'flex flex-wrap justify-between gap-3 duration-200 md:justify-start',
            folded ? 'max-h-15 overflow-hidden' : 'max-h-screen',
            showToggle ? '' : 'mb-6',
          )}
        >
          <TagItem
            tagName="总计(客户)"
            userCount={userCount || '0'}
            setTags={setTags}
            id={''}
            className="h-15 min-w-39 shrink-0"
          />
          {tagUserCountList.map(item => (
            <TagItem
              key={item.id}
              id={item.id}
              tagName={item.tagName}
              userCount={item.userCount}
              setTags={setTags}
              className="h-15 min-w-39"
            />
          ))}
        </div>
        {showToggle && (
          <div className="my-3 text-center">
            <RrhButton
              type="button"
              variant="ghost"
              className="size-4"
              onClick={() => setFolded(!folded)}
            >
              {folded ? (
                <ChevronsDown className="text-sidebar-ring" />
              ) : (
                <ChevronsDown className="text-sidebar-ring rotate-180" />
              )}
            </RrhButton>
          </div>
        )}
      </div>
    </>
  );
};
