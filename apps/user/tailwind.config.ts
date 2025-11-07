import baseConfig from '@workspace/ui/tailwind.config';
import type { Config } from 'tailwindcss';
import { designTokens } from './styles/design-tokens';

const config = {
  ...baseConfig,
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/components/**/*.{ts,tsx}',
    '../../packages/ui/src/custom-components/**/*.{ts,tsx}',
  ],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...(baseConfig.theme as any)?.extend,
      colors: {
        ...(baseConfig.theme as any)?.extend?.colors,
        // 新的设计系统颜色
        brand: {
          primary: designTokens.colors.brand.primary,
          secondary: designTokens.colors.brand.secondary,
          accent: designTokens.colors.brand.accent,
          warning: designTokens.colors.brand.warning,
          danger: designTokens.colors.brand.danger,
        },
        glass: {
          light: designTokens.colors.glass.light,
          medium: designTokens.colors.glass.medium,
          strong: designTokens.colors.glass.strong,
        },
      },
      backgroundImage: {
        'gradient-primary': designTokens.gradients.primary,
        'gradient-accent': designTokens.gradients.accent,
        'gradient-mesh': designTokens.gradients.mesh,
        'gradient-card': designTokens.gradients.card,
      },
      boxShadow: {
        'glass': designTokens.shadows.glass,
        'glow-primary': designTokens.shadows.glow.primary,
        'glow-accent': designTokens.shadows.glow.accent,
        'glow-strong': designTokens.shadows.glow.strong,
      },
      backdropBlur: {
        glass: '20px',
      },
      animation: {
        ...(baseConfig.theme as any)?.extend?.animation,
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        ...(baseConfig.theme as any)?.extend?.keyframes,
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
} satisfies Config;

export default config;
