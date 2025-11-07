'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import GlobalMapLottie from '@workspace/ui/lotties/global-map.json';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function GlobalMap() {
  const t = useTranslations('index');

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className='relative'
    >
      {/* 背景装饰 */}
      <div className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
        <div
          className='absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl'
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* 标题区域 */}
      <div className='mb-12 text-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 backdrop-blur-sm'
        >
          <Globe className='h-4 w-4 text-emerald-400' />
          <span className='text-sm font-medium text-emerald-300'>全球覆盖</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent'
        >
          {t('global_map_itle')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='mx-auto max-w-2xl text-lg text-slate-300'
        >
          {t('global_map_description')}
        </motion.p>
      </div>

      {/* 地图容器 */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 15,
          delay: 0.2,
        }}
        className='relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl'
      >
        {/* 顶部渐变条 */}
        <div className='absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500' />

        {/* 装饰性网格 */}
        <div
          className='pointer-events-none absolute inset-0 opacity-10'
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />

        {/* 地图动画 */}
        <div className='relative aspect-video w-full overflow-hidden rounded-xl'>
          <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5' />
          <DotLottieReact className='w-full scale-150' data={GlobalMapLottie} autoplay loop />
        </div>

        {/* 节点指示器 */}
        <div className='mt-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
          {[
            { region: '亚太地区', count: '50+', color: 'emerald' },
            { region: '北美地区', count: '30+', color: 'teal' },
            { region: '欧洲地区', count: '40+', color: 'cyan' },
            { region: '其他地区', count: '20+', color: 'indigo' },
          ].map((item, index) => (
            <motion.div
              key={item.region}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className='flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3'
            >
              <div
                className={`h-2 w-2 rounded-full animate-pulse`}
                style={{
                  backgroundColor: `rgb(${
                    item.color === 'emerald'
                      ? '16, 185, 129'
                      : item.color === 'teal'
                        ? '20, 184, 166'
                        : item.color === 'cyan'
                          ? '6, 182, 212'
                          : '99, 102, 241'
                  })`,
                }}
              />
              <div>
                <p className='text-xs text-slate-400'>{item.region}</p>
                <p className='text-sm font-semibold text-white'>{item.count} 节点</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
