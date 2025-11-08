'use client';

import { formatBytes } from '@/components/ui-v2/traffic-ring';
import { Container } from '@/components/ui-v3/container';
import { ModernButton } from '@/components/ui-v3/modern-button';
import {
  ModernCard,
  ModernCardContent,
  ModernCardDescription,
  ModernCardHeader,
  ModernCardTitle,
} from '@/components/ui-v3/modern-card';
import { PageHeader } from '@/components/ui-v3/page-header';
import { StatCardV3 } from '@/components/ui-v3/stat-card-v3';
import useGlobalStore from '@/config/use-global';
import { getClient } from '@/services/common/common';
import { queryUserSubscribe } from '@/services/user/user';
import { useQuery } from '@tanstack/react-query';
import { Icon } from '@workspace/ui/custom-components/icon';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

export default function DashboardV3() {
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

  // Calculate statistics
  const stats = React.useMemo(() => {
    const activeSubscriptions = userSubscribe.filter((sub) => sub.status === 1).length;
    const totalTraffic = userSubscribe.reduce(
      (sum, sub) => sum + (sub.download || 0) + (sub.upload || 0),
      0,
    );

    // Calculate days until expiration
    const activeSubs = userSubscribe.filter((sub) => sub.status === 1);
    let minDaysLeft = 0;
    if (activeSubs.length > 0) {
      const dates = activeSubs.map((sub) => {
        if (!sub.expire_time) return Infinity;
        const expireDate = new Date(sub.expire_time * 1000);
        const today = new Date();
        const diffTime = expireDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      });
      minDaysLeft = Math.min(...dates);
    }

    return {
      activeSubscriptions,
      totalTraffic,
      daysLeft: minDaysLeft > 0 ? minDaysLeft : 0,
      walletBalance: user?.balance || 0,
    };
  }, [userSubscribe, user]);

  const quickActions = [
    {
      icon: 'uil:download-alt',
      title: '下载客户端',
      description: '支持多平台客户端',
      href: '/document',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: 'uil:book-open',
      title: '使用教程',
      description: '快速入门指南',
      href: '/document',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: 'uil:comment-alt-message',
      title: '联系客服',
      description: '提交工单获取帮助',
      href: '/ticket',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className='bg-background min-h-screen py-8'>
      <Container>
        <div className='space-y-8'>
          {/* Page Header */}
          <PageHeader
            title={t('dashboard')}
            description={`欢迎回来，${user?.auth_methods?.[0]?.auth_identifier || '用户'}`}
            action={
              <div className='flex gap-3'>
                <ModernButton
                  variant='outline'
                  size='md'
                  onClick={() => refetch()}
                  loading={isLoading}
                >
                  <Icon icon='uil:sync' className='h-4 w-4' />
                  刷新
                </ModernButton>
                <Link href='/subscribe'>
                  <ModernButton variant='primary' size='md'>
                    <Icon icon='uil:plus' className='h-4 w-4' />
                    {t('purchaseSubscription')}
                  </ModernButton>
                </Link>
              </div>
            }
          />

          {/* Statistics */}
          <section>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <StatCardV3
                title={t('activeSubscriptions') || '活跃订阅'}
                value={stats.activeSubscriptions}
                icon={<Icon icon='uil:server' className='h-6 w-6' />}
                trend={{
                  value: 12,
                  label: '较上月',
                  direction: 'up',
                }}
              />
              <StatCardV3
                title={t('todayTraffic') || '总流量使用'}
                value={formatBytes(stats.totalTraffic)}
                icon={<Icon icon='uil:bolt' className='h-6 w-6' />}
                trend={{
                  value: 8,
                  label: '较上周',
                  direction: 'up',
                }}
              />
              <StatCardV3
                title={t('daysRemaining') || '最近到期'}
                value={stats.daysLeft > 0 ? `${stats.daysLeft} 天` : '已过期'}
                icon={<Icon icon='uil:calendar-alt' className='h-6 w-6' />}
              />
              <StatCardV3
                title={t('walletBalance') || '钱包余额'}
                value={`¥${stats.walletBalance.toFixed(2)}`}
                icon={<Icon icon='uil:wallet' className='h-6 w-6' />}
              />
            </div>
          </section>

          {/* Subscriptions */}
          <section>
            <div className='mb-6'>
              <h2 className='text-foreground text-2xl font-bold'>{t('mySubscriptions')}</h2>
              <p className='text-muted-foreground mt-1 text-sm'>管理你的所有订阅服务</p>
            </div>

            {userSubscribe.length === 0 ? (
              <ModernCard>
                <ModernCardContent className='py-12 text-center'>
                  <Icon icon='uil:inbox' className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
                  <h3 className='text-foreground mb-2 text-lg font-semibold'>
                    {t('noSubscriptions') || '暂无订阅'}
                  </h3>
                  <p className='text-muted-foreground mb-6'>
                    {t('purchaseFirstSubscription') || '购买你的第一个订阅开始使用'}
                  </p>
                  <Link href='/subscribe'>
                    <ModernButton variant='primary'>
                      <Icon icon='uil:plus' className='h-4 w-4' />
                      {t('purchaseSubscription')}
                    </ModernButton>
                  </Link>
                </ModernCardContent>
              </ModernCard>
            ) : (
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {userSubscribe.map((subscription, index) => (
                  <motion.div
                    key={subscription.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SubscriptionCardV3 subscription={subscription} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section>
            <div className='mb-6'>
              <h2 className='text-foreground text-2xl font-bold'>快速操作</h2>
              <p className='text-muted-foreground mt-1 text-sm'>常用功能快速入口</p>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <ModernCard hover className='h-full'>
                    <ModernCardContent className='flex items-center gap-4 p-6'>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.bgColor}`}
                      >
                        <Icon icon={action.icon} className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <div>
                        <h3 className='text-foreground font-semibold'>{action.title}</h3>
                        <p className='text-muted-foreground text-sm'>{action.description}</p>
                      </div>
                    </ModernCardContent>
                  </ModernCard>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}

// Subscription Card Component
function SubscriptionCardV3({ subscription }: { subscription: API.UserSubscribe }) {
  const { traffic, download, upload, expire_time, reset_time, subscribe, status } = subscription;

  const usedTraffic = (download || 0) + (upload || 0);
  const totalTraffic = traffic || 0;
  const percentage = totalTraffic > 0 ? (usedTraffic / totalTraffic) * 100 : 0;

  const statusConfig = {
    1: { text: '正常', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10' },
    2: { text: '即将到期', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10' },
    0: { text: '已过期', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
  };

  const currentStatus = statusConfig[status as keyof typeof statusConfig] || statusConfig[0];

  return (
    <ModernCard hover>
      <ModernCardHeader>
        <div className='flex items-start justify-between'>
          <div>
            <ModernCardTitle>{subscribe?.name || 'Unknown'}</ModernCardTitle>
            <ModernCardDescription>订阅服务</ModernCardDescription>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${currentStatus.bg} ${currentStatus.color}`}
          >
            {currentStatus.text}
          </span>
        </div>
      </ModernCardHeader>

      <ModernCardContent className='space-y-4'>
        {/* Traffic Progress */}
        <div>
          <div className='mb-2 flex justify-between text-sm'>
            <span className='text-muted-foreground'>流量使用</span>
            <span className='text-foreground font-medium'>
              {formatBytes(usedTraffic)} / {formatBytes(totalTraffic)}
            </span>
          </div>
          <div className='bg-secondary h-2 overflow-hidden rounded-full'>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-orange-500' : 'bg-primary'}`}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-xs'>上传</p>
            <p className='text-foreground text-sm font-medium'>{formatBytes(upload || 0)}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-xs'>下载</p>
            <p className='text-foreground text-sm font-medium'>{formatBytes(download || 0)}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-xs'>重置时间</p>
            <p className='text-foreground text-sm font-medium'>
              {reset_time ? new Date(reset_time * 1000).toLocaleDateString('zh-CN') : '-'}
            </p>
          </div>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-xs'>到期时间</p>
            <p className='text-foreground text-sm font-medium'>
              {expire_time ? new Date(expire_time * 1000).toLocaleDateString('zh-CN') : '-'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-2 pt-4'>
          <ModernButton variant='outline' size='sm' className='flex-1'>
            <Icon icon='uil:setting' className='h-4 w-4' />
            管理
          </ModernButton>
          <ModernButton variant='outline' size='sm' className='flex-1'>
            <Icon icon='uil:refresh' className='h-4 w-4' />
            续费
          </ModernButton>
        </div>
      </ModernCardContent>
    </ModernCard>
  );
}
