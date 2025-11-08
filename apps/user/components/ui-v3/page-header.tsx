'use client';

import { cn } from '@workspace/ui/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div>
        <h1 className='text-foreground text-3xl font-bold tracking-tight'>{title}</h1>
        {description && <p className='text-muted-foreground mt-2 text-base'>{description}</p>}
      </div>
      {action && <div className='flex-shrink-0'>{action}</div>}
    </motion.div>
  );
}
