'use client';

import useGlobalStore from '@/config/use-global';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button } from '@workspace/ui/components/button';
import NetworkSecurityLottie from '@workspace/ui/lotties/network-security.json';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function Hero() {
  const t = useTranslations('index');
  const { common, user } = useGlobalStore();
  const { site } = common;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      viewport={{ once: true, amount: 0.2 }}
      className='relative grid gap-8 pt-16 sm:grid-cols-2'
    >
      {/* 背景装饰 */}
      <div className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
        <div
          className='absolute left-1/4 top-0 h-96 w-96 rounded-full opacity-20 blur-3xl'
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
          }}
        />
        <div
          className='absolute bottom-0 right-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl'
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.3 }}
        viewport={{ once: true, amount: 0.3 }}
        className='flex flex-col items-start justify-center space-y-6'
      >
        {/* 标签 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className='inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 backdrop-blur-sm'
        >
          <Sparkles className='h-4 w-4 text-indigo-400' />
          <span className='text-sm font-medium text-indigo-300'>现代化网络加速服务</span>
        </motion.div>

        {/* 标题 */}
        <h1 className='bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-4xl font-bold text-transparent lg:text-6xl'>
          {t('welcome')} {site.site_name}
        </h1>

        {/* 描述 */}
        {site.site_desc && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className='max-w-xl text-lg leading-relaxed text-slate-300'
          >
            {site.site_desc}
          </motion.p>
        )}

        {/* 按钮组 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className='flex flex-wrap gap-4'
        >
          <Link href={user ? '/dashboard' : '/auth'}>
            <Button
              size='lg'
              className='group bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
            >
              {t('started')}
              <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
            </Button>
          </Link>
          <Link href='#product-showcase'>
            <Button size='lg' variant='outline' className='border-white/10 bg-white/5 hover:bg-white/10'>
              查看套餐
            </Button>
          </Link>
        </motion.div>

        {/* 特性标签 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className='flex flex-wrap gap-3 pt-4'
        >
          {['全球节点', '高速稳定', '安全加密'].map((feature, index) => (
            <div
              key={index}
              className='flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 backdrop-blur-sm'
            >
              <div className='h-1.5 w-1.5 rounded-full bg-emerald-400' />
              {feature}
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.5 }}
        viewport={{ once: true, amount: 0.3 }}
        className='relative flex w-full items-center justify-center'
      >
        {/* 发光效果 */}
        <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl' />
        <div className='relative'>
          <DotLottieReact data={NetworkSecurityLottie} autoplay loop />
        </div>
      </motion.div>
    </motion.div>
  );
}
