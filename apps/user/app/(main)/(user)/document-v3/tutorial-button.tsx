'use client';

import { getTutorial } from '@/utils/tutorial';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Icon } from '@workspace/ui/custom-components/icon';
import { Markdown } from '@workspace/ui/custom-components/markdown';
import { useOutsideClick } from '@workspace/ui/hooks/use-outside-click';
import { formatDate } from '@workspace/ui/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RefObject, useEffect, useId, useRef, useState } from 'react';
import { CloseIcon } from './close-icon';

interface Item {
  path: string;
  title: string;
  updated_at?: string;
  icon?: string;
}

export function TutorialButton({ items }: { items: Item[] }) {
  const t = useTranslations('document');

  const [active, setActive] = useState<Item | boolean | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    enabled: !!(active as Item)?.path,
    queryKey: ['getTutorial', (active as Item)?.path],
    queryFn: async () => {
      const markdown = await getTutorial((active as Item)?.path);
      return markdown;
    },
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(false);
      }
    }

    if (active && typeof active === 'object') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  useOutsideClick(ref as RefObject<HTMLDivElement>, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === 'object' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-10 h-full w-full bg-black/20'
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === 'object' ? (
          <div className='fixed inset-0 z-[100] grid place-items-center p-4'>
            <button
              className='bg-foreground absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg dark:text-black'
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className='bg-background flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-auto rounded-2xl border shadow-xl'
            >
              <div className='bg-primary/5 border-b px-8 py-6'>
                <h2 className='text-foreground text-2xl font-bold'>{active.title}</h2>
                {active.updated_at && (
                  <p className='text-muted-foreground mt-1 text-sm'>
                    {formatDate(new Date(active.updated_at), false)}
                  </p>
                )}
              </div>
              <div className='prose dark:prose-invert max-w-none p-8'>
                <Markdown
                  components={{
                    img: ({ node, className, ...props }) => {
                      return (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          {...props}
                          width={800}
                          height={384}
                          className='my-4 inline-block size-auto max-h-96'
                        />
                      );
                    },
                  }}
                >
                  {data?.content || ''}
                </Markdown>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className='grid gap-4 md:grid-cols-2'>
        {items.map((item) => (
          <motion.div
            layoutId={`card-${item.title}-${id}`}
            key={`card-${item.title}-${id}`}
            onClick={() => setActive(item)}
            className='bg-card hover:border-primary/30 group cursor-pointer rounded-xl border p-5 shadow-sm transition-all hover:shadow-md'
          >
            <div className='flex items-start gap-4'>
              <motion.div layoutId={`image-${item.title}-${id}`}>
                <Avatar className='h-14 w-14'>
                  <AvatarImage alt={item.title ?? ''} src={item.icon ?? ''} />
                  <AvatarFallback className='bg-primary/10 text-primary text-lg font-semibold'>
                    {item.title.split('')[0]}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div className='min-w-0 flex-1'>
                <motion.h3
                  layoutId={`title-${item.title}-${id}`}
                  className='text-foreground group-hover:text-primary mb-1 line-clamp-1 font-semibold'
                >
                  {item.title}
                </motion.h3>
                {item.updated_at && (
                  <motion.p
                    layoutId={`description-${item.title}-${id}`}
                    className='text-muted-foreground mb-3 text-sm'
                  >
                    {formatDate(new Date(item.updated_at), false)}
                  </motion.p>
                )}
                <div className='text-primary flex items-center gap-1.5 text-sm font-medium'>
                  <Icon icon='uil:arrow-right' className='h-4 w-4' />
                  <span>{t('read')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
