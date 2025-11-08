'use client';

import { Display } from '@/components/display';
import { Empty } from '@/components/empty';
import { ProList, ProListActions } from '@/components/pro-list';
import { Container } from '@/components/ui-v3/container';
import {
  ModernCard,
  ModernCardContent,
  ModernCardHeader,
  ModernCardTitle,
} from '@/components/ui-v3/modern-card';
import { PageHeader } from '@/components/ui-v3/page-header';
import { closeOrder, queryOrderList } from '@/services/user/order';
import { Button, buttonVariants } from '@workspace/ui/components/button';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { formatDate } from '@workspace/ui/utils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRef } from 'react';

export default function OrderV3() {
  const t = useTranslations('order');

  const ref = useRef<ProListActions>(null);

  return (
    <div className='bg-background min-h-screen py-8'>
      <Container>
        <div className='space-y-8'>
          {/* Page Header */}
          <PageHeader title={t('title')} description='查看和管理你的所有订单' />

          {/* Orders List */}
          <ProList<API.OrderDetail, Record<string, unknown>>
            action={ref}
            request={async (pagination, filter) => {
              const response = await queryOrderList({ ...pagination, ...filter });
              return {
                list: response.data.data?.list || [],
                total: response.data.data?.total || 0,
              };
            }}
            renderItem={(item) => {
              const statusConfig = {
                1: {
                  color: 'yellow',
                  label: 'pending',
                  bgClass:
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                },
                2: {
                  color: 'green',
                  label: 'completed',
                  bgClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                },
                3: {
                  color: 'red',
                  label: 'failed',
                  bgClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                },
                4: {
                  color: 'gray',
                  label: 'cancelled',
                  bgClass: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
                },
              };

              const status = statusConfig[item.status as keyof typeof statusConfig];

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ModernCard hover className='overflow-hidden'>
                    <ModernCardHeader className='bg-muted/30 flex-row items-center justify-between space-y-0 pb-3'>
                      <ModernCardTitle className='flex items-center gap-3'>
                        <Icon icon='uil:receipt' className='text-primary h-5 w-5' />
                        <div className='flex flex-col gap-1'>
                          <span className='text-xs font-medium opacity-70'>{t('orderNo')}</span>
                          <span className='font-mono text-sm'>{item.order_no}</span>
                        </div>
                      </ModernCardTitle>
                      <div className='flex items-center gap-2'>
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium',
                            status?.bgClass,
                          )}
                        >
                          {t(`status.${item.status}`)}
                        </span>
                        {item.status === 1 ? (
                          <>
                            <Link
                              href={`/payment?order_no=${item.order_no}`}
                              className={buttonVariants({ size: 'sm' })}
                            >
                              <Icon icon='uil:credit-card' className='mr-1.5 h-4 w-4' />
                              {t('payment')}
                            </Link>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={async () => {
                                await closeOrder({ orderNo: item.order_no });
                                ref.current?.refresh();
                              }}
                            >
                              <Icon icon='uil:times' className='mr-1.5 h-4 w-4' />
                              {t('cancel')}
                            </Button>
                          </>
                        ) : (
                          <Link
                            href={`/payment?order_no=${item.order_no}`}
                            className={buttonVariants({ size: 'sm', variant: 'outline' })}
                          >
                            <Icon icon='uil:eye' className='mr-1.5 h-4 w-4' />
                            {t('detail')}
                          </Link>
                        )}
                      </div>
                    </ModernCardHeader>

                    <ModernCardContent className='pt-4'>
                      <div className='grid gap-4 md:grid-cols-3'>
                        <div>
                          <p className='text-muted-foreground mb-1 text-xs font-medium'>
                            {t('name')}
                          </p>
                          <p className='text-foreground line-clamp-1 text-sm font-semibold'>
                            {item.subscribe.name || t(`type.${item.type}`)}
                          </p>
                        </div>
                        <div>
                          <p className='text-muted-foreground mb-1 text-xs font-medium'>
                            {t('paymentAmount')}
                          </p>
                          <p className='text-foreground text-sm font-bold'>
                            <Display type='currency' value={item.amount} />
                          </p>
                        </div>
                        <div>
                          <p className='text-muted-foreground mb-1 text-xs font-medium'>
                            {t('createdAt')}
                          </p>
                          <p className='text-foreground text-sm'>{formatDate(item.created_at)}</p>
                        </div>
                      </div>
                    </ModernCardContent>
                  </ModernCard>
                </motion.div>
              );
            }}
            empty={<Empty />}
          />
        </div>
      </Container>
    </div>
  );
}
