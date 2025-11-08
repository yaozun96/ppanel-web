'use client';

import { Display } from '@/components/display';
import useGlobalStore from '@/config/use-global';
import { queryUserSubscribe } from '@/services/user/user';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

export default function DashboardV4() {
  const t = useTranslations('dashboard');
  const { user } = useGlobalStore();
  const [isConnected, setIsConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState('Auto Select');

  const { data: userSubscribe = [] } = useQuery({
    queryKey: ['userSubscribe'],
    queryFn: async () => {
      const { data } = await queryUserSubscribe();
      return data.data || [];
    },
  });

  // 计算统计数据
  const stats = React.useMemo(() => {
    const activeSubscriptions =
      userSubscribe?.filter((sub: API.UserSubscribe) => sub.status === 1).length || 0;
    const totalTraffic =
      userSubscribe?.reduce(
        (sum: number, sub: API.UserSubscribe) => sum + (sub.download || 0) + (sub.upload || 0),
        0,
      ) || 0;

    const activeSub = userSubscribe?.find((sub: API.UserSubscribe) => sub.status === 1);
    const daysLeft = activeSub?.expire_at
      ? Math.max(
          0,
          Math.ceil((new Date(activeSub.expire_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        )
      : 0;

    return {
      activeSubscriptions,
      totalTraffic,
      daysLeft,
      walletBalance: user?.balance || 0,
    };
  }, [userSubscribe, user]);

  const servers = [
    { name: 'Auto Select', location: 'Fastest Server', ping: 'Auto', flag: '🌐' },
    { name: 'Hong Kong', location: 'Asia Pacific', ping: '12ms', flag: '🇭🇰' },
    { name: 'Singapore', location: 'Asia Pacific', ping: '18ms', flag: '🇸🇬' },
    { name: 'Japan', location: 'Asia Pacific', ping: '24ms', flag: '🇯🇵' },
    { name: 'United States', location: 'North America', ping: '156ms', flag: '🇺🇸' },
    { name: 'United Kingdom', location: 'Europe', ping: '178ms', flag: '🇬🇧' },
  ];

  return (
    <div className='bg-background relative min-h-screen'>
      {/* Main Content */}
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
          {/* Left Column - Connection Status */}
          <div className='lg:col-span-7'>
            <div className='space-y-6'>
              {/* Connection Card */}
              <Card className='border-none p-8 shadow-xl'>
                <div className='flex flex-col items-center space-y-6'>
                  {/* Status Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='flex items-center gap-2'
                  >
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        isConnected ? 'animate-pulse bg-green-500' : 'bg-gray-400',
                      )}
                    />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isConnected
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-muted-foreground',
                      )}
                    >
                      {isConnected ? 'Protected' : 'Unprotected'}
                    </span>
                  </motion.div>

                  {/* Big Connect Button */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <button
                      onClick={() => setIsConnected(!isConnected)}
                      className={cn(
                        'relative h-48 w-48 rounded-full shadow-2xl transition-all duration-500',
                        isConnected
                          ? 'bg-gradient-to-br from-green-400 to-green-600'
                          : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800',
                      )}
                    >
                      <div className='flex h-full w-full items-center justify-center'>
                        <Icon
                          icon={isConnected ? 'uil:shield-check' : 'uil:shield'}
                          className={cn(
                            'h-20 w-20',
                            isConnected ? 'text-white' : 'text-gray-500 dark:text-gray-400',
                          )}
                        />
                      </div>
                      {isConnected && (
                        <motion.div
                          className='absolute inset-0 rounded-full bg-green-500/20'
                          initial={{ scale: 1, opacity: 0.5 }}
                          animate={{ scale: 1.2, opacity: 0 }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </button>
                  </motion.div>

                  {/* Connection Text */}
                  <div className='text-center'>
                    <h2 className='text-foreground mb-2 text-2xl font-bold'>
                      {isConnected ? 'Connected' : 'Click to Connect'}
                    </h2>
                    <p className='text-muted-foreground text-sm'>
                      {isConnected
                        ? `Connected to ${selectedServer}`
                        : 'Your connection is not protected'}
                    </p>
                  </div>

                  {/* Server Selection */}
                  {!isConnected && (
                    <div className='w-full'>
                      <Button
                        variant='outline'
                        className='w-full justify-between'
                        onClick={() => {
                          /* Open server modal */
                        }}
                      >
                        <span className='flex items-center gap-2'>
                          <span className='text-2xl'>
                            {servers.find((s) => s.name === selectedServer)?.flag}
                          </span>
                          <span>{selectedServer}</span>
                        </span>
                        <Icon icon='uil:angle-down' className='h-5 w-5' />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* Live Traffic Monitor */}
              <Card className='border-none p-6 shadow-xl'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-foreground text-lg font-semibold'>Data Usage Today</h3>
                  <div className='flex items-center gap-2'>
                    <div className='bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium'>
                      Live
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-muted/50 rounded-lg p-4'>
                    <div className='mb-2 flex items-center gap-2'>
                      <Icon icon='uil:download-alt' className='text-primary h-5 w-5' />
                      <span className='text-muted-foreground text-sm'>Download</span>
                    </div>
                    <div className='text-foreground text-2xl font-bold'>
                      <Display type='traffic' value={stats.totalTraffic / 2} />
                    </div>
                  </div>
                  <div className='bg-muted/50 rounded-lg p-4'>
                    <div className='mb-2 flex items-center gap-2'>
                      <Icon icon='uil:upload-alt' className='text-primary h-5 w-5' />
                      <span className='text-muted-foreground text-sm'>Upload</span>
                    </div>
                    <div className='text-foreground text-2xl font-bold'>
                      <Display type='traffic' value={stats.totalTraffic / 2} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className='lg:col-span-5'>
            <div className='space-y-6'>
              {/* Account Status */}
              <Card className='border-none p-6 shadow-xl'>
                <h3 className='text-foreground mb-4 text-lg font-semibold'>Account Status</h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Active Plans</span>
                    <span className='text-foreground font-semibold'>
                      {stats.activeSubscriptions}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Days Remaining</span>
                    <span className='text-foreground font-semibold'>{stats.daysLeft} days</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Wallet Balance</span>
                    <span className='text-foreground font-semibold'>
                      <Display type='currency' value={stats.walletBalance} />
                    </span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className='border-none p-6 shadow-xl'>
                <h3 className='text-foreground mb-4 text-lg font-semibold'>Quick Actions</h3>
                <div className='space-y-3'>
                  <Button variant='outline' className='w-full justify-start' asChild>
                    <a href='/subscribe-v4'>
                      <Icon icon='uil:shopping-cart' className='mr-2 h-5 w-5' />
                      Upgrade Plan
                    </a>
                  </Button>
                  <Button variant='outline' className='w-full justify-start' asChild>
                    <a href='/wallet-v4'>
                      <Icon icon='uil:wallet' className='mr-2 h-5 w-5' />
                      Add Funds
                    </a>
                  </Button>
                  <Button variant='outline' className='w-full justify-start' asChild>
                    <a href='/ticket-v4'>
                      <Icon icon='uil:headphones-alt' className='mr-2 h-5 w-5' />
                      Get Support
                    </a>
                  </Button>
                </div>
              </Card>

              {/* Server List Preview */}
              <Card className='border-none p-6 shadow-xl'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-foreground text-lg font-semibold'>Available Servers</h3>
                  <Button variant='ghost' size='sm'>
                    View All
                  </Button>
                </div>
                <div className='space-y-2'>
                  {servers.slice(0, 4).map((server) => (
                    <button
                      key={server.name}
                      onClick={() => setSelectedServer(server.name)}
                      className={cn(
                        'hover:bg-muted/50 w-full rounded-lg p-3 text-left transition-colors',
                        selectedServer === server.name && 'bg-primary/10',
                      )}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <span className='text-2xl'>{server.flag}</span>
                          <div>
                            <div className='text-foreground text-sm font-medium'>{server.name}</div>
                            <div className='text-muted-foreground text-xs'>{server.location}</div>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div
                            className={cn(
                              'text-xs font-medium',
                              server.ping === 'Auto'
                                ? 'text-primary'
                                : parseInt(server.ping) < 50
                                  ? 'text-green-600'
                                  : parseInt(server.ping) < 150
                                    ? 'text-yellow-600'
                                    : 'text-red-600',
                            )}
                          >
                            {server.ping}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
