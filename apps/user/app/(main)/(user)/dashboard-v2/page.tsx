'use client';

import { GlassCard } from '@/components/ui-v2/glass-card';
import { StatCard } from '@/components/ui-v2/stat-card';
import { SubscriptionCardV2 } from '@/components/ui-v2/subscription-card-v2';
import useGlobalStore from '@/config/use-global';
import { getClient } from '@/services/common/common';
import { queryUserSubscribe } from '@/services/user/user';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Icon } from '@workspace/ui/custom-components/icon';
import { Calendar, Globe, Wallet, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

export default function DashboardV2() {
  const t = useTranslations('dashboard');
  const { user } = useGlobalStore();

  const {
    data: userSubscribe = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['queryUserSubscribe'],
    queryFn: async () => {
      const { data } = await queryUserSubscribe();
      return data.data?.list || [];
    },
  });

  const { data: applications } = useQuery({
    queryKey: ['getClient'],
    queryFn: async () => {
      const { data } = await getClient();
      return data.data?.list || [];
    },
  });

  // 计算统计数据
  const stats = React.useMemo(() => {
    const activeSubscriptions = userSubscribe.filter((sub) => sub.status === 1).length;
    const totalTraffic = userSubscribe.reduce((sum, sub) => sum + (sub.used_traffic || 0), 0);
    const totalTrafficGB = (totalTraffic / 1024 / 1024 / 1024).toFixed(1);

    // 计算最近到期的订阅天数
    const activeSubs = userSubscribe.filter((sub) => sub.status === 1);
    let minDaysLeft = 0;
    if (activeSubs.length > 0) {
      const dates = activeSubs.map((sub) => {
        if (!sub.expired_at) return Infinity;
        const expireDate = new Date(sub.expired_at);
        const today = new Date();
        const diffTime = expireDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      });
      minDaysLeft = Math.min(...dates);
    }

    return {
      activeSubscriptions,
      todayTraffic: totalTrafficGB,
      daysLeft: minDaysLeft,
      walletBalance: user?.balance || 0,
    };
  }, [userSubscribe, user]);

  return (
    <div className='relative min-h-screen'>
      {/* 背景装饰 */}
      <div className='pointer-events-none fixed inset-0 overflow-hidden'>
        {/* 渐变网格 */}
        <div
          className='absolute inset-0 opacity-30'
          style={{
            backgroundImage: `
              radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
              radial-gradient(at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)
            `,
          }}
        />

        {/* 网格背景 */}
        <div
          className='absolute inset-0 opacity-20'
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* 内容区域 */}
      <div className='relative z-10 space-y-8'>
        {/* 页面头部 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-3xl font-bold text-transparent'>
              {t('dashboard')}
            </h1>
            <p className='mt-1 text-slate-400'>欢迎回来，{user?.email || '用户'}</p>
          </div>

          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => refetch()}
              className={`border-white/10 bg-white/5 hover:bg-white/10 ${isLoading ? 'animate-pulse' : ''}`}
            >
              <Icon icon='uil:sync' className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              className='bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
              asChild
            >
              <Link href='/subscribe'>
                <Icon icon='uil:plus' className='mr-2 h-4 w-4' />
                {t('purchaseSubscription')}
              </Link>
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <section>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            <StatCard
              icon={Globe}
              label={t('activeSubscriptions') || '活跃订阅'}
              value={stats.activeSubscriptions}
              trend='+12%'
              trendDirection='up'
              color='primary'
            />
            <StatCard
              icon={Zap}
              label={t('todayTraffic') || '今日流量'}
              value={`${stats.todayTraffic} GB`}
              trend='+8%'
              trendDirection='up'
              color='accent'
            />
            <StatCard
              icon={Calendar}
              label={t('daysRemaining') || '剩余天数'}
              value={stats.daysLeft > 0 ? stats.daysLeft : 0}
              color='warning'
            />
            <StatCard
              icon={Wallet}
              label={t('walletBalance') || '钱包余额'}
              value={`¥${stats.walletBalance.toFixed(2)}`}
              color='danger'
            />
          </div>
        </section>

        {/* 订阅列表 */}
        <section>
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='flex items-center gap-3 text-2xl font-bold'>
              <div className='h-8 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500' />
              {t('mySubscriptions')}
            </h2>
          </div>

          {userSubscribe.length === 0 ? (
            <GlassCard className='p-12 text-center'>
              <div className='flex flex-col items-center gap-4'>
                <Icon icon='uil:inbox' className='h-16 w-16 text-slate-400' />
                <h3 className='text-xl font-semibold text-slate-300'>
                  {t('noSubscriptions') || '暂无订阅'}
                </h3>
                <p className='text-slate-400'>
                  {t('purchaseFirstSubscription') || '购买你的第一个订阅开始使用'}
                </p>
                <Button className='mt-4 bg-gradient-to-r from-indigo-500 to-purple-500' asChild>
                  <Link href='/subscribe'>{t('purchaseSubscription')}</Link>
                </Button>
              </div>
            </GlassCard>
          ) : (
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {userSubscribe.map((subscription) => (
                <SubscriptionCardV2
                  key={subscription.id}
                  subscription={{
                    id: subscription.id || 0,
                    name: subscription.subscribe_name || 'Unknown',
                    status:
                      subscription.status === 1
                        ? 'active'
                        : subscription.status === 2
                          ? 'expiring'
                          : 'expired',
                    used: subscription.used_traffic || 0,
                    total: subscription.total_traffic || 0,
                    upload: subscription.upload_traffic || 0,
                    download: subscription.download_traffic || 0,
                    resetDate: subscription.reset_at || new Date().toISOString(),
                    expiryDate: subscription.expired_at || new Date().toISOString(),
                    subscribeUrl: subscription.subscribe_url || '',
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* 快速操作 */}
        <section>
          <h2 className='mb-6 flex items-center gap-3 text-2xl font-bold'>
            <div className='h-8 w-1 rounded-full bg-gradient-to-b from-purple-500 to-emerald-500' />
            快速操作
          </h2>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <GlassCard
              className='group cursor-pointer p-6 transition-all hover:border-indigo-500/30'
              hover
            >
              <div className='flex items-center gap-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 transition-transform group-hover:scale-110'>
                  <Icon icon='uil:download-alt' className='h-6 w-6 text-indigo-400' />
                </div>
                <div>
                  <h3 className='font-semibold text-white'>下载客户端</h3>
                  <p className='text-sm text-slate-400'>支持多平台</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard
              className='group cursor-pointer p-6 transition-all hover:border-emerald-500/30'
              hover
              asChild
            >
              <Link href='/document'>
                <div className='flex items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 transition-transform group-hover:scale-110'>
                    <Icon icon='uil:book-open' className='h-6 w-6 text-emerald-400' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-white'>使用教程</h3>
                    <p className='text-sm text-slate-400'>快速入门指南</p>
                  </div>
                </div>
              </Link>
            </GlassCard>

            <GlassCard
              className='group cursor-pointer p-6 transition-all hover:border-purple-500/30'
              hover
              asChild
            >
              <Link href='/ticket'>
                <div className='flex items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 transition-transform group-hover:scale-110'>
                    <Icon icon='uil:comment-alt-message' className='h-6 w-6 text-purple-400' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-white'>联系客服</h3>
                    <p className='text-sm text-slate-400'>提交工单</p>
                  </div>
                </div>
              </Link>
            </GlassCard>
          </div>
        </section>

        {/* 提示信息 */}
        <GlassCard className='border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 p-6'>
          <div className='flex items-start gap-4'>
            <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/20'>
              <Icon icon='uil:info-circle' className='h-6 w-6 text-indigo-400' />
            </div>
            <div>
              <h3 className='mb-1 font-semibold text-white'>💡 这是新版 Dashboard 预览</h3>
              <p className='text-sm leading-relaxed text-slate-300'>
                采用现代化玻璃态设计、流畅动画、数据可视化。如果你喜欢这个新设计，
                可以让开发者将它替换到主 Dashboard 页面。访问{' '}
                <Link href='/dashboard' className='text-indigo-400 underline hover:text-indigo-300'>
                  旧版 Dashboard
                </Link>{' '}
                查看对比效果。
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
