'use client';

import { Display } from '@/components/display';
import { Empty } from '@/components/empty';
import { ProList, ProListActions } from '@/components/pro-list';
import Recharge from '@/components/subscribe/recharge';
import { Container } from '@/components/ui-v3/container';
import { ModernCard, ModernCardContent } from '@/components/ui-v3/modern-card';
import { PageHeader } from '@/components/ui-v3/page-header';
import { StatCardV3 } from '@/components/ui-v3/stat-card-v3';
import useGlobalStore from '@/config/use-global';
import { queryUserBalanceLog } from '@/services/user/user';
import { Icon } from '@workspace/ui/custom-components/icon';
import { formatDate } from '@workspace/ui/utils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

export default function WalletV3() {
  const t = useTranslations('wallet');
  const { user } = useGlobalStore();
  const ref = useRef<ProListActions>(null);

  const totalAssets = (user?.balance || 0) + (user?.commission || 0) + (user?.gift_amount || 0);

  return (
    <div className='bg-background min-h-screen py-8'>
      <Container>
        <div className='space-y-8'>
          {/* Page Header */}
          <PageHeader
            title={t('assetOverview')}
            description='管理你的账户余额和交易记录'
            action={<Recharge />}
          />

          {/* Total Assets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ModernCard className='bg-primary/5 border-primary/20'>
              <ModernCardContent className='p-8'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-muted-foreground mb-2 text-sm font-medium'>
                      {t('totalAssets')}
                    </p>
                    <p className='text-foreground text-4xl font-bold'>
                      <Display type='currency' value={totalAssets} />
                    </p>
                  </div>
                  <div className='bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-full'>
                    <Icon icon='uil:wallet' className='h-8 w-8' />
                  </div>
                </div>
              </ModernCardContent>
            </ModernCard>
          </motion.div>

          {/* Asset Breakdown */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <StatCardV3
              title={t('balance')}
              value={`¥${(user?.balance || 0).toFixed(2)}`}
              icon={<Icon icon='uil:money-bill' className='h-6 w-6' />}
            />
            <StatCardV3
              title={t('giftAmount')}
              value={`¥${(user?.gift_amount || 0).toFixed(2)}`}
              icon={<Icon icon='uil:gift' className='h-6 w-6' />}
            />
            <StatCardV3
              title={t('commission')}
              value={`¥${(user?.commission || 0).toFixed(2)}`}
              icon={<Icon icon='uil:percentage' className='h-6 w-6' />}
            />
          </div>

          {/* Transaction History */}
          <div>
            <h2 className='text-foreground mb-6 text-2xl font-bold'>交易记录</h2>
            <ProList<API.BalanceLog, Record<string, unknown>>
              action={ref}
              request={async (pagination, filter) => {
                const response = await queryUserBalanceLog({ ...pagination, ...filter });
                return {
                  list: response.data.data?.list || [],
                  total: response.data.data?.total || 0,
                };
              }}
              renderItem={(item) => {
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ModernCard hover>
                      <ModernCardContent className='p-4'>
                        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                          <div>
                            <p className='text-muted-foreground mb-1 text-xs'>{t('createdAt')}</p>
                            <p className='text-foreground text-sm font-medium'>
                              {formatDate(item.timestamp)}
                            </p>
                          </div>
                          <div>
                            <p className='text-muted-foreground mb-1 text-xs'>{t('type.0')}</p>
                            <p className='text-foreground text-sm font-medium'>
                              {t(`type.${item.type}`)}
                            </p>
                          </div>
                          <div>
                            <p className='text-muted-foreground mb-1 text-xs'>{t('amount')}</p>
                            <p
                              className={`text-sm font-semibold ${
                                item.amount >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {item.amount >= 0 ? '+' : ''}
                              <Display type='currency' value={item.amount} />
                            </p>
                          </div>
                          <div>
                            <p className='text-muted-foreground mb-1 text-xs'>{t('balance')}</p>
                            <p className='text-foreground text-sm font-medium'>
                              <Display type='currency' value={item.balance} />
                            </p>
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
        </div>
      </Container>
    </div>
  );
}
