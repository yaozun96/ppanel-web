'use client';

import { Display } from '@/components/display';
import { SubscribeDetail } from '@/components/subscribe/detail';
import useGlobalStore from '@/config/use-global';
import { Button } from '@workspace/ui/components/button';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { motion } from 'framer-motion';
import { Check, Sparkles, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Key, ReactNode } from 'react';

interface ProductShowcaseProps {
  subscriptionData: API.Subscribe[];
}

export function Content({ subscriptionData }: ProductShowcaseProps) {
  const t = useTranslations('index');
  const { user } = useGlobalStore();

  return (
    <motion.section
      id='product-showcase'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className='scroll-mt-20'
    >
      {/* 标题区域 */}
      <div className='mb-12 text-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 backdrop-blur-sm'
        >
          <Sparkles className='h-4 w-4 text-purple-400' />
          <span className='text-sm font-medium text-purple-300'>灵活的订阅方案</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent'
        >
          {t('product_showcase_title')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='mx-auto max-w-2xl text-lg text-slate-300'
        >
          {t('product_showcase_description')}
        </motion.p>
      </div>

      {/* 套餐卡片 */}
      <div className='mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {subscriptionData?.map((item, index) => {
          let parsedDescription;
          try {
            parsedDescription = JSON.parse(item.description);
          } catch {
            parsedDescription = { description: '', features: [] };
          }

          const { description, features } = parsedDescription;
          const isPopular = index === 1; // 标记第二个套餐为推荐

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='group relative'
            >
              {/* 推荐标签 */}
              {isPopular && (
                <div className='absolute -top-4 left-1/2 z-10 -translate-x-1/2'>
                  <div className='rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-1 text-xs font-semibold text-white shadow-lg'>
                    🔥 推荐
                  </div>
                </div>
              )}

              {/* 卡片主体 */}
              <div
                className={cn(
                  'relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white/5 backdrop-blur-xl transition-all hover:-translate-y-2 hover:shadow-2xl',
                  isPopular
                    ? 'border-purple-500/30 shadow-purple-500/20'
                    : 'border-white/10 hover:border-white/20',
                )}
              >
                {/* 顶部渐变条 */}
                <div
                  className={cn(
                    'h-1 w-full',
                    isPopular
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                      : 'bg-gradient-to-r from-indigo-500/50 to-purple-500/50 opacity-0 transition-opacity group-hover:opacity-100',
                  )}
                />

                {/* 卡片头部 */}
                <div className='p-6 pb-4'>
                  <h3 className='mb-2 text-2xl font-bold text-white'>{item.name}</h3>
                  {description && <p className='text-sm text-slate-400'>{description}</p>}
                </div>

                {/* 价格 */}
                <div className='px-6 pb-6'>
                  <div className='flex items-baseline gap-1'>
                    <span className='bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent'>
                      <Display type='currency' value={item.unit_price} />
                    </span>
                    <span className='text-slate-400'>/{t(item.unit_time)}</span>
                  </div>
                </div>

                {/* 特性列表 */}
                <div className='flex-grow border-t border-white/10 p-6'>
                  <ul className='space-y-3'>
                    {features?.map(
                      (
                        feature: {
                          type: string;
                          icon: string;
                          label: ReactNode;
                        },
                        idx: Key,
                      ) => (
                        <li key={idx} className='flex items-center gap-3'>
                          {feature.type === 'destructive' ? (
                            <X className='h-5 w-5 flex-shrink-0 text-slate-500' />
                          ) : (
                            <Check className='h-5 w-5 flex-shrink-0 text-emerald-400' />
                          )}
                          <span
                            className={cn(
                              'text-sm',
                              feature.type === 'destructive'
                                ? 'text-slate-500 line-through'
                                : 'text-slate-300',
                            )}
                          >
                            {feature.label}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>

                  {/* 订阅详情 */}
                  <div className='mt-4'>
                    <SubscribeDetail
                      subscribe={{
                        ...item,
                        name: undefined,
                      }}
                    />
                  </div>
                </div>

                {/* 购买按钮 */}
                <div className='p-6 pt-0'>
                  <Button
                    className={cn(
                      'w-full',
                      isPopular
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                        : 'border-white/10 bg-white/5 hover:bg-white/10',
                    )}
                    variant={isPopular ? 'default' : 'outline'}
                    size='lg'
                    asChild
                  >
                    <Link href={user ? '/subscribe' : `/purchasing?id=${item.id}`}>
                      {t('subscribe')}
                    </Link>
                  </Button>
                </div>

                {/* 背景装饰 */}
                {isPopular && (
                  <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent' />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
