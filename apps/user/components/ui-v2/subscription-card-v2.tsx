'use client';

import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { formatDate } from '@workspace/ui/utils';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'sonner';
import { GlassCard } from './glass-card';
import { TrafficRing, formatBytes } from './traffic-ring';

interface SubscriptionCardV2Props {
  subscription: {
    id: number;
    name: string;
    status: 'active' | 'expiring' | 'expired';
    used: number;
    total: number;
    upload: number;
    download: number;
    resetDate: string;
    expiryDate: string;
    subscribeUrl: string;
  };
  protocols?: string[];
  platforms?: Array<{
    name: string;
    icon: string;
    url: string;
  }>;
}

export function SubscriptionCardV2({
  subscription,
  protocols = ['Clash', 'V2Ray', 'Shadowrocket'],
  platforms = [
    { name: 'Windows', icon: 'Laptop', url: '#' },
    { name: 'macOS', icon: 'Apple', url: '#' },
    { name: 'iOS', icon: 'Smartphone', url: '#' },
    { name: 'Android', icon: 'Tablet', url: '#' },
  ],
}: SubscriptionCardV2Props) {
  const [activeTab, setActiveTab] = useState('general');

  const statusConfig = {
    active: {
      label: '活跃',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      dotColor: 'bg-emerald-400',
    },
    expiring: {
      label: '即将到期',
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      dotColor: 'bg-orange-400',
    },
    expired: {
      label: '已过期',
      color: 'bg-red-500/10 text-red-400 border-red-500/20',
      dotColor: 'bg-red-400',
    },
  };

  const status = statusConfig[subscription.status];

  const handleCopy = (text: string) => {
    toast.success('已复制到剪贴板');
  };

  return (
    <GlassCard className='group p-8' hover glow gradient>
      {/* 顶部渐变条 */}
      <div className='absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

      {/* 头部：套餐名 + 状态 */}
      <div className='mb-6 flex items-start justify-between'>
        <div>
          <h3 className='mb-1 text-2xl font-bold text-white'>{subscription.name}</h3>
          <p className='text-sm text-slate-400'>订阅ID: #{subscription.id}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold',
            status.color,
          )}
        >
          <div className={cn('h-2 w-2 animate-pulse rounded-full', status.dotColor)} />
          {status.label}
        </motion.div>
      </div>

      <Separator className='mb-6 bg-white/10' />

      {/* 流量环形图 */}
      <div className='mb-6 flex justify-center'>
        <TrafficRing used={subscription.used} total={subscription.total} size={200} animate />
      </div>

      {/* 流量详情 */}
      <div className='mb-6 grid grid-cols-3 gap-4'>
        <DetailItem
          icon='uil:arrow-up'
          label='上传'
          value={formatBytes(subscription.upload)}
          color='text-blue-400'
        />
        <DetailItem
          icon='uil:arrow-down'
          label='下载'
          value={formatBytes(subscription.download)}
          color='text-purple-400'
        />
        <DetailItem
          icon='uil:chart'
          label='总计'
          value={formatBytes(subscription.used)}
          color='text-emerald-400'
        />
      </div>

      <Separator className='mb-6 bg-white/10' />

      {/* 时间信息 */}
      <div className='mb-6 grid grid-cols-2 gap-4'>
        <TimeInfoItem
          icon='uil:refresh'
          label='流量重置'
          value={formatDate(new Date(subscription.resetDate)) || '未知'}
        />
        <TimeInfoItem
          icon='uil:calendar-alt'
          label='到期时间'
          value={formatDate(new Date(subscription.expiryDate)) || '未知'}
        />
      </div>

      <Separator className='mb-6 bg-white/10' />

      {/* 订阅链接区域 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='mb-6'>
        <TabsList className='grid w-full grid-cols-3 bg-white/5'>
          <TabsTrigger value='general'>通用订阅</TabsTrigger>
          <TabsTrigger value='apps'>应用导入</TabsTrigger>
          <TabsTrigger value='qrcode'>二维码</TabsTrigger>
        </TabsList>

        <TabsContent value='general' className='mt-4 space-y-3'>
          {protocols.map((protocol) => (
            <ProtocolLink
              key={protocol}
              protocol={protocol}
              url={subscription.subscribeUrl}
              onCopy={handleCopy}
            />
          ))}
        </TabsContent>

        <TabsContent value='apps' className='mt-4'>
          <div className='grid grid-cols-2 gap-3'>
            {platforms.map((platform) => (
              <PlatformButton key={platform.name} platform={platform} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value='qrcode' className='mt-4'>
          <div className='flex flex-col items-center gap-4 py-4'>
            <div className='rounded-xl bg-white p-4'>
              <QRCodeCanvas value={subscription.subscribeUrl} size={180} />
            </div>
            <p className='text-center text-sm text-slate-400'>使用客户端扫描二维码导入订阅</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* 操作按钮 */}
      <div className='grid grid-cols-2 gap-3'>
        <Button
          variant='outline'
          size='sm'
          className='w-full border-white/10 bg-white/5 hover:bg-white/10'
        >
          <Icon icon='uil:sync' className='mr-2 h-4 w-4' />
          重置 Token
        </Button>
        <Button
          variant='outline'
          size='sm'
          className='w-full border-white/10 bg-white/5 hover:bg-white/10'
        >
          <Icon icon='uil:bolt' className='mr-2 h-4 w-4' />
          重置流量
        </Button>
        <Button
          variant='outline'
          size='sm'
          className='w-full border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
        >
          <Icon icon='uil:refresh' className='mr-2 h-4 w-4' />
          续费
        </Button>
        <Button
          variant='outline'
          size='sm'
          className='w-full border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20'
        >
          <Icon icon='uil:times-circle' className='mr-2 h-4 w-4' />
          取消订阅
        </Button>
      </div>
    </GlassCard>
  );
}

// 详情项组件
function DetailItem({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='flex flex-col items-center text-center'
    >
      <Icon icon={icon} className={cn('mb-2 h-5 w-5', color)} />
      <p className='mb-1 text-xs text-slate-400'>{label}</p>
      <p className='text-sm font-semibold text-white'>{value}</p>
    </motion.div>
  );
}

// 时间信息项
function TimeInfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className='flex items-center gap-3 rounded-lg bg-white/5 p-3'>
      <Icon icon={icon} className='h-5 w-5 text-slate-400' />
      <div>
        <p className='text-xs text-slate-400'>{label}</p>
        <p className='text-sm font-medium text-white'>{value}</p>
      </div>
    </div>
  );
}

// 协议链接组件
function ProtocolLink({
  protocol,
  url,
  onCopy,
}: {
  protocol: string;
  url: string;
  onCopy: (text: string) => void;
}) {
  return (
    <div className='flex items-center gap-3 rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10'>
      <div className='rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-1'>
        <span className='font-mono text-xs text-indigo-400'>{protocol}</span>
      </div>
      <div className='flex-1 overflow-hidden'>
        <p className='truncate text-sm text-slate-400'>{url}</p>
      </div>
      <CopyToClipboard text={url} onCopy={() => onCopy(url)}>
        <Button variant='ghost' size='sm' className='h-8 w-8 p-0 hover:bg-white/10'>
          <Icon icon='uil:copy' className='h-4 w-4' />
        </Button>
      </CopyToClipboard>
    </div>
  );
}

// 平台按钮组件
function PlatformButton({ platform }: { platform: { name: string; icon: string; url: string } }) {
  return (
    <Button
      variant='outline'
      className='w-full justify-start gap-3 border-white/10 bg-white/5 hover:border-indigo-500/30 hover:bg-white/10'
    >
      <Icon icon={platform.icon} className='h-5 w-5' />
      <span>{platform.name}</span>
    </Button>
  );
}
