'use client';

import { cn } from '@workspace/ui/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface StatCardV3Props {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    direction?: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

export function StatCardV3({ title, value, icon, trend, className }: StatCardV3Props) {
  const trendColor = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-muted-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'bg-card border-border hover:border-primary/20 rounded-lg border p-6 transition-all duration-300 hover:shadow-md',
        className,
      )}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <p className='text-muted-foreground text-sm font-medium'>{title}</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className='text-foreground mt-2 text-3xl font-bold'
          >
            {value}
          </motion.p>
          {trend && (
            <div
              className={cn(
                'mt-2 flex items-center gap-1 text-sm',
                trendColor[trend.direction || 'neutral'],
              )}
            >
              {trend.direction === 'up' && (
                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 10l7-7m0 0l7 7m-7-7v18'
                  />
                </svg>
              )}
              {trend.direction === 'down' && (
                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 14l-7 7m0 0l-7-7m7 7V3'
                  />
                </svg>
              )}
              <span className='font-medium'>{trend.value}%</span>
              <span className='text-muted-foreground'>{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg'>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
