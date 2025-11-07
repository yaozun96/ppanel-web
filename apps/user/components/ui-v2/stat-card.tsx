'use client';

import { Icon } from '@workspace/ui/custom-components/icon';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { GlassCard } from './glass-card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'accent' | 'warning' | 'danger';
}

export function StatCard({
  icon: IconComponent,
  label,
  value,
  trend,
  trendDirection = 'neutral',
  color = 'primary',
}: StatCardProps) {
  const colorClasses = {
    primary: 'bg-indigo-500/10 text-indigo-400',
    accent: 'bg-emerald-500/10 text-emerald-400',
    warning: 'bg-orange-500/10 text-orange-400',
    danger: 'bg-red-500/10 text-red-400',
  };

  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-slate-400',
  };

  return (
    <GlassCard className='group p-6'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-4'>
          {/* 图标容器 */}
          <motion.div
            className={`h-12 w-12 rounded-xl ${colorClasses[color]} relative flex items-center justify-center overflow-hidden`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {/* 背景光晕 */}
            <motion.div
              className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100'
              transition={{ duration: 0.3 }}
            />

            <IconComponent className='relative z-10 h-6 w-6' />
          </motion.div>

          {/* 文字信息 */}
          <div>
            <p className='mb-1 text-sm text-slate-400'>{label}</p>
            <AnimatedValue value={value} className='text-2xl font-bold text-white' />
          </div>
        </div>

        {/* 趋势指示 */}
        {trend && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`flex items-center gap-1 text-sm font-medium ${trendColors[trendDirection]}`}
          >
            {trendDirection === 'up' && <Icon icon='uil:arrow-up' className='h-4 w-4' />}
            {trendDirection === 'down' && <Icon icon='uil:arrow-down' className='h-4 w-4' />}
            <span>{trend}</span>
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
}

// 数字动画组件
function AnimatedValue({ value, className }: { value: string | number; className?: string }) {
  const isNumeric = typeof value === 'number';

  // Always call hooks unconditionally at the top level
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1500 });
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    if (isNumeric) {
      motionValue.set(value as number);
    }
  }, [motionValue, value, isNumeric]);

  useEffect(() => {
    if (!isNumeric) return;

    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [springValue, isNumeric]);

  if (!isNumeric) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        {value}
      </motion.div>
    );
  }

  return <div className={className}>{Math.round(displayValue)}</div>;
}
