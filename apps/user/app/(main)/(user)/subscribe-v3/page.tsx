'use client';

import { Display } from '@/components/display';
import { Empty } from '@/components/empty';
import Purchase from '@/components/subscribe/purchase';
import { Container } from '@/components/ui-v3/container';
import { ModernButton } from '@/components/ui-v3/modern-button';
import {
  ModernCard,
  ModernCardContent,
  ModernCardFooter,
  ModernCardHeader,
  ModernCardTitle,
} from '@/components/ui-v3/modern-card';
import { PageHeader } from '@/components/ui-v3/page-header';
import { querySubscribeList } from '@/services/user/subscribe';
import { useQuery } from '@tanstack/react-query';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

export default function SubscribeV3() {
  const t = useTranslations('subscribe');
  const locale = useLocale();
  const [subscribe, setSubscribe] = useState<API.Subscribe>();

  const { data, isLoading } = useQuery({
    queryKey: ['querySubscribeList', locale],
    queryFn: async () => {
      const { data } = await querySubscribeList({ language: locale });
      return data.data?.list || [];
    },
  });

  const filteredData = data?.filter((item) => item.show);

  return (
    <div className='bg-background min-h-screen py-8'>
      <Container>
        <div className='space-y-8'>
          {/* Page Header */}
          <PageHeader title={t('title')} description='选择适合你的订阅套餐，灵活配置，按需付费' />

          {/* Plans Grid */}
          {isLoading ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='bg-card border-border h-96 animate-pulse rounded-lg border'
                />
              ))}
            </div>
          ) : filteredData && filteredData.length > 0 ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredData.map((item, index) => {
                let parsedDescription;
                try {
                  parsedDescription = JSON.parse(item.description);
                } catch {
                  parsedDescription = { description: '', features: [] };
                }

                const { description, features } = parsedDescription;
                const isPopular = index === 1; // 第二个套餐设为推荐

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className='relative'
                  >
                    {/* Popular Badge */}
                    {isPopular && (
                      <div className='absolute -top-3 left-1/2 z-10 -translate-x-1/2'>
                        <span className='bg-primary text-primary-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium shadow-sm'>
                          <Icon icon='uil:star' className='h-3 w-3' />
                          推荐
                        </span>
                      </div>
                    )}

                    {/* Plan Card */}
                    <ModernCard
                      hover
                      className={cn(
                        'h-full transition-all',
                        isPopular && 'border-primary/50 shadow-lg',
                      )}
                    >
                      <ModernCardHeader>
                        <ModernCardTitle>{item.name}</ModernCardTitle>
                        {description && (
                          <p className='text-muted-foreground mt-2 text-sm'>{description}</p>
                        )}
                      </ModernCardHeader>

                      <ModernCardContent className='space-y-6'>
                        {/* Price */}
                        <div className='py-4'>
                          <div className='flex items-baseline gap-2'>
                            <span className='text-foreground text-4xl font-bold'>
                              <Display type='currency' value={item.unit_price} />
                            </span>
                            <span className='text-muted-foreground text-base'>
                              /{t(item.unit_time || 'Month')}
                            </span>
                          </div>
                        </div>

                        {/* Features */}
                        <div className='border-border space-y-3 border-t pt-6'>
                          {features?.map(
                            (
                              feature: {
                                icon: string;
                                label: string;
                                type: 'default' | 'success' | 'destructive';
                              },
                              idx: number,
                            ) => (
                              <div key={idx} className='flex items-start gap-3'>
                                <div
                                  className={cn(
                                    'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
                                    feature.type === 'destructive'
                                      ? 'bg-muted text-muted-foreground'
                                      : 'bg-primary/10 text-primary',
                                  )}
                                >
                                  <Icon
                                    icon={
                                      feature.type === 'destructive' ? 'uil:times' : 'uil:check'
                                    }
                                    className='h-3 w-3'
                                  />
                                </div>
                                <span
                                  className={cn(
                                    'text-sm',
                                    feature.type === 'destructive'
                                      ? 'text-muted-foreground line-through'
                                      : 'text-foreground',
                                  )}
                                >
                                  {feature.label}
                                </span>
                              </div>
                            ),
                          )}
                        </div>

                        {/* Additional Details */}
                        <div className='border-border space-y-2 border-t pt-4 text-sm'>
                          <div className='text-muted-foreground flex justify-between'>
                            <span>流量配额</span>
                            <span className='text-foreground font-medium'>
                              <Display type='traffic' value={item.traffic} />
                            </span>
                          </div>
                          {item.speed_limit && (
                            <div className='text-muted-foreground flex justify-between'>
                              <span>速率限制</span>
                              <span className='text-foreground font-medium'>
                                <Display type='trafficSpeed' value={item.speed_limit} />
                              </span>
                            </div>
                          )}
                          {item.device_limit && (
                            <div className='text-muted-foreground flex justify-between'>
                              <span>设备数量</span>
                              <span className='text-foreground font-medium'>
                                {item.device_limit} 台
                              </span>
                            </div>
                          )}
                        </div>
                      </ModernCardContent>

                      <ModernCardFooter>
                        <ModernButton
                          variant={isPopular ? 'primary' : 'outline'}
                          size='lg'
                          className='w-full'
                          onClick={() => setSubscribe(item)}
                        >
                          {t('buy')}
                        </ModernButton>
                      </ModernCardFooter>
                    </ModernCard>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </Container>

      <Purchase subscribe={subscribe} setSubscribe={setSubscribe} />
    </div>
  );
}
