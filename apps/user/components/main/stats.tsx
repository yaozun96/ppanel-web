'use client';

import {
  NEXT_PUBLIC_HOME_LOCATION_COUNT,
  NEXT_PUBLIC_HOME_SERVER_COUNT,
  NEXT_PUBLIC_HOME_USER_COUNT,
} from '@/config/constants';
import { Card } from '@workspace/ui/components/card';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function Stats() {
  const t = useTranslations('index');

  const list = [
    {
      name: t('users'),
      number: NEXT_PUBLIC_HOME_USER_COUNT,
      icon: 'uil:users-alt',
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    {
      name: t('servers'),
      number: NEXT_PUBLIC_HOME_SERVER_COUNT,
      icon: 'uil:server',
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
    },
    {
      name: t('locations'),
      number: NEXT_PUBLIC_HOME_LOCATION_COUNT,
      icon: 'uil:location-point',
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500',
    },
  ];

  return (
    <section className='grid w-full grid-cols-1 gap-6 py-12 sm:grid-cols-3'>
      {list.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Card className='group relative overflow-hidden p-8 transition-all hover:shadow-xl'>
            {/* Top gradient bar */}
            <div
              className={cn(
                'absolute left-0 top-0 h-1 w-full bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100',
                item.gradient,
              )}
            />

            {/* Content */}
            <div className='flex flex-col items-center text-center'>
              {/* Icon */}
              <div
                className={cn(
                  'mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110',
                  item.iconBg,
                )}
              >
                <Icon icon={item.icon} className={cn('h-8 w-8', item.iconColor)} />
              </div>

              {/* Number */}
              <div
                className={cn(
                  'mb-2 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent',
                  item.gradient,
                )}
              >
                <CountUp end={item.number} duration={2000 + index * 500} />
                <span className='ml-1'>+</span>
              </div>

              {/* Label */}
              <p className='text-muted-foreground text-lg font-medium'>{item.name}</p>
            </div>

            {/* Background decoration */}
            <div
              className={cn(
                'absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-20',
                item.iconBg,
              )}
            />
          </Card>
        </motion.div>
      ))}
    </section>
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
