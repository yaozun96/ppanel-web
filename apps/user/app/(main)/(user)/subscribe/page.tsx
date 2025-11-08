'use client';

import { Display } from '@/components/display';
import { Empty } from '@/components/empty';
import Purchase from '@/components/subscribe/purchase';
import { querySubscribeList } from '@/services/user/subscribe';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

export default function SubscribeV4() {
  const t = useTranslations('subscribe');
  const locale = useLocale();
  const [subscribe, setSubscribe] = useState<API.Subscribe>();
  const [billingCycle, setBillingCycle] = useState<'Month' | 'Quarter' | 'Year'>('Month');

  const { data, isLoading } = useQuery({
    queryKey: ['querySubscribeList', locale],
    queryFn: async () => {
      const { data } = await querySubscribeList({ language: locale });
      return data.data?.list || [];
    },
  });

  const filteredData = data?.filter((item) => item.show);

  // Group plans by unit_time
  const plansByBilling = filteredData?.reduce(
    (acc, plan) => {
      const billing = plan.unit_time || 'Month';
      if (!acc[billing]) acc[billing] = [];
      acc[billing].push(plan);
      return acc;
    },
    {} as Record<string, API.Subscribe[]>,
  );

  const currentPlans = plansByBilling?.[billingCycle] || [];

  const features = [
    { name: 'Data Allowance', key: 'traffic' },
    { name: 'Speed Limit', key: 'speed_limit' },
    { name: 'Device Limit', key: 'device_limit' },
    { name: 'Priority Support', key: 'priority_support' },
    { name: 'Ad Blocker', key: 'ad_blocker' },
    { name: 'Multi-hop Connection', key: 'multi_hop' },
  ];

  if (isLoading) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='flex items-center gap-3'>
          <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
          <span className='text-muted-foreground'>Loading plans...</span>
        </div>
      </div>
    );
  }

  if (!filteredData || filteredData.length === 0) {
    return (
      <div className='bg-background min-h-screen py-12'>
        <Empty />
      </div>
    );
  }

  return (
    <div className='bg-background min-h-screen py-12'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-12 text-center'
        >
          <h1 className='text-foreground mb-4 text-4xl font-bold sm:text-5xl'>Choose Your Plan</h1>
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
            Secure, fast, and reliable. Pick the perfect plan for your needs.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='mb-8 flex justify-center'
        >
          <div className='bg-muted inline-flex rounded-lg p-1'>
            {(['Month', 'Quarter', 'Year'] as const).map((cycle) => {
              const hasPlans = (plansByBilling?.[cycle]?.length || 0) > 0;
              if (!hasPlans) return null;

              return (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={cn(
                    'relative rounded-md px-6 py-2 text-sm font-medium transition-all',
                    billingCycle === cycle
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {cycle}
                  {cycle === 'Year' && (
                    <span className='bg-primary text-primary-foreground ml-2 rounded-full px-2 py-0.5 text-xs'>
                      Save 20%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='mb-12 grid gap-6 md:grid-cols-3'
        >
          {currentPlans.map((plan, index) => {
            let parsedDescription;
            try {
              parsedDescription = JSON.parse(plan.description);
            } catch {
              parsedDescription = { description: '', features: [] };
            }

            const isPopular = index === 1;

            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative overflow-hidden border-2 p-8 transition-all hover:shadow-xl',
                  isPopular
                    ? 'border-primary scale-105 shadow-lg'
                    : 'border-border hover:border-primary/50',
                )}
              >
                {isPopular && (
                  <div className='bg-primary text-primary-foreground absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium'>
                    Most Popular
                  </div>
                )}

                <div className='mb-6'>
                  <h3 className='text-foreground mb-2 text-2xl font-bold'>{plan.name}</h3>
                  <p className='text-muted-foreground text-sm'>
                    {parsedDescription.description || 'Perfect for your needs'}
                  </p>
                </div>

                <div className='mb-6'>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-foreground text-5xl font-bold'>
                      <Display type='currency' value={plan.unit_price} />
                    </span>
                    <span className='text-muted-foreground text-sm'>
                      /{t(plan.unit_time || 'Month')}
                    </span>
                  </div>
                </div>

                <Button
                  size='lg'
                  className='mb-6 w-full'
                  variant={isPopular ? 'default' : 'outline'}
                  onClick={() => setSubscribe(plan)}
                >
                  Get Started
                </Button>

                <div className='space-y-3'>
                  <div className='flex items-center gap-3'>
                    <Icon icon='uil:check' className='text-primary h-5 w-5' />
                    <span className='text-foreground text-sm'>
                      <Display type='traffic' value={plan.traffic} /> Data
                    </span>
                  </div>
                  {plan.speed_limit && (
                    <div className='flex items-center gap-3'>
                      <Icon icon='uil:check' className='text-primary h-5 w-5' />
                      <span className='text-foreground text-sm'>
                        <Display type='trafficSpeed' value={plan.speed_limit} /> Speed
                      </span>
                    </div>
                  )}
                  {plan.device_limit && (
                    <div className='flex items-center gap-3'>
                      <Icon icon='uil:check' className='text-primary h-5 w-5' />
                      <span className='text-foreground text-sm'>{plan.device_limit} Devices</span>
                    </div>
                  )}
                  {parsedDescription.features?.slice(0, 3).map((feature: any, idx: number) => (
                    <div key={idx} className='flex items-center gap-3'>
                      <Icon
                        icon={feature.type === 'destructive' ? 'uil:times' : 'uil:check'}
                        className={cn(
                          'h-5 w-5',
                          feature.type === 'destructive' ? 'text-muted-foreground' : 'text-primary',
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
                  ))}
                </div>
              </Card>
            );
          })}
        </motion.div>

        {/* Feature Comparison Table */}
        {currentPlans.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className='overflow-hidden p-8'>
              <h2 className='text-foreground mb-6 text-2xl font-bold'>Compare All Features</h2>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b'>
                      <th className='text-foreground pb-4 pr-4 text-left font-semibold'>
                        Features
                      </th>
                      {currentPlans.map((plan) => (
                        <th
                          key={plan.id}
                          className='text-foreground px-4 pb-4 text-center font-semibold'
                        >
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='border-b'>
                      <td className='text-muted-foreground py-4 pr-4'>Monthly Price</td>
                      {currentPlans.map((plan) => (
                        <td
                          key={plan.id}
                          className='text-foreground px-4 py-4 text-center font-semibold'
                        >
                          <Display type='currency' value={plan.unit_price} />
                        </td>
                      ))}
                    </tr>
                    <tr className='border-b'>
                      <td className='text-muted-foreground py-4 pr-4'>Data Allowance</td>
                      {currentPlans.map((plan) => (
                        <td key={plan.id} className='text-foreground px-4 py-4 text-center'>
                          <Display type='traffic' value={plan.traffic} />
                        </td>
                      ))}
                    </tr>
                    <tr className='border-b'>
                      <td className='text-muted-foreground py-4 pr-4'>Max Speed</td>
                      {currentPlans.map((plan) => (
                        <td key={plan.id} className='text-foreground px-4 py-4 text-center'>
                          {plan.speed_limit ? (
                            <Display type='trafficSpeed' value={plan.speed_limit} />
                          ) : (
                            'Unlimited'
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className='border-b'>
                      <td className='text-muted-foreground py-4 pr-4'>Devices</td>
                      {currentPlans.map((plan) => (
                        <td key={plan.id} className='text-foreground px-4 py-4 text-center'>
                          {plan.device_limit || 'Unlimited'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='mt-12'
        >
          <h2 className='text-foreground mb-6 text-center text-2xl font-bold'>
            Frequently Asked Questions
          </h2>
          <div className='mx-auto grid max-w-4xl gap-4 md:grid-cols-2'>
            <Card className='p-6'>
              <h3 className='text-foreground mb-2 font-semibold'>Can I change plans anytime?</h3>
              <p className='text-muted-foreground text-sm'>
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect
                immediately.
              </p>
            </Card>
            <Card className='p-6'>
              <h3 className='text-foreground mb-2 font-semibold'>
                What payment methods do you accept?
              </h3>
              <p className='text-muted-foreground text-sm'>
                We accept all major credit cards, PayPal, and cryptocurrency payments.
              </p>
            </Card>
            <Card className='p-6'>
              <h3 className='text-foreground mb-2 font-semibold'>
                Is there a money-back guarantee?
              </h3>
              <p className='text-muted-foreground text-sm'>
                Yes, we offer a 30-day money-back guarantee on all plans. No questions asked.
              </p>
            </Card>
            <Card className='p-6'>
              <h3 className='text-foreground mb-2 font-semibold'>
                Do you offer student discounts?
              </h3>
              <p className='text-muted-foreground text-sm'>
                Yes! Students get 20% off all plans. Contact support with your student ID.
              </p>
            </Card>
          </div>
        </motion.div>
      </div>

      <Purchase subscribe={subscribe} setSubscribe={setSubscribe} />
    </div>
  );
}
