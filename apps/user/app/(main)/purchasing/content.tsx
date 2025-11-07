'use client';

import { SubscribeBilling } from '@/components/subscribe/billing';
import CouponInput from '@/components/subscribe/coupon-input';
import { SubscribeDetail } from '@/components/subscribe/detail';
import DurationSelector from '@/components/subscribe/duration-selector';
import PaymentMethods from '@/components/subscribe/payment-methods';
import useGlobalStore from '@/config/use-global';
import { prePurchaseOrder, purchase } from '@/services/user/portal';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { EnhancedInput } from '@workspace/ui/custom-components/enhanced-input';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';

export default function Content({ subscription }: { subscription?: API.Subscribe }) {
  const t = useTranslations('subscribe');
  const { common } = useGlobalStore();
  const router = useRouter();
  const [params, setParams] = useState<API.PortalPurchaseRequest>({
    quantity: 1,
    subscribe_id: 0,
    payment: -1,
    coupon: '',
    auth_type: 'email',
    identifier: '',
    password: '',
  });
  const [loading, startTransition] = useTransition();
  const [isEmailValid, setIsEmailValid] = useState({
    valid: false,
    message: '',
  });

  const { data: order } = useQuery({
    enabled: !!subscription?.id && !!params.payment,
    queryKey: ['preCreateOrder', params.coupon, params.quantity, params.payment],
    queryFn: async () => {
      const { data } = await prePurchaseOrder({
        ...params,
        subscribe_id: subscription?.id as number,
      } as API.PrePurchaseOrderRequest);
      return data.data;
    },
  });

  useEffect(() => {
    if (subscription) {
      setParams((prev) => ({
        ...prev,
        quantity: 1,
        subscribe_id: subscription?.id,
      }));
    }
  }, [subscription]);

  const handleChange = useCallback((field: keyof typeof params, value: string | number) => {
    setParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    startTransition(async () => {
      try {
        const { data } = await purchase(params);
        const { order_no } = data.data!;
        if (order_no) {
          localStorage.setItem(
            order_no,
            JSON.stringify({
              auth_type: params.auth_type,
              identifier: params.identifier,
            }),
          );
          router.push(`/purchasing/order?order_no=${order_no}`);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [params, router]);

  if (!subscription) {
    return <div className='p-6 text-center'>{t('subscriptionNotFound')}</div>;
  }

  return (
    <div className='mx-auto mt-8 max-w-6xl'>
      {/* 页面头部 */}
      <div className='mb-12'>
        <h1 className='mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-3xl font-bold text-transparent'>
          完成购买
        </h1>
        <p className='text-slate-300'>填写以下信息完成订阅购买</p>
      </div>

      <div className='flex flex-col gap-8 md:grid md:grid-cols-2 md:flex-row'>
        {/* 左侧：账户信息和套餐详情 */}
        <div className='flex flex-col gap-6'>
          {/* 账户信息卡片 */}
          <div className='overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl'>
            <div className='border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6'>
              <h3 className='text-lg font-semibold text-white'>账户信息</h3>
              <p className='text-sm text-slate-400'>用于创建您的 {common.site.site_name} 账户</p>
            </div>

            <div className='space-y-4 p-6'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-medium text-slate-300'>电子邮件地址</label>
                <EnhancedInput
                  className={cn('bg-white/5 border-white/10', {
                    'border-red-500': !isEmailValid.valid && params.identifier !== '',
                  })}
                  placeholder='your@email.com'
                  type='email'
                  value={params.identifier || ''}
                  onValueChange={(value) => {
                    const email = value as string;
                    setParams((prev) => ({
                      ...prev,
                      identifier: email,
                    }));
                    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!reg.test(email)) {
                      setIsEmailValid({
                        valid: false,
                        message: '请输入有效的邮箱地址',
                      });
                    } else if (common.auth.email.enable_domain_suffix) {
                      const domain = email.split('@')[1];
                      const isValid = common.auth.email?.domain_suffix_list
                        .split('\n')
                        .includes(domain || '');
                      if (!isValid) {
                        setIsEmailValid({
                          valid: false,
                          message: '邮箱域名不在白名单中',
                        });
                        return;
                      }
                    } else {
                      setIsEmailValid({
                        valid: true,
                        message: '',
                      });
                    }
                  }}
                  required
                />
                <p
                  className={cn('text-xs text-slate-400', {
                    'text-red-400': !isEmailValid.valid && params.identifier !== '',
                  })}
                >
                  {isEmailValid.message || '请填写您的电子邮件地址'}
                </p>
              </div>

              {params.identifier && isEmailValid.valid && (
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-slate-300'>密码（可选）</label>
                  <EnhancedInput
                    className='bg-white/5 border-white/10'
                    placeholder='留空将自动生成'
                    type='password'
                    value={params.password || ''}
                    onValueChange={(value) => handleChange('password', value)}
                  />
                  <p className='text-xs text-slate-400'>
                    如果不填写密码，我们将自动生成并发送到您的邮箱
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 套餐详情卡片 */}
          <div className='overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl'>
            {/* 顶部渐变条 */}
            <div className='h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' />

            <div className='space-y-4 p-6'>
              <h3 className='text-xl font-bold text-white'>{subscription.name}</h3>

              <ul className='space-y-2 text-sm'>
                {(() => {
                  let parsedDescription;
                  try {
                    parsedDescription = JSON.parse(subscription.description);
                  } catch {
                    parsedDescription = { description: '', features: [] };
                  }

                  const { description, features } = parsedDescription;
                  return (
                    <>
                      {description && <li className='text-slate-400'>{description}</li>}
                      {features?.map(
                        (
                          feature: {
                            icon: string;
                            label: string;
                            type: 'default' | 'success' | 'destructive';
                          },
                          index: number,
                        ) => (
                          <li
                            className={cn('flex items-center gap-2', {
                              'text-slate-500 line-through': feature.type === 'destructive',
                            })}
                            key={index}
                          >
                            {feature.icon && (
                              <Icon
                                icon={feature.icon}
                                className={cn('text-indigo-400 size-4', {
                                  'text-emerald-400': feature.type === 'success',
                                  'text-slate-500': feature.type === 'destructive',
                                })}
                              />
                            )}
                            <span className={feature.type === 'destructive' ? 'text-slate-500' : 'text-slate-300'}>
                              {feature.label}
                            </span>
                          </li>
                        ),
                      )}
                    </>
                  );
                })()}
              </ul>

              <div className='border-t border-white/10 pt-4'>
                <SubscribeDetail
                  subscribe={{
                    ...subscription,
                    quantity: params.quantity,
                  }}
                />
              </div>

              <div className='border-t border-white/10 pt-4'>
                <SubscribeBilling
                  order={{
                    ...order,
                    quantity: params.quantity,
                    unit_price: subscription?.unit_price,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：购买选项 */}
        <div className='flex flex-col gap-6'>
          {/* 购买选项卡片 */}
          <div className='overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl'>
            <div className='border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6'>
              <h3 className='text-lg font-semibold text-white'>购买选项</h3>
            </div>

            <div className='space-y-6 p-6'>
              <DurationSelector
                quantity={params.quantity!}
                unitTime={subscription?.unit_time}
                discounts={subscription?.discount}
                onChange={(value) => handleChange('quantity', value)}
              />

              <CouponInput
                coupon={params.coupon}
                onChange={(value) => handleChange('coupon', value)}
              />

              <PaymentMethods
                balance={false}
                value={params.payment!}
                onChange={(value) => handleChange('payment', value)}
              />
            </div>
          </div>

          {/* 购买按钮 */}
          <Button
            className='w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
            size='lg'
            disabled={!isEmailValid.valid || loading}
            onClick={handleSubmit}
          >
            {loading && <LoaderCircle className='mr-2 animate-spin' />}
            {t('buyNow')}
          </Button>

          {/* 安全提示 */}
          <div className='rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4'>
            <p className='text-sm text-emerald-300'>
              🔒 安全支付 · 数据加密 · 隐私保护
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
