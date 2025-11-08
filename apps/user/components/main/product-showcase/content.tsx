'use client';

import { Display } from '@/components/display';
import { SubscribeDetail } from '@/components/subscribe/detail';
import useGlobalStore from '@/config/use-global';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Key, ReactNode } from 'react';

interface ProductShowcaseProps {
  subscriptionData: API.Subscribe[];
}

export function Content({ subscriptionData }: ProductShowcaseProps) {
  const t = useTranslations('index');
  const { user } = useGlobalStore();

  return (
    <section id='product-showcase' className='scroll-mt-20 py-20'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className='mb-12 text-center'
      >
        <div className='bg-primary/10 text-primary border-primary/20 mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2'>
          <Icon icon='uil:tag-alt' className='h-4 w-4' />
          <span className='text-sm font-medium'>Flexible Plans</span>
        </div>

        <h2 className='text-foreground mb-4 text-4xl font-bold sm:text-5xl'>
          {t('product_showcase_title')}
        </h2>

        <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
          {t('product_showcase_description')}
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className='mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {subscriptionData?.map((item, index) => {
          let parsedDescription;
          try {
            parsedDescription = JSON.parse(item.description);
          } catch {
            parsedDescription = { description: '', features: [] };
          }

          const { description, features } = parsedDescription;
          const isPopular = index === 1;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'group relative h-full overflow-hidden border-2 transition-all hover:shadow-xl',
                  isPopular
                    ? 'border-primary scale-105 shadow-lg'
                    : 'border-border hover:border-primary/50',
                )}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className='bg-primary text-primary-foreground absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-medium shadow-lg'>
                    Most Popular
                  </div>
                )}

                {/* Top gradient bar */}
                <div
                  className={cn(
                    'h-1 w-full',
                    isPopular
                      ? 'from-primary bg-gradient-to-r to-purple-600'
                      : 'from-primary/50 bg-gradient-to-r to-purple-600/50 opacity-0 transition-opacity group-hover:opacity-100',
                  )}
                />

                {/* Content */}
                <div className='flex h-full flex-col p-6'>
                  {/* Header */}
                  <div className='mb-6'>
                    <h3 className='text-foreground mb-2 text-2xl font-bold'>{item.name}</h3>
                    {description && <p className='text-muted-foreground text-sm'>{description}</p>}
                  </div>

                  {/* Price */}
                  <div className='mb-6'>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-foreground text-5xl font-bold'>
                        <Display type='currency' value={item.unit_price} />
                      </span>
                      <span className='text-muted-foreground text-sm'>/{t(item.unit_time)}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className='mb-6 flex-grow space-y-3'>
                    {features?.map(
                      (
                        feature: {
                          type: string;
                          icon: string;
                          label: ReactNode;
                        },
                        idx: Key,
                      ) => (
                        <div key={idx} className='flex items-center gap-3'>
                          <Icon
                            icon={feature.type === 'destructive' ? 'uil:times' : 'uil:check'}
                            className={cn(
                              'h-5 w-5',
                              feature.type === 'destructive'
                                ? 'text-muted-foreground'
                                : 'text-primary',
                            )}
                          />
                          <span
                            className={cn(
                              'text-sm',
                              feature.type === 'destructive'
                                ? 'text-muted-foreground line-through'
                                : 'text-foreground',
                            )}
                          >
                            {feature.label}
                          </span>
                        </div>
                      ),
                    )}

                    {/* Subscribe Details */}
                    <div className='pt-2'>
                      <SubscribeDetail
                        subscribe={{
                          ...item,
                          name: undefined,
                        }}
                      />
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={cn(
                      'w-full',
                      isPopular &&
                        'from-primary hover:from-primary/90 bg-gradient-to-r to-purple-600 hover:to-purple-600/90',
                    )}
                    variant={isPopular ? 'default' : 'outline'}
                    size='lg'
                    asChild
                  >
                    <Link href={user ? '/subscribe' : `/purchasing?id=${item.id}`}>
                      <Icon icon='uil:shopping-cart' className='mr-2 h-5 w-5' />
                      {t('subscribe')}
                    </Link>
                  </Button>
                </div>

                {/* Background decoration */}
                {isPopular && <div className='bg-primary/5 pointer-events-none absolute inset-0' />}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className='mt-12 text-center'
      >
        <p className='text-muted-foreground mb-4'>
          Not sure which plan is right for you? We're here to help.
        </p>
        <Link href={user ? '/ticket' : '/auth'}>
          <Button variant='outline' size='lg'>
            <Icon icon='uil:comment-alt-question' className='mr-2 h-5 w-5' />
            Contact Support
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
