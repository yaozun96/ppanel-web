/**
 * Design System Tokens
 * 现代科技风格 - Cyber Secure
 */

export const designTokens = {
  colors: {
    // 品牌色
    brand: {
      primary: '#6366f1', // 靛蓝
      secondary: '#8b5cf6', // 紫色
      accent: '#10b981', // 翠绿（强调）
      warning: '#f59e0b', // 橙色
      danger: '#ef4444', // 红色
    },

    // 背景层级
    background: {
      base: '#0a0a0a', // 深黑
      elevated: '#141414', // 卡片背景
      hover: '#1a1a1a', // 悬停态
      subtle: '#0f172a', // 微妙背景
    },

    // 玻璃态效果
    glass: {
      light: 'rgba(255, 255, 255, 0.05)',
      medium: 'rgba(255, 255, 255, 0.1)',
      strong: 'rgba(255, 255, 255, 0.15)',
    },

    // 文字
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      tertiary: '#64748b',
      muted: '#475569',
    },

    // 边框
    border: {
      default: 'rgba(255, 255, 255, 0.1)',
      strong: 'rgba(255, 255, 255, 0.2)',
      glow: 'rgba(99, 102, 241, 0.3)',
    },
  },

  gradients: {
    primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    accent: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    mesh: 'radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
  },

  typography: {
    fonts: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
    },
    sizes: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
    },
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.37)',
    glow: {
      primary: '0 0 20px rgba(99, 102, 241, 0.3)',
      accent: '0 0 20px rgba(16, 185, 129, 0.3)',
      strong: '0 0 40px rgba(99, 102, 241, 0.5)',
    },
  },

  animations: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easings: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  borderRadius: {
    sm: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem', // 32px
  },
} as const;

export type DesignTokens = typeof designTokens;
