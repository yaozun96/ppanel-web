'use client';

import { cn } from '@workspace/ui/lib/utils';
import React from 'react';

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && <label className='text-foreground mb-2 block text-sm font-medium'>{label}</label>}
        <div className='relative'>
          {leftIcon && (
            <div className='text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2'>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'bg-background border-input w-full rounded-lg border px-3 py-2 text-sm',
              'transition-all duration-200',
              'focus:ring-primary focus:border-transparent focus:outline-none focus:ring-2',
              'placeholder:text-muted-foreground',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive focus:ring-destructive',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className='text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2'>
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className='text-destructive mt-1.5 text-sm'>{error}</p>}
        {helperText && !error && (
          <p className='text-muted-foreground mt-1.5 text-sm'>{helperText}</p>
        )}
      </div>
    );
  },
);

ModernInput.displayName = 'ModernInput';
