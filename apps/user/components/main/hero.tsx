'use client';

import useGlobalStore from '@/config/use-global';
import { Button } from '@workspace/ui/components/button';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

export function Hero() {
  const t = useTranslations('index');
  const { common, user } = useGlobalStore();
  const { site } = common;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className='relative overflow-hidden py-20'>
      {/* Background decorations */}
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='bg-primary/5 absolute left-1/4 top-0 h-96 w-96 rounded-full blur-3xl' />
        <div className='bg-primary/5 absolute bottom-0 right-1/4 h-96 w-96 rounded-full blur-3xl' />
      </div>

      <div className='grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8'>
        {/* Left Column - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className='flex flex-col justify-center space-y-8'
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='border-primary/20 bg-primary/10 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2'
          >
            <Icon icon='uil:shield-check' className='text-primary h-4 w-4' />
            <span className='text-primary text-sm font-medium'>Secure & Fast Network</span>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className='text-foreground mb-4 text-5xl font-bold leading-tight lg:text-6xl'>
              {t('welcome')}
              <br />
              <span className='from-primary bg-gradient-to-r to-purple-600 bg-clip-text text-transparent'>
                {site.site_name}
              </span>
            </h1>
            {site.site_desc && (
              <p className='text-muted-foreground max-w-xl text-lg leading-relaxed'>
                {site.site_desc}
              </p>
            )}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='space-y-3'
          >
            {[
              { icon: 'uil:rocket', text: 'Lightning Fast Speeds' },
              { icon: 'uil:shield', text: 'Military-grade Encryption' },
              { icon: 'uil:globe', text: 'Global Server Network' },
            ].map((feature, index) => (
              <div key={index} className='flex items-center gap-3'>
                <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg'>
                  <Icon icon={feature.icon} className='text-primary h-4 w-4' />
                </div>
                <span className='text-foreground font-medium'>{feature.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='flex flex-wrap gap-4'
          >
            <Link href={user ? '/dashboard' : '/auth'}>
              <Button size='lg' className='group'>
                <Icon icon='uil:play' className='mr-2 h-5 w-5' />
                {t('started')}
                <Icon
                  icon='uil:arrow-right'
                  className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1'
                />
              </Button>
            </Link>
            <Link href='#product-showcase'>
              <Button size='lg' variant='outline'>
                <Icon icon='uil:shopping-cart' className='mr-2 h-5 w-5' />
                View Plans
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className='flex flex-wrap items-center gap-6 pt-4'
          >
            <div className='flex items-center gap-2'>
              <Icon icon='uil:check-circle' className='h-5 w-5 text-green-500' />
              <span className='text-muted-foreground text-sm'>No Logs Policy</span>
            </div>
            <div className='flex items-center gap-2'>
              <Icon icon='uil:check-circle' className='h-5 w-5 text-green-500' />
              <span className='text-muted-foreground text-sm'>24/7 Support</span>
            </div>
            <div className='flex items-center gap-2'>
              <Icon icon='uil:check-circle' className='h-5 w-5 text-green-500' />
              <span className='text-muted-foreground text-sm'>30-Day Guarantee</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Visual Element */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='relative flex items-center justify-center'
        >
          {/* Big Shield Button */}
          <div className='relative'>
            {/* Glow Effect */}
            <motion.div
              className='bg-primary/20 absolute inset-0 rounded-full blur-3xl'
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Main Shield */}
            <motion.div
              className='relative'
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div
                className={cn(
                  'relative flex h-72 w-72 items-center justify-center rounded-full shadow-2xl transition-all duration-500',
                  isHovered
                    ? 'bg-gradient-to-br from-green-400 to-green-600'
                    : 'from-primary bg-gradient-to-br to-purple-600',
                )}
              >
                <Icon
                  icon={isHovered ? 'uil:shield-check' : 'uil:shield'}
                  className='h-32 w-32 text-white'
                />

                {/* Pulse Ring */}
                {isHovered && (
                  <motion.div
                    className='absolute inset-0 rounded-full bg-green-500/20'
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className='bg-card absolute -bottom-6 -left-6 rounded-xl border p-4 shadow-xl backdrop-blur-lg'
            >
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
                  <Icon icon='uil:tachometer-fast' className='text-primary h-6 w-6' />
                </div>
                <div>
                  <p className='text-foreground text-lg font-bold'>Ultra Fast</p>
                  <p className='text-muted-foreground text-xs'>10Gbps Speed</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className='bg-card absolute -right-6 -top-6 rounded-xl border p-4 shadow-xl backdrop-blur-lg'
            >
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10'>
                  <Icon icon='uil:check-circle' className='h-6 w-6 text-green-500' />
                </div>
                <div>
                  <p className='text-foreground text-lg font-bold'>Protected</p>
                  <p className='text-muted-foreground text-xs'>99.9% Uptime</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
