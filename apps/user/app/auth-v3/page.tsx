'use client';

import { OAuthMethods } from '@/components/auth/oauth-methods';
import LanguageSwitch from '@/components/language-switch';
import ThemeSwitch from '@/components/theme-switch';
import { ModernCard, ModernCardContent } from '@/components/ui-v3/modern-card';
import useGlobalStore from '@/config/use-global';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import LoginLottie from '@workspace/ui/lotties/login.json';
import { useTranslations } from 'next-intl';
import Image from 'next/legacy/image';
import Link from 'next/link';
import EmailAuthForm from './email/auth-form';
import PhoneAuthForm from './phone/auth-form';

export default function AuthV3() {
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
    <main className='bg-background relative flex min-h-screen items-center'>
      <div className='relative z-10 flex size-full flex-auto flex-col lg:flex-row'>
        {/* Left Side: Branding */}
        <div className='border-border relative flex flex-col items-center justify-center border-r p-12 lg:w-1/2 lg:flex-auto'>
          {/* Logo & Brand */}
          <Link className='mb-8 flex flex-col items-center gap-4 lg:mb-16' href='/'>
            <div className='relative'>
              {site.site_logo && (
                <div className='bg-primary/10 relative rounded-2xl p-4'>
                  <Image src={site.site_logo} height={64} width={64} alt='logo' unoptimized />
                </div>
              )}
            </div>
            <span className='text-foreground text-3xl font-bold'>{site.site_name}</span>
          </Link>

          {/* Animation */}
          <div className='mb-8 hidden lg:block'>
            <DotLottieReact
              data={LoginLottie}
              autoplay
              loop
              className='relative mx-auto w-[275px] xl:w-[500px]'
            />
          </div>

          {/* Description */}
          <p className='text-muted-foreground hidden max-w-md text-center text-lg lg:block'>
            {site.site_desc}
          </p>
        </div>

        {/* Right Side: Auth Form */}
        <div className='flex flex-initial justify-center p-6 lg:flex-auto lg:justify-end lg:p-12'>
          <div className='flex w-full max-w-md flex-col'>
            <ModernCard>
              <ModernCardContent className='p-8'>
                {/* Header */}
                <div className='mb-8 text-center'>
                  <h1 className='text-foreground mb-2 text-2xl font-bold'>{t('verifyAccount')}</h1>
                  <p className='text-muted-foreground text-sm'>{t('verifyAccountDesc')}</p>
                </div>

                {/* Auth Methods */}
                <div className='mb-6'>
                  {AUTH_METHODS.length === 1
                    ? AUTH_METHODS[0]?.children
                    : AUTH_METHODS[0] && (
                        <Tabs defaultValue={AUTH_METHODS[0].key} className='w-full'>
                          <TabsList className='mb-6 grid w-full grid-cols-2'>
                            {AUTH_METHODS.map((item) => (
                              <TabsTrigger key={item.key} value={item.key}>
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

                {/* OAuth Methods */}
                <div className='border-border border-t pt-6'>
                  <OAuthMethods />
                </div>
              </ModernCardContent>
            </ModernCard>

            {/* Bottom Links & Settings */}
            <div className='mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-4'>
                <LanguageSwitch />
                <ThemeSwitch />
              </div>
              <div className='text-muted-foreground flex gap-3 text-sm'>
                <Link href='/tos' className='hover:text-foreground transition-colors'>
                  {t('tos')}
                </Link>
                <span>|</span>
                <Link href='/privacy-policy' className='hover:text-foreground transition-colors'>
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
