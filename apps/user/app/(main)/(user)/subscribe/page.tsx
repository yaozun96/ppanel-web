'use client';

import { Display } from '@/components/display';
import { querySubscribeList } from '@/services/user/subscribe';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { Check, Sparkles, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { Empty } from '@/components/empty';
import { SubscribeDetail } from '@/components/subscribe/detail';
import Purchase from '@/components/subscribe/purchase';

export default function Page() {
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
    <>
      {/* 页面头部 */}
      <div className='mb-12'>
        <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 backdrop-blur-sm'>
          <Sparkles className='h-4 w-4 text-indigo-400' />
          <span className='text-sm font-medium text-indigo-300'>选择适合你的套餐</span>
        </div>

        <h1 className='mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent'>
          {t('title')}
        </h1>

        <p className='max-w-2xl text-lg text-slate-300'>
          灵活的订阅方案，满足不同需求。所有套餐均支持多设备同时使用，提供全球节点覆盖。
        </p>
      </div>

      {/* 套餐列表 */}
      <div className='space-y-8'>
        {isLoading ? (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='h-96 animate-pulse rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl'
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
                <div key={item.id} className='group relative'>
                  {/* 推荐标签 */}
                  {isPopular && (
                    <div className='absolute -top-4 left-1/2 z-10 -translate-x-1/2'>
                      <div className='rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-1 text-xs font-semibold text-white shadow-lg'>
                        🔥 推荐
                      </div>
                    </div>
                  )}

                  {/* 卡片 */}
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

                    {/* 卡片内容 */}
                    <div className='flex flex-col gap-6 p-6'>
                      {/* 头部 */}
                      <div>
                        <h3 className='mb-2 text-2xl font-bold text-white'>{item.name}</h3>
                        {description && <p className='text-sm text-slate-400'>{description}</p>}
                      </div>

                      {/* 价格 */}
                      <div>
                        <div className='flex items-baseline gap-1'>
                          <span className='bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent'>
                            <Display type='currency' value={item.unit_price} />
                          </span>
                          <span className='text-slate-400'>/{t(item.unit_time || 'Month')}</span>
                        </div>
                      </div>

                      {/* 特性列表 */}
                      <div className='flex-grow border-t border-white/10 pt-6'>
                        <ul className='space-y-3'>
                          {features?.map(
                            (
                              feature: {
                                icon: string;
                                label: string;
                                type: 'default' | 'success' | 'destructive';
                              },
                              idx: number,
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
                      <Button
                        className={cn(
                          'w-full',
                          isPopular
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                            : 'border-white/10 bg-white/5 hover:bg-white/10',
                        )}
                        variant={isPopular ? 'default' : 'outline'}
                        size='lg'
                        onClick={() => setSubscribe(item)}
                      >
                        {t('buy')}
                      </Button>
                    </div>

                    {/* 背景装饰 */}
                    {isPopular && (
                      <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent' />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Empty />
        )}
      </div>

      <Purchase subscribe={subscribe} setSubscribe={setSubscribe} />
    </>
  );
}
