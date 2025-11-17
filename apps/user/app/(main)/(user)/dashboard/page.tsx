'use client';

import Announcement from '@/components/announcement';
import { Display } from '@/components/display';
import useGlobalStore from '@/config/use-global';
import { queryUserSubscribe } from '@/services/user/user';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { Progress } from '@workspace/ui/components/progress';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { formatDate } from '@workspace/ui/utils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo } from 'react';

export default function Dashboard() {
  const t = useTranslations('dashboard');
  const { user } = useGlobalStore();

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['userSubscribe'],
    queryFn: async () => {
      const { data } = await queryUserSubscribe();
      return data.data || [];
    },
  });

  // Calculate active subscription stats
  const activeSubscription = useMemo(() => {
    return subscriptions.find((sub: API.UserSubscribe) => sub.status === 1);
  }, [subscriptions]);

  const trafficUsage = useMemo(() => {
    if (!activeSubscription) return { used: 0, total: 0, percentage: 0 };
    const used = (activeSubscription.download || 0) + (activeSubscription.upload || 0);
    const total = activeSubscription.total || 1;
    const percentage = Math.min((used / total) * 100, 100);
    return { used, total, percentage };
  }, [activeSubscription]);

  const daysLeft = useMemo(() => {
    if (!activeSubscription?.expire_at) return 0;
    const days = Math.ceil(
      (new Date(activeSubscription.expire_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(0, days);
  }, [activeSubscription]);

  return (
    <div className='container space-y-6 py-8'>
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className='text-foreground mb-2 text-3xl font-bold'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Welcome back, {user?.auth_methods?.[0]?.auth_identifier?.split('@')[0] || 'User'}
        </p>
      </motion.div>

      {/* Announcement Banner */}
      <Announcement type='pinned' />

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Left Column - Main Content */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Subscription Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className='overflow-hidden'>
              <div className='bg-primary/5 border-b px-6 py-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
                      <Icon icon='uil:rocket' className='text-primary h-5 w-5' />
                    </div>
                    <div>
                      <h2 className='text-foreground text-lg font-semibold'>My Subscription</h2>
                      <p className='text-muted-foreground text-sm'>
                        {activeSubscription ? 'Active' : 'No active subscription'}
                      </p>
                    </div>
                  </div>
                  <Link href='/subscribe'>
                    <Button variant='outline' size='sm'>
                      <Icon icon='uil:plus' className='mr-2 h-4 w-4' />
                      Upgrade
                    </Button>
                  </Link>
                </div>
              </div>

              {activeSubscription ? (
                <div className='space-y-6 p-6'>
                  {/* Plan Name */}
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-muted-foreground mb-1 text-sm'>Current Plan</p>
                      <p className='text-foreground text-2xl font-bold'>
                        {activeSubscription.name || 'Standard Plan'}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium',
                        daysLeft > 7
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                      )}
                    >
                      {daysLeft} days left
                    </div>
                  </div>

                  {/* Traffic Usage */}
                  <div>
                    <div className='mb-2 flex items-center justify-between'>
                      <span className='text-muted-foreground text-sm'>Data Usage</span>
                      <span className='text-foreground text-sm font-medium'>
                        <Display type='traffic' value={trafficUsage.used} /> /{' '}
                        <Display type='traffic' value={trafficUsage.total} />
                      </span>
                    </div>
                    <Progress value={trafficUsage.percentage} className='h-2' />
                    <p className='text-muted-foreground mt-1 text-xs'>
                      {trafficUsage.percentage.toFixed(1)}% used
                    </p>
                  </div>

                  {/* Expiry Date */}
                  <div className='border-t pt-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-sm'>Expiry Date</span>
                      <span className='text-foreground font-medium'>
                        {formatDate(activeSubscription.expire_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='p-12 text-center'>
                  <Icon icon='uil:sad' className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
                  <p className='text-muted-foreground mb-4'>
                    You don't have an active subscription
                  </p>
                  <Link href='/subscribe'>
                    <Button>
                      <Icon icon='uil:shopping-cart' className='mr-2 h-4 w-4' />
                      Browse Plans
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Help Center Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className='overflow-hidden'>
              <div className='bg-primary/5 border-b px-6 py-4'>
                <div className='flex items-center gap-3'>
                  <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
                    <Icon icon='uil:question-circle' className='text-primary h-5 w-5' />
                  </div>
                  <div>
                    <h2 className='text-foreground text-lg font-semibold'>Help Center</h2>
                    <p className='text-muted-foreground text-sm'>
                      Get help and learn how to use our service
                    </p>
                  </div>
                </div>
              </div>

              <div className='grid gap-4 p-6 sm:grid-cols-2'>
                {/* Tutorial Module */}
                <Link href='/document'>
                  <Card className='hover:border-primary/50 group cursor-pointer border-2 transition-all hover:shadow-lg'>
                    <div className='p-6'>
                      <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 transition-transform group-hover:scale-110'>
                        <Icon icon='uil:book-open' className='h-7 w-7 text-blue-500' />
                      </div>
                      <h3 className='text-foreground mb-2 text-lg font-semibold'>Tutorials</h3>
                      <p className='text-muted-foreground mb-4 text-sm'>
                        Step-by-step guides and documentation
                      </p>
                      <div className='flex items-center gap-2 text-blue-500'>
                        <span className='text-sm font-medium'>Learn More</span>
                        <Icon icon='uil:arrow-right' className='h-4 w-4' />
                      </div>
                    </div>
                  </Card>
                </Link>

                {/* Ticket Module */}
                <Link href='/ticket'>
                  <Card className='hover:border-primary/50 group cursor-pointer border-2 transition-all hover:shadow-lg'>
                    <div className='p-6'>
                      <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 transition-transform group-hover:scale-110'>
                        <Icon icon='uil:ticket' className='h-7 w-7 text-purple-500' />
                      </div>
                      <h3 className='text-foreground mb-2 text-lg font-semibold'>
                        Support Tickets
                      </h3>
                      <p className='text-muted-foreground mb-4 text-sm'>
                        Contact our support team for assistance
                      </p>
                      <div className='flex items-center gap-2 text-purple-500'>
                        <span className='text-sm font-medium'>Get Support</span>
                        <Icon icon='uil:arrow-right' className='h-4 w-4' />
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Sidebar */}
        <div className='space-y-6'>
          {/* Referral Program Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className='overflow-hidden'>
              <div className='bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6'>
                <div className='mb-4 flex items-center gap-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20'>
                    <Icon icon='uil:gift' className='h-6 w-6 text-green-600 dark:text-green-400' />
                  </div>
                  <div>
                    <h3 className='text-foreground text-lg font-semibold'>Referral Program</h3>
                    <p className='text-muted-foreground text-sm'>Earn rewards</p>
                  </div>
                </div>

                <div className='mb-4 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Total Earnings</span>
                    <span className='text-foreground text-lg font-bold'>
                      <Display type='currency' value={user?.commission || 0} />
                    </span>
                  </div>
                </div>

                <Link href='/affiliate'>
                  <Button className='w-full' variant='outline'>
                    <Icon icon='uil:share-alt' className='mr-2 h-4 w-4' />
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Quick Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className='p-6'>
              <h3 className='text-foreground mb-4 text-lg font-semibold'>Quick Stats</h3>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10'>
                      <Icon icon='uil:bill' className='h-4 w-4 text-blue-500' />
                    </div>
                    <span className='text-muted-foreground text-sm'>Total Plans</span>
                  </div>
                  <span className='text-foreground font-semibold'>{subscriptions.length}</span>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10'>
                      <Icon icon='uil:check-circle' className='h-4 w-4 text-green-500' />
                    </div>
                    <span className='text-muted-foreground text-sm'>Active Plans</span>
                  </div>
                  <span className='text-foreground font-semibold'>
                    {subscriptions.filter((s: API.UserSubscribe) => s.status === 1).length}
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10'>
                      <Icon icon='uil:wallet' className='h-4 w-4 text-purple-500' />
                    </div>
                    <span className='text-muted-foreground text-sm'>Balance</span>
                  </div>
                  <span className='text-foreground font-semibold'>
                    <Display type='currency' value={user?.balance || 0} />
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className='p-6'>
              <h3 className='text-foreground mb-4 text-lg font-semibold'>Quick Actions</h3>
              <div className='space-y-2'>
                <Link href='/wallet'>
                  <Button variant='outline' className='w-full justify-start'>
                    <Icon icon='uil:plus' className='mr-2 h-4 w-4' />
                    Add Funds
                  </Button>
                </Link>
                <Link href='/order'>
                  <Button variant='outline' className='w-full justify-start'>
                    <Icon icon='uil:receipt' className='mr-2 h-4 w-4' />
                    Order History
                  </Button>
                </Link>
                <Link href='/profile'>
                  <Button variant='outline' className='w-full justify-start'>
                    <Icon icon='uil:setting' className='mr-2 h-4 w-4' />
                    Settings
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
