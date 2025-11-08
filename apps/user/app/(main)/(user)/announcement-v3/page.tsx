'use client';

import { Empty } from '@/components/empty';
import { Container } from '@/components/ui-v3/container';
import { ModernCard, ModernCardContent } from '@/components/ui-v3/modern-card';
import { PageHeader } from '@/components/ui-v3/page-header';
import { queryAnnouncement } from '@/services/user/announcement';
import { useQuery } from '@tanstack/react-query';
import { Icon } from '@workspace/ui/custom-components/icon';
import { Markdown } from '@workspace/ui/custom-components/markdown';
import { cn } from '@workspace/ui/lib/utils';
import { formatDate } from '@workspace/ui/utils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function AnnouncementV3() {
  const t = useTranslations('announcement');

  const { data } = useQuery({
    queryKey: ['queryAnnouncement'],
    queryFn: async () => {
      const { data } = await queryAnnouncement({
        page: 1,
        size: 99,
        pinned: false,
        popup: false,
      });
      return data.data?.announcements || [];
    },
  });

  if (!data || data.length === 0) {
    return (
      <div className='bg-background min-h-screen py-8'>
        <Container>
          <PageHeader title={t('title')} description='暂无公告' />
          <Empty border />
        </Container>
      </div>
    );
  }

  return (
    <div className='bg-background min-h-screen py-8'>
      <Container>
        <div className='space-y-8'>
          {/* Page Header */}
          <PageHeader title={t('title')} description='查看最新的系统公告和重要通知' />

          {/* Timeline */}
          <div className='relative space-y-8'>
            {/* Timeline Line */}
            <div className='from-primary/50 via-primary/30 absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b to-transparent' />

            {/* Announcements */}
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className='relative pl-20'
              >
                {/* Timeline Dot */}
                <div className='absolute left-6 top-6 z-10 flex h-5 w-5 items-center justify-center'>
                  <div className='bg-primary ring-background h-3 w-3 rounded-full ring-4' />
                  <div className='bg-primary/30 absolute h-5 w-5 animate-ping rounded-full' />
                </div>

                {/* Content Card */}
                <ModernCard hover className='relative'>
                  <ModernCardContent className='p-6'>
                    <div className='mb-4 flex items-start justify-between gap-4'>
                      <div className='flex-1'>
                        <div className='mb-2 flex items-center gap-2'>
                          <Icon icon='uil:megaphone' className='text-primary h-5 w-5' />
                          <h3 className='text-foreground text-xl font-bold'>{item.title}</h3>
                        </div>
                        <p className='text-muted-foreground flex items-center gap-2 text-sm'>
                          <Icon icon='uil:clock' className='h-4 w-4' />
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                      {item.pinned && (
                        <span className='bg-primary/10 text-primary flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium'>
                          <Icon icon='uil:thumbtack' className='h-3.5 w-3.5' />
                          置顶
                        </span>
                      )}
                    </div>

                    <div
                      className={cn(
                        'prose dark:prose-invert max-w-none',
                        'prose-headings:text-foreground prose-p:text-foreground/90',
                        'prose-a:text-primary hover:prose-a:text-primary/80',
                        'prose-strong:text-foreground prose-code:text-foreground',
                        'prose-pre:bg-muted prose-pre:border prose-pre:border-border',
                      )}
                    >
                      <Markdown>{item.content}</Markdown>
                    </div>
                  </ModernCardContent>
                </ModernCard>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
