'use client';

import { Empty } from '@/components/empty';
import { ProList, ProListActions } from '@/components/pro-list';
import { Container } from '@/components/ui-v3/container';
import { ModernButton } from '@/components/ui-v3/modern-button';
import {
  ModernCard,
  ModernCardContent,
  ModernCardHeader,
  ModernCardTitle,
} from '@/components/ui-v3/modern-card';
import { ModernInput } from '@/components/ui-v3/modern-input';
import { PageHeader } from '@/components/ui-v3/page-header';
import {
  createUserTicket,
  createUserTicketFollow,
  getUserTicketDetails,
  getUserTicketList,
  updateUserTicketStatus,
} from '@/services/user/ticket';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@workspace/ui/components/drawer';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Textarea } from '@workspace/ui/components/textarea';
import { ConfirmButton } from '@workspace/ui/custom-components/confirm-button';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { formatDate } from '@workspace/ui/utils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import NextImage from 'next/legacy/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function TicketV3() {
  const t = useTranslations('ticket');

  const [ticketId, setTicketId] = useState<any>(null);
  const [message, setMessage] = useState('');

  const { data: ticket, refetch: refetchTicket } = useQuery({
    queryKey: ['getUserTicketDetails', ticketId],
    queryFn: async () => {
      const { data } = await getUserTicketDetails({ id: ticketId });
      return data.data as API.Ticket;
    },
    enabled: !!ticketId,
    refetchInterval: 5000,
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.children[1]?.scrollTo({
          top: scrollRef.current.children[1].scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 66);
  }, [ticket?.follow?.length]);

  const ref = useRef<ProListActions>(null);
  const [create, setCreate] = useState<Partial<API.CreateUserTicketRequest & { open: boolean }>>();

  return (
    <div className='bg-background min-h-screen py-8'>
      <Container>
        <div className='space-y-8'>
          {/* Page Header */}
          <PageHeader
            title={t('ticketList')}
            description='遇到问题？提交工单，我们将尽快为你解答'
            action={
              <Dialog open={create?.open} onOpenChange={(open) => setCreate({ open })}>
                <DialogTrigger asChild>
                  <ModernButton variant='primary' size='md'>
                    <Icon icon='uil:plus' className='mr-2 h-4 w-4' />
                    {t('createTicket')}
                  </ModernButton>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[500px]'>
                  <DialogHeader>
                    <DialogTitle>{t('createTicket')}</DialogTitle>
                    <DialogDescription>{t('createTicketDescription')}</DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4 py-4'>
                    <ModernInput
                      label={t('title')}
                      value={create?.title || ''}
                      onChange={(e) => setCreate({ ...create, title: e.target.value })}
                      placeholder='请输入工单标题'
                    />
                    <div className='space-y-2'>
                      <Label htmlFor='content'>{t('description')}</Label>
                      <Textarea
                        id='content'
                        value={create?.description || ''}
                        onChange={(e) => setCreate({ ...create, description: e.target.value })}
                        placeholder='请详细描述你遇到的问题'
                        className='min-h-[120px]'
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant='outline' onClick={() => setCreate({ open: false })}>
                      {t('cancel')}
                    </Button>
                    <Button
                      disabled={!create?.title || !create?.description}
                      onClick={async () => {
                        await createUserTicket({
                          title: create!.title!,
                          description: create!.description!,
                        });
                        ref.current?.refresh();
                        toast.success(t('createSuccess'));
                        setCreate({ open: false });
                      }}
                    >
                      {t('submit')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            }
          />

          {/* Tickets List */}
          <ProList<API.Ticket, { status: number }>
            action={ref}
            params={[
              {
                key: 'search',
              },
              {
                key: 'status',
                placeholder: t('status.0'),
                options: [
                  {
                    label: t('close'),
                    value: '4',
                  },
                ],
              },
            ]}
            request={async (pagination, filters) => {
              const { data } = await getUserTicketList({
                ...pagination,
                ...filters,
              });
              return {
                list: data.data?.list || [],
                total: data.data?.total || 0,
              };
            }}
            renderItem={(item) => {
              const statusConfig = {
                1: { color: 'yellow', label: 'pending', icon: 'uil:clock' },
                2: { color: 'blue', label: 'replied', icon: 'uil:comment-dots' },
                3: { color: 'green', label: 'resolved', icon: 'uil:check-circle' },
                4: { color: 'gray', label: 'closed', icon: 'uil:times-circle' },
              };

              const status = statusConfig[item.status as keyof typeof statusConfig];

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ModernCard hover className='overflow-hidden'>
                    <ModernCardHeader className='bg-muted/30 flex-row items-center justify-between space-y-0 pb-3'>
                      <ModernCardTitle className='flex items-center gap-2 text-base'>
                        <span
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full',
                            status?.color === 'yellow' &&
                              'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
                            status?.color === 'blue' &&
                              'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                            status?.color === 'green' &&
                              'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                            status?.color === 'gray' &&
                              'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
                          )}
                        >
                          <Icon icon={status?.icon || 'uil:question-circle'} className='h-4 w-4' />
                        </span>
                        {t(`status.${item.status}`)}
                      </ModernCardTitle>
                      <div className='flex gap-2'>
                        {item.status !== 4 ? (
                          <>
                            <Button size='sm' onClick={() => setTicketId(item.id)}>
                              <Icon icon='uil:comment-alt-lines' className='mr-1.5 h-4 w-4' />
                              {t('reply')}
                            </Button>
                            <ConfirmButton
                              trigger={
                                <Button variant='outline' size='sm'>
                                  <Icon icon='uil:times' className='mr-1.5 h-4 w-4' />
                                  {t('close')}
                                </Button>
                              }
                              title={t('confirmClose')}
                              description={t('closeWarning')}
                              onConfirm={async () => {
                                await updateUserTicketStatus({ id: item.id, status: 4 });
                                toast.success(t('closeSuccess'));
                                ref.current?.refresh();
                              }}
                              cancelText={t('cancel')}
                              confirmText={t('confirm')}
                            />
                          </>
                        ) : (
                          <Button size='sm' variant='outline' onClick={() => setTicketId(item.id)}>
                            <Icon icon='uil:eye' className='mr-1.5 h-4 w-4' />
                            {t('check')}
                          </Button>
                        )}
                      </div>
                    </ModernCardHeader>

                    <ModernCardContent className='pt-4'>
                      <div className='grid gap-4 md:grid-cols-3'>
                        <div>
                          <p className='text-muted-foreground mb-1 text-xs font-medium'>
                            {t('title')}
                          </p>
                          <p className='text-foreground line-clamp-1 text-sm font-semibold'>
                            {item.title}
                          </p>
                        </div>
                        <div>
                          <p className='text-muted-foreground mb-1 text-xs font-medium'>
                            {t('description')}
                          </p>
                          <p className='text-foreground line-clamp-1 text-sm'>{item.description}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground mb-1 text-xs font-medium'>
                            {t('updatedAt')}
                          </p>
                          <p className='text-foreground text-sm'>{formatDate(item.updated_at)}</p>
                        </div>
                      </div>
                    </ModernCardContent>
                  </ModernCard>
                </motion.div>
              );
            }}
            empty={<Empty />}
          />
        </div>
      </Container>

      {/* Ticket Detail Drawer */}
      <Drawer
        open={!!ticketId}
        onOpenChange={(open) => {
          if (!open) setTicketId(null);
        }}
      >
        <DrawerContent className='container mx-auto h-screen'>
          <DrawerHeader className='border-b text-left'>
            <DrawerTitle className='flex items-center gap-3'>
              <Icon icon='uil:ticket' className='text-primary h-6 w-6' />
              {ticket?.title}
            </DrawerTitle>
            <DrawerDescription className='line-clamp-2'>{ticket?.description}</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className='h-full overflow-hidden' ref={scrollRef}>
            <div className='flex flex-col gap-4 p-6'>
              {ticket?.follow?.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn('flex items-start gap-3', {
                    'flex-row-reverse': item.from !== 'System',
                  })}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                      item.from === 'System'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-accent text-accent-foreground',
                    )}
                  >
                    <Icon
                      icon={item.from === 'System' ? 'uil:user-circle' : 'uil:user'}
                      className='h-5 w-5'
                    />
                  </div>
                  <div
                    className={cn('flex max-w-[70%] flex-col gap-1.5', {
                      'items-end': item.from !== 'System',
                    })}
                  >
                    <p className='text-muted-foreground text-xs'>{formatDate(item.created_at)}</p>
                    <div
                      className={cn('w-fit rounded-2xl px-4 py-2.5', {
                        'bg-primary text-primary-foreground': item.from !== 'System',
                        'bg-muted': item.from === 'System',
                      })}
                    >
                      {item.type === 1 && <p className='text-sm leading-relaxed'>{item.content}</p>}
                      {item.type === 2 && (
                        <NextImage
                          src={item.content!}
                          width={300}
                          height={300}
                          className='!size-auto rounded-lg object-cover'
                          alt='image'
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
          {ticket?.status !== 4 && (
            <DrawerFooter className='border-t'>
              <form
                className='flex w-full flex-row items-center gap-3'
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (message) {
                    await createUserTicketFollow({
                      ticket_id: ticketId,
                      from: 'User',
                      type: 1,
                      content: message,
                    });
                    refetchTicket();
                    setMessage('');
                  }
                }}
              >
                <Button type='button' variant='outline' size='icon' className='flex-shrink-0'>
                  <Label
                    htmlFor='picture'
                    className='flex h-full w-full cursor-pointer items-center justify-center'
                  >
                    <Icon icon='uil:image-upload' className='h-5 w-5' />
                  </Label>
                  <Input
                    id='picture'
                    type='file'
                    className='hidden'
                    accept='image/*'
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file && file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = (e) => {
                          const img = new Image();
                          img.src = e.target?.result as string;
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');

                            const maxWidth = 300;
                            const maxHeight = 300;
                            let width = img.width;
                            let height = img.height;

                            if (width > height) {
                              if (width > maxWidth) {
                                height = Math.round((maxWidth / width) * height);
                                width = maxWidth;
                              }
                            } else {
                              if (height > maxHeight) {
                                width = Math.round((maxHeight / height) * width);
                                height = maxHeight;
                              }
                            }

                            canvas.width = width;
                            canvas.height = height;
                            ctx?.drawImage(img, 0, 0, width, height);

                            canvas.toBlob(
                              (blob) => {
                                const reader = new FileReader();
                                reader.readAsDataURL(blob!);
                                reader.onloadend = async () => {
                                  await createUserTicketFollow({
                                    ticket_id: ticketId,
                                    from: 'User',
                                    type: 2,
                                    content: reader.result as string,
                                  });
                                  refetchTicket();
                                };
                              },
                              'image/webp',
                              0.8,
                            );
                          };
                        };
                      }
                    }}
                  />
                </Button>
                <Input
                  placeholder={t('inputPlaceholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className='flex-1'
                />
                <Button type='submit' size='icon' disabled={!message} className='flex-shrink-0'>
                  <Icon icon='uil:message' className='h-5 w-5' />
                </Button>
              </form>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
