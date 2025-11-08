'use client';

import { Display } from '@/components/display';
import { ProList } from '@/components/pro-list';
import Recharge from '@/components/subscribe/recharge';
import useGlobalStore from '@/config/use-global';
import { queryUserBalanceLog } from '@/services/user/user';
import { Card } from '@workspace/ui/components/card';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { formatDate } from '@workspace/ui/utils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function WalletV4() {
  const t = useTranslations('wallet');
  const { user } = useGlobalStore();

  const walletStats = [
    {
      label: 'Available Balance',
      value: user?.balance || 0,
      icon: 'uil:wallet',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
  ];

  const getTransactionIcon = (type: number) => {
    switch (type) {
      case 1:
        return {
          icon: 'uil:plus-circle',
          color: 'text-green-600',
          bg: 'bg-green-100 dark:bg-green-900/30',
        };
      case 2:
        return {
          icon: 'uil:minus-circle',
          color: 'text-red-600',
          bg: 'bg-red-100 dark:bg-red-900/30',
        };
      case 3:
        return {
          icon: 'uil:exchange',
          color: 'text-blue-600',
          bg: 'bg-blue-100 dark:bg-blue-900/30',
        };
      default:
        return {
          icon: 'uil:circle',
          color: 'text-gray-600',
          bg: 'bg-gray-100 dark:bg-gray-900/30',
        };
    }
  };

  return (
    <div className='bg-background min-h-screen py-8'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'
        >
          <div>
            <h1 className='text-foreground mb-2 text-3xl font-bold'>My Wallet</h1>
            <p className='text-muted-foreground'>Manage your balance and transactions</p>
          </div>
          <Recharge size='lg'>
            <Icon icon='uil:plus' className='mr-2 h-5 w-5' />
            Add Funds
          </Recharge>
        </motion.div>

        {/* Balance Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-8'>
          <Card className='p-8'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-muted-foreground mb-2 text-sm font-medium'>Available Balance</p>
                <p className='text-foreground text-5xl font-bold'>
                  ¥{(user?.balance || 0).toFixed(2)}
                </p>
              </div>
              <div className='bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-full'>
                <Icon icon='uil:wallet' className='h-8 w-8' />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className='overflow-hidden p-6'>
            <h2 className='text-foreground mb-6 text-xl font-semibold'>Transaction History</h2>

            <ProList<API.BalanceLog, Record<string, unknown>>
              request={async (pagination, filter) => {
                const response = await queryUserBalanceLog({ ...pagination, ...filter });
                return {
                  list: response.data.data?.list || [],
                  total: response.data.data?.total || 0,
                };
              }}
              renderItem={(item) => {
                const iconInfo = getTransactionIcon(item.type);
                const isPositive = item.type === 1;

                return (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className='hover:bg-muted/50 -mx-6 px-6 py-4 transition-colors'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        {/* Transaction Icon */}
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-full',
                            iconInfo.bg,
                          )}
                        >
                          <Icon icon={iconInfo.icon} className={cn('h-5 w-5', iconInfo.color)} />
                        </div>

                        {/* Transaction Details */}
                        <div>
                          <p className='text-foreground mb-1 font-medium'>
                            {item.type === 1
                              ? 'Recharge'
                              : item.type === 2
                                ? 'Purchase'
                                : 'Transaction'}
                          </p>
                          <p className='text-muted-foreground text-sm'>
                            {formatDate(new Date(item.timestamp * 1000))}
                          </p>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className='text-right'>
                        <p
                          className={cn(
                            'text-lg font-bold',
                            isPositive ? 'text-green-600' : 'text-red-600',
                          )}
                        >
                          {isPositive ? '+' : '-'}
                          <Display type='currency' value={Math.abs(item.amount)} />
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          Balance: <Display type='currency' value={item.balance} />
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              }}
              empty={
                <div className='py-12 text-center'>
                  <Icon
                    icon='uil:file-search-alt'
                    className='text-muted-foreground mx-auto mb-4 h-16 w-16'
                  />
                  <p className='text-muted-foreground mb-2 text-lg font-medium'>
                    No transactions yet
                  </p>
                  <p className='text-muted-foreground mb-4 text-sm'>
                    Your transaction history will appear here
                  </p>
                  <Recharge>
                    <Icon icon='uil:plus' className='mr-2 h-4 w-4' />
                    Add Your First Transaction
                  </Recharge>
                </div>
              }
            />
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
