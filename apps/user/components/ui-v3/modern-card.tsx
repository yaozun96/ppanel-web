'use client';

import { cn } from '@workspace/ui/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  noPadding?: boolean;
}

export function ModernCard({
  children,
  className,
  hover = false,
  noPadding = false,
}: ModernCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hover ? { y: -4 } : undefined}
      className={cn(
        'bg-card border-border rounded-lg border transition-all duration-300',
        !noPadding && 'p-6',
        hover && 'hover:border-primary/20 hover:shadow-lg',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

interface ModernCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernCardHeader({ children, className }: ModernCardHeaderProps) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

interface ModernCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernCardTitle({ children, className }: ModernCardTitleProps) {
  return <h3 className={cn('text-foreground text-lg font-semibold', className)}>{children}</h3>;
}

interface ModernCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernCardDescription({ children, className }: ModernCardDescriptionProps) {
  return <p className={cn('text-muted-foreground mt-1 text-sm', className)}>{children}</p>;
}

interface ModernCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernCardContent({ children, className }: ModernCardContentProps) {
  return <div className={cn('', className)}>{children}</div>;
}

interface ModernCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernCardFooter({ children, className }: ModernCardFooterProps) {
  return <div className={cn('border-border mt-4 border-t pt-4', className)}>{children}</div>;
}
