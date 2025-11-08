'use client';

import { Empty } from '@/components/empty';
import { ProList } from '@/components/pro-list';
import { Container } from '@/components/ui-v3/container';
import { ModernCard, ModernCardContent } from '@/components/ui-v3/modern-card';
import { PageHeader } from '@/components/ui-v3/page-header';
import { StatCardV3 } from '@/components/ui-v3/stat-card-v3';
import useGlobalStore from '@/config/use-global';
import { queryUserAffiliate, queryUserAffiliateList } from '@/services/user/user';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Icon } from '@workspace/ui/custom-components/icon';
import { formatDate, isBrowser } from '@workspace/ui/utils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'sonner';

export default function AffiliateV3() {
  const t = useTranslations('affiliate');
  const { user, common } = useGlobalStore();
  const [sum, setSum] = useState<number>();

  const { data } = useQuery({
    queryKey: ['queryUserAffiliate'],
    queryFn: async () => {
      const response = await queryUserAffiliate();
      return response.data.data;
    },
  });

  const commissionRate = user?.referral_percentage || common?.invite?.referral_percentage || 0;

  return (
    <div className='bg-background min-h-screen py-8'>
      <Container>
        <div className='space-y-8'>
          {/* Page Header */}
          <PageHeader title={t('title')} description='邀请好友注册，赚取持续佣金奖励' />

          {/* Stats Grid */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <StatCardV3
              title={t('totalCommission')}
              value={`¥${(data?.total_commission || 0).toFixed(2)}`}
              icon={<Icon icon='uil:money-bill' className='h-6 w-6' />}
              trend={{ value: commissionRate, label: `${commissionRate}% ${t('commissionRate')}` }}
            />
            <StatCardV3
              title={t('inviteCount')}
              value={data?.total_count || 0}
              icon={<Icon icon='uil:users-alt' className='h-6 w-6' />}
            />
            <StatCardV3
              title={t('activeInvites')}
              value={data?.active_count || 0}
              icon={<Icon icon='uil:check-circle' className='h-6 w-6' />}
            />
          </div>

          {/* Invite Code Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ModernCard className='bg-primary/5 border-primary/20'>
              <ModernCardContent className='p-8'>
                <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
                  <div className='flex-1'>
                    <div className='mb-2 flex items-center gap-2'>
                      <Icon icon='uil:gift' className='text-primary h-6 w-6' />
                      <h3 className='text-foreground text-lg font-bold'>{t('inviteCode')}</h3>
                    </div>
                    <p className='text-muted-foreground mb-4 text-sm'>
                      {t('inviteCodeDescription')}
                    </p>
                    <div className='bg-background/80 inline-flex items-center gap-3 rounded-lg border px-4 py-3'>
                      <code className='text-primary font-mono text-2xl font-bold'>
                        {user?.refer_code}
                      </code>
                      {isBrowser() && (
                        <CopyToClipboard
                          text={user?.refer_code || ''}
                          onCopy={(text, result) => {
                            if (result) {
                              toast.success(t('copySuccess'));
                            }
                          }}
                        >
                          <Button variant='ghost' size='icon' className='h-8 w-8'>
                            <Icon icon='uil:copy' className='h-4 w-4' />
                          </Button>
                        </CopyToClipboard>
                      )}
                    </div>
                  </div>
                  {isBrowser() && (
                    <CopyToClipboard
                      text={`${location?.origin}/auth?invite=${user?.refer_code}`}
                      onCopy={(text, result) => {
                        if (result) {
                          toast.success(t('copySuccess'));
                        }
                      }}
                    >
                      <Button size='lg' className='gap-2'>
                        <Icon icon='uil:link' className='h-5 w-5' />
                        {t('copyInviteLink')}
                      </Button>
                    </CopyToClipboard>
                  )}
                </div>
              </ModernCardContent>
            </ModernCard>
          </motion.div>

          {/* Invite Records */}
          <div>
            <h2 className='text-foreground mb-6 text-2xl font-bold'>{t('inviteRecords')}</h2>
            <ProList<API.UserAffiliate, Record<string, unknown>>
              request={async (pagination, filter) => {
                const response = await queryUserAffiliateList({ ...pagination, ...filter });
                setSum(response.data.data?.sum);
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
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-4'>
                            <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full'>
                              <Icon icon='uil:user' className='h-6 w-6' />
                            </div>
                            <div>
                              <p className='text-foreground mb-1 font-semibold'>
                                {item.identifier}
                              </p>
                              <p className='text-muted-foreground flex items-center gap-1.5 text-sm'>
                                <Icon icon='uil:calendar-alt' className='h-4 w-4' />
                                {formatDate(item.registered_at)}
                              </p>
                            </div>
                          </div>
                          <div className='flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400'>
                            <Icon icon='uil:check' className='h-4 w-4' />
                            已注册
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
