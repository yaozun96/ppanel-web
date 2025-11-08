'use client';

import useGlobalStore from '@/config/use-global';
import { Card } from '@workspace/ui/components/card';
import { Icon } from '@workspace/ui/custom-components/icon';
import { formatDate } from '@workspace/ui/utils';
import { motion } from 'framer-motion';
import ChangePassword from './change-password';
import NotifySettings from './notify-settings';
import ThirdPartyAccounts from './third-party-accounts';

export default function ProfileV4() {
  const { user } = useGlobalStore();

  const accountInfo = [
    {
      label: 'User ID',
      value: user?.id || '-',
      icon: 'uil:user',
    },
    {
      label: 'Email / Phone',
      value: user?.auth_methods?.[0]?.auth_identifier || '-',
      icon: 'uil:envelope-alt',
    },
    {
      label: 'Member Since',
      value: user?.created_at ? formatDate(user.created_at) : '-',
      icon: 'uil:calendar-alt',
    },
  ];

  return (
    <div className='bg-background min-h-screen py-8'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-8'>
          <h1 className='text-foreground mb-2 text-3xl font-bold'>Account Settings</h1>
          <p className='text-muted-foreground'>Manage your account information and preferences</p>
        </motion.div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Left Column - Account Overview */}
          <div className='space-y-6 lg:col-span-1'>
            {/* User Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className='p-6'>
                <div className='mb-6 flex flex-col items-center text-center'>
                  <div className='bg-primary/10 text-primary mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
                    <Icon icon='uil:user' className='h-10 w-10' />
                  </div>
                  <h2 className='text-foreground mb-1 text-xl font-bold'>
                    {user?.auth_methods?.[0]?.auth_identifier?.split('@')[0] || 'User'}
                  </h2>
                  <p className='text-muted-foreground text-sm'>
                    {user?.auth_methods?.[0]?.auth_identifier || 'No email set'}
                  </p>
                </div>

                <div className='space-y-3'>
                  {accountInfo.map((item, index) => (
                    <div key={index} className='bg-muted/50 flex items-start gap-3 rounded-lg p-3'>
                      <Icon icon={item.icon} className='text-primary mt-0.5 h-5 w-5' />
                      <div className='min-w-0 flex-1'>
                        <div className='text-muted-foreground text-xs'>{item.label}</div>
                        <div className='text-foreground truncate text-sm font-medium'>
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Security Status */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className='p-6'>
                <h3 className='text-foreground mb-4 flex items-center gap-2 text-lg font-semibold'>
                  <Icon icon='uil:shield-check' className='text-primary h-5 w-5' />
                  Security Status
                </h3>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Password</span>
                    <span className='flex items-center gap-1 text-sm font-medium text-green-600'>
                      <Icon icon='uil:check-circle' className='h-4 w-4' />
                      Set
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Two-Factor Auth</span>
                    <span className='flex items-center gap-1 text-sm font-medium text-yellow-600'>
                      <Icon icon='uil:exclamation-triangle' className='h-4 w-4' />
                      Not Enabled
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Email Verified</span>
                    <span className='flex items-center gap-1 text-sm font-medium text-green-600'>
                      <Icon icon='uil:check-circle' className='h-4 w-4' />
                      Verified
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Settings */}
          <div className='space-y-6 lg:col-span-2'>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ThirdPartyAccounts />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ChangePassword />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <NotifySettings />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
