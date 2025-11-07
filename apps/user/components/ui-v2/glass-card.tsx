'use client';

import { cn } from '@workspace/ui/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  gradient = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        // 玻璃态基础样式
        'relative overflow-hidden',
        'bg-white/5 backdrop-blur-xl',
        'border border-white/10',
        'rounded-2xl',
        'shadow-[0_8px_32px_rgba(0,0,0,0.37)]',
        // 渐变背景（可选）
        gradient &&
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-white/2 before:z-0',
        // 悬浮效果
        hover && [
          'transition-all duration-300 ease-out',
          'hover:border-white/20',
          'hover:-translate-y-1',
          'hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]',
        ],
        // 发光效果
        glow && 'hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]',
        className
      )}
      {...props}
    >
      {/* 顶部渐变条 */}
      {glow && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* 内容 */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
