'use client';

import { ProList, ProListActions } from '@/components/pro-list';
import {
  createUserTicket,
  createUserTicketFollow,
  getUserTicketDetails,
  getUserTicketList,
  updateUserTicketStatus,
} from '@/services/user/ticket';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Textarea } from '@workspace/ui/components/textarea';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { formatDate } from '@workspace/ui/utils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import NextImage from 'next/legacy/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function TicketV4() {
  const t = useTranslations('ticket');
  const [ticketId, setTicketId] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [create, setCreate] = useState<Partial<API.CreateUserTicketRequest & { open: boolean }>>();

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

  const statusConfig = {
    1: {
      label: 'Open',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      icon: 'uil:hourglass',
    },
    2: {
      label: 'Replied',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      icon: 'uil:comment-check',
    },
    3: {
      label: 'Resolved',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      icon: 'uil:check-circle',
    },
    4: {
      label: 'Closed',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-900/30',
      icon: 'uil:times-circle',
    },
  };

  return (
    <div className='bg-background min-h-screen py-8'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'
        >
          <div>
            <h1 className='text-foreground mb-2 text-3xl font-bold'>Support Tickets</h1>
            <p className='text-muted-foreground'>Get help from our support team</p>
          </div>
          <Dialog open={create?.open} onOpenChange={(open) => setCreate({ open })}>
            <DialogTrigger asChild>
              <Button size='lg'>
                <Icon icon='uil:plus' className='mr-2 h-5 w-5' />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
                <DialogDescription>
                  Describe your issue and we'll get back to you as soon as possible.
                </DialogDescription>
              </DialogHeader>
              <div className='space-y-4 py-4'>
                <div>
                  <Label htmlFor='title'>Subject</Label>
                  <Input
                    id='title'
                    placeholder='Brief description of your issue'
                    value={create?.title || ''}
                    onChange={(e) => setCreate({ ...create, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor='content'>Description</Label>
                  <Textarea
                    id='content'
                    placeholder='Please provide as much detail as possible...'
                    value={create?.description || ''}
                    onChange={(e) => setCreate({ ...create, description: e.target.value })}
                    className='min-h-[150px]'
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant='outline' onClick={() => setCreate({ open: false })}>
                  Cancel
                </Button>
                <Button
                  disabled={!create?.title || !create?.description}
                  onClick={async () => {
                    await createUserTicket({
                      title: create!.title!,
                      description: create!.description!,
                    });
                    ref.current?.refresh();
                    toast.success('Ticket created successfully');
                    setCreate({ open: false });
                  }}
                >
                  Submit Ticket
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Tickets List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProList<API.Ticket, { status: number }>
            action={ref}
            params={[
              {
                key: 'search',
              },
              {
                key: 'status',
                placeholder: 'Filter by status',
                options: [{ label: 'Closed', value: '4' }],
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
              const status = statusConfig[item.status as keyof typeof statusConfig];

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className='mb-4'
                >
                  <Card className='overflow-hidden transition-shadow hover:shadow-md'>
                    <div className='bg-muted/30 flex items-center justify-between px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-full',
                            status.bgColor,
                          )}
                        >
                          <Icon icon={status.icon} className={cn('h-5 w-5', status.color)} />
                        </div>
                        <div>
                          <h3 className='text-foreground font-semibold'>{item.title}</h3>
                          <p className='text-muted-foreground text-sm'>
                            Updated {formatDate(item.updated_at)}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium',
                            status.bgColor,
                            status.color,
                          )}
                        >
                          {status.label}
                        </span>
                        {item.status !== 4 ? (
                          <div className='flex gap-2'>
                            <Button size='sm' onClick={() => setTicketId(item.id)}>
                              <Icon icon='uil:comment-alt-lines' className='mr-1.5 h-4 w-4' />
                              Reply
                            </Button>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={async () => {
                                await updateUserTicketStatus({ id: item.id, status: 4 });
                                toast.success('Ticket closed');
                                ref.current?.refresh();
                              }}
                            >
                              Close
                            </Button>
                          </div>
                        ) : (
                          <Button size='sm' variant='outline' onClick={() => setTicketId(item.id)}>
                            <Icon icon='uil:eye' className='mr-1.5 h-4 w-4' />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className='px-6 py-4'>
                      <p className='text-muted-foreground line-clamp-2 text-sm'>
                        {item.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            }}
            empty={
              <div className='py-12 text-center'>
                <Icon icon='uil:ticket' className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
                <p className='text-muted-foreground mb-2 text-lg font-medium'>No tickets yet</p>
                <p className='text-muted-foreground mb-4 text-sm'>
                  Create a ticket if you need help from our support team
                </p>
                <Button onClick={() => setCreate({ open: true })}>
                  <Icon icon='uil:plus' className='mr-2 h-4 w-4' />
                  Create Your First Ticket
                </Button>
              </div>
            }
          />
        </motion.div>
      </div>

      {/* Chat Interface Dialog */}
      {ticketId && (
        <Dialog open={!!ticketId} onOpenChange={(open) => !open && setTicketId(null)}>
          <DialogContent className='h-[80vh] max-w-3xl p-0'>
            <div className='flex h-full flex-col'>
              {/* Chat Header */}
              <div className='border-b px-6 py-4'>
                <DialogTitle className='flex items-center gap-3'>
                  <Icon icon='uil:ticket' className='text-primary h-6 w-6' />
                  {ticket?.title}
                </DialogTitle>
                <DialogDescription className='mt-1'>{ticket?.description}</DialogDescription>
              </div>

              {/* Messages */}
              <ScrollArea className='flex-1 p-6' ref={scrollRef}>
                <div className='space-y-4'>
                  {ticket?.follow?.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn('flex gap-3', item.from !== 'System' && 'flex-row-reverse')}
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
                      <div className={cn('max-w-[70%]', item.from !== 'System' && 'items-end')}>
                        <p className='text-muted-foreground mb-1 text-xs'>
                          {formatDate(item.created_at)}
                        </p>
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-2.5',
                            item.from === 'System'
                              ? 'bg-muted'
                              : 'bg-primary text-primary-foreground',
                          )}
                        >
                          {item.type === 1 && <p className='text-sm'>{item.content}</p>}
                          {item.type === 2 && (
                            <NextImage
                              src={item.content!}
                              width={300}
                              height={300}
                              className='!size-auto rounded-lg'
                              alt='attachment'
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              {ticket?.status !== 4 && (
                <div className='border-t p-4'>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
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
                    className='flex gap-3'
                  >
                    <Button type='button' variant='outline' size='icon'>
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
                      placeholder='Type your message...'
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className='flex-1'
                    />
                    <Button type='submit' size='icon' disabled={!message}>
                      <Icon icon='uil:message' className='h-5 w-5' />
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
