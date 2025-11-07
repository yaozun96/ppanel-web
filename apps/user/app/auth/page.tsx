'use client';

import { OAuthMethods } from '@/components/auth/oauth-methods';
import LanguageSwitch from '@/components/language-switch';
import ThemeSwitch from '@/components/theme-switch';
import useGlobalStore from '@/config/use-global';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import LoginLottie from '@workspace/ui/lotties/login.json';
import { Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/legacy/image';
import Link from 'next/link';
import EmailAuthForm from './email/auth-form';
import PhoneAuthForm from './phone/auth-form';

export default function Page() {
  const t = useTranslations('auth');
  const { common } = useGlobalStore();
  const { site, auth } = common;

  const AUTH_METHODS = [
    {
      key: 'email',
      enabled: auth.email.enable,
      children: <EmailAuthForm />,
    },
    {
      key: 'mobile',
      enabled: auth.mobile.enable,
      children: <PhoneAuthForm />,
    },
  ].filter((method) => method.enabled);

  return (
    <main className='relative flex h-full min-h-screen items-center overflow-hidden bg-[#0a0a0a]'>
      {/* 背景装饰 */}
      <div className='pointer-events-none fixed inset-0'>
        {/* 渐变光晕 */}
        <div
          className='absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl'
          style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, transparent 70%)' }}
        />
        <div
          className='absolute bottom-0 right-0 h-[600px] w-[600px] translate-x-1/2 translate-y-1/2 rounded-full opacity-20 blur-3xl'
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)' }}
        />

        {/* 网格背景 */}
        <div
          className='absolute inset-0 opacity-10'
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* 主要内容 */}
      <div className='relative z-10 flex size-full flex-auto flex-col lg:flex-row'>
        {/* 左侧：品牌展示 */}
        <div className='relative flex flex-col items-center justify-center p-12 lg:w-1/2 lg:flex-auto'>
          {/* Logo 和品牌名 */}
          <Link className='mb-8 flex flex-col items-center gap-4 lg:mb-16' href='/'>
            <div className='relative'>
              {site.site_logo && (
                <div className='relative rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 backdrop-blur-sm ring-1 ring-white/10'>
                  <Image src={site.site_logo} height={64} width={64} alt='logo' unoptimized />
                </div>
              )}
            </div>
            <span className='bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-3xl font-bold text-transparent'>
              {site.site_name}
            </span>
          </Link>

          {/* 动画 */}
          <div className='mb-8 hidden lg:block'>
            <div className='relative'>
              <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-2xl' />
              <DotLottieReact
                data={LoginLottie}
                autoplay
                loop
                className='relative mx-auto w-[275px] xl:w-[500px]'
              />
            </div>
          </div>

          {/* 描述 */}
          <p className='hidden max-w-md text-center text-lg text-slate-300 lg:block'>{site.site_desc}</p>

          {/* 特性标签 */}
          <div className='mt-8 hidden items-center gap-3 lg:flex'>
            {['安全加密', '全球覆盖', '高速稳定'].map((feature, index) => (
              <div
                key={index}
                className='flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 backdrop-blur-sm'
              >
                <Shield className='h-3.5 w-3.5 text-emerald-400' />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：认证表单 */}
        <div className='flex flex-initial justify-center p-6 lg:flex-auto lg:justify-end lg:p-12'>
          <div className='flex w-full max-w-md flex-col'>
            {/* 认证卡片 */}
            <div className='overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl'>
              {/* 顶部渐变条 */}
              <div className='h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500' />

              <div className='p-8'>
                {/* 头部 */}
                <div className='mb-8 text-center'>
                  <h1 className='mb-2 text-2xl font-bold text-white'>{t('verifyAccount')}</h1>
                  <p className='text-sm text-slate-400'>{t('verifyAccountDesc')}</p>
                </div>

                {/* 认证方法 */}
                <div className='mb-6'>
                  {AUTH_METHODS.length === 1
                    ? AUTH_METHODS[0]?.children
                    : AUTH_METHODS[0] && (
                        <Tabs defaultValue={AUTH_METHODS[0].key} className='w-full'>
                          <TabsList className='mb-6 grid w-full grid-cols-2 bg-white/5'>
                            {AUTH_METHODS.map((item) => (
                              <TabsTrigger
                                key={item.key}
                                value={item.key}
                                className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500'
                              >
                                {t(`methods.${item.key}`)}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                          {AUTH_METHODS.map((item) => (
                            <TabsContent key={item.key} value={item.key}>
                              {item.children}
                            </TabsContent>
                          ))}
                        </Tabs>
                      )}
                </div>

                {/* OAuth 方法 */}
                <div className='border-t border-white/10 pt-6'>
                  <OAuthMethods />
                </div>
              </div>
            </div>

            {/* 底部链接和设置 */}
            <div className='mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-4'>
                <LanguageSwitch />
                <ThemeSwitch />
              </div>
              <div className='flex gap-3 text-sm'>
                <Link
                  href='/tos'
                  className='text-slate-400 transition-colors hover:text-indigo-400'
                >
                  {t('tos')}
                </Link>
                <span className='text-slate-600'>|</span>
                <Link
                  href='/privacy-policy'
                  className='text-slate-400 transition-colors hover:text-indigo-400'
                >
                  {t('privacyPolicy')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
