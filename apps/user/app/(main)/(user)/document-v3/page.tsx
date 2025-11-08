'use client';

import { Empty } from '@/components/empty';
import { Container } from '@/components/ui-v3/container';
import { PageHeader } from '@/components/ui-v3/page-header';
import { NEXT_PUBLIC_HIDDEN_TUTORIAL_DOCUMENT } from '@/config/constants';
import { queryDocumentList } from '@/services/user/document';
import { getTutorialList } from '@/utils/tutorial';
import { useQuery } from '@tanstack/react-query';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { DocumentButton } from './document-button';
import { TutorialButton } from './tutorial-button';

export default function DocumentV3() {
  const locale = useLocale();
  const t = useTranslations('document');
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [selectedTutorial, setSelectedTutorial] = useState<string>('');

  const { data } = useQuery({
    queryKey: ['queryDocumentList'],
    queryFn: async () => {
      const response = await queryDocumentList();
      const list = response.data.data?.list || [];
      return {
        tags: Array.from(new Set(list.reduce((acc: string[], item) => acc.concat(item.tags), []))),
        list,
      };
    },
  });
  const { tags, list: DocumentList } = data || { tags: [], list: [] };

  const { data: TutorialList } = useQuery({
    queryKey: ['getTutorialList', locale],
    queryFn: async () => {
      const list = await getTutorialList();
      return list.get(locale);
    },
    enabled: NEXT_PUBLIC_HIDDEN_TUTORIAL_DOCUMENT !== 'true',
  });

  // Set initial tutorial tab
  useEffect(() => {
    if (!selectedTutorial && TutorialList && TutorialList.length > 0) {
      setSelectedTutorial(TutorialList[0]?.title || '');
    }
  }, [TutorialList, selectedTutorial]);

  if (
    (!DocumentList || DocumentList.length === 0) &&
    (!TutorialList || TutorialList.length === 0)
  ) {
    return (
      <div className='bg-background min-h-screen py-8'>
        <Container>
          <PageHeader title={t('document')} description='暂无文档内容' />
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
          <PageHeader title={t('document')} description='查看使用文档和教程，快速上手' />

          {/* Documents Section */}
          {DocumentList?.length > 0 && (
            <div className='space-y-6'>
              <div className='flex items-center gap-2'>
                <Icon icon='uil:file-alt' className='text-primary h-6 w-6' />
                <h2 className='text-foreground text-xl font-bold'>{t('document')}</h2>
              </div>

              {/* Tags Filter */}
              <div className='flex flex-wrap gap-2'>
                <button
                  onClick={() => setSelectedTab('all')}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-all',
                    selectedTab === 'all'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80',
                  )}
                >
                  {t('all')}
                </button>
                {tags?.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTab(tag)}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-all',
                      selectedTab === tag
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80',
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Documents Grid */}
              <DocumentButton
                items={DocumentList.filter((docs) =>
                  selectedTab === 'all' ? true : docs.tags.includes(selectedTab),
                )}
              />
            </div>
          )}

          {/* Tutorials Section */}
          {TutorialList && TutorialList?.length > 0 && (
            <div className='space-y-6'>
              <div className='flex items-center gap-2'>
                <Icon icon='uil:book-open' className='text-primary h-6 w-6' />
                <h2 className='text-foreground text-xl font-bold'>{t('tutorial')}</h2>
              </div>

              {/* Tutorial Tabs */}
              <div className='flex flex-wrap gap-2'>
                {TutorialList?.map((tutorial) => (
                  <button
                    key={tutorial.title}
                    onClick={() => setSelectedTutorial(tutorial.title)}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-all',
                      selectedTutorial === tutorial.title
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80',
                    )}
                  >
                    {tutorial.title}
                  </button>
                ))}
              </div>

              {/* Tutorial Content */}
              {TutorialList?.map((tutorial) => {
                if (tutorial.title !== selectedTutorial) return null;
                return (
                  <TutorialButton
                    key={tutorial.path}
                    items={
                      tutorial.subItems && tutorial.subItems?.length > 0
                        ? tutorial.subItems
                        : [tutorial]
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
