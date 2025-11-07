'use client';

import {
  NEXT_PUBLIC_HOME_LOCATION_COUNT,
  NEXT_PUBLIC_HOME_SERVER_COUNT,
  NEXT_PUBLIC_HOME_USER_COUNT,
} from '@/config/constants';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import LocationsLittie from '@workspace/ui/lotties/locations.json';
import ServersLottie from '@workspace/ui/lotties/servers.json';
import UsersLottie from '@workspace/ui/lotties/users.json';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function Stats() {
  const t = useTranslations('index');

  const list = [
    {
      name: t('users'),
      number: NEXT_PUBLIC_HOME_USER_COUNT,
      icon: <DotLottieReact className='size-20' data={UsersLottie} autoplay loop />,
      gradient: 'from-indigo-500 to-purple-500',
      bgGlow: 'rgba(99, 102, 241, 0.1)',
    },
    {
      name: t('servers'),
      number: NEXT_PUBLIC_HOME_SERVER_COUNT,
      icon: <DotLottieReact className='size-20' data={ServersLottie} autoplay loop />,
      gradient: 'from-purple-500 to-pink-500',
      bgGlow: 'rgba(139, 92, 246, 0.1)',
    },
    {
      name: t('locations'),
      number: NEXT_PUBLIC_HOME_LOCATION_COUNT,
      icon: <DotLottieReact className='size-20' data={LocationsLittie} autoplay loop />,
      gradient: 'from-emerald-500 to-teal-500',
      bgGlow: 'rgba(16, 185, 129, 0.1)',
    },
  ];

  return (
    <motion.section
      className='z-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-3'
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.8 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {list.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.8 }}
          className='group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:-translate-y-2 hover:border-white/20 hover:shadow-2xl'
        >
          {/* 顶部渐变条 */}
          <div
            className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${item.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
          />

          {/* 背景发光效果 */}
          <div
            className='absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100'
            style={{ backgroundColor: item.bgGlow }}
          />

          <div className='relative flex flex-col items-center text-center'>
            {/* 图标容器 */}
            <div className='mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 transition-transform group-hover:scale-110 group-hover:ring-white/20'>
              {item.icon}
            </div>

            {/* 数字 */}
            <div className={`mb-2 bg-gradient-to-r ${item.gradient} bg-clip-text text-4xl font-bold text-transparent`}>
              <CountUp end={item.number} duration={2000 + index * 500} />+
            </div>

            {/* 标签 */}
            <p className='text-lg font-medium text-slate-300'>{item.name}</p>
          </div>

          {/* 装饰性元素 */}
          <div className='absolute -bottom-2 -left-2 h-20 w-20 rounded-full bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
        </motion.div>
      ))}
    </motion.section>
  );
}

function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const easeOutQuad = (t: number) => t * (2 - t);

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const easedProgress = easeOutQuad(Math.min(progress / duration, 1));
      const nextCount = Math.round(easedProgress * end);

      setCount(nextCount);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
}
