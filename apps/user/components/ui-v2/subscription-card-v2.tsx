'use client';

import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Icon } from '@workspace/ui/custom-components/icon';
import { cn } from '@workspace/ui/lib/utils';
import { formatDate } from '@workspace/ui/utils';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { QRCodeCanvas } from 'qrcode.react';
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
    <GlassCard className="p-8 group" hover glow gradient>
      {/* 顶部渐变条 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* 头部：套餐名 + 状态 */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">{subscription.name}</h3>
          <p className="text-sm text-slate-400">订阅ID: #{subscription.id}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border',
            status.color
          )}
        >
          <div className={cn('w-2 h-2 rounded-full animate-pulse', status.dotColor)} />
          {status.label}
        </motion.div>
      </div>

      <Separator className="mb-6 bg-white/10" />

      {/* 流量环形图 */}
      <div className="flex justify-center mb-6">
        <TrafficRing
          used={subscription.used}
          total={subscription.total}
          size={200}
          animate
        />
      </div>

      {/* 流量详情 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <DetailItem
          icon="ArrowUp"
          label="上传"
          value={formatBytes(subscription.upload)}
          color="text-blue-400"
        />
        <DetailItem
          icon="ArrowDown"
          label="下载"
          value={formatBytes(subscription.download)}
          color="text-purple-400"
        />
        <DetailItem
          icon="Activity"
          label="总计"
          value={formatBytes(subscription.used)}
          color="text-emerald-400"
        />
      </div>

      <Separator className="mb-6 bg-white/10" />

      {/* 时间信息 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <TimeInfoItem
          icon="RotateCcw"
          label="流量重置"
          value={formatDate(new Date(subscription.resetDate))}
        />
        <TimeInfoItem
          icon="Calendar"
          label="到期时间"
          value={formatDate(new Date(subscription.expiryDate))}
        />
      </div>

      <Separator className="mb-6 bg-white/10" />

      {/* 订阅链接区域 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/5">
          <TabsTrigger value="general">通用订阅</TabsTrigger>
          <TabsTrigger value="apps">应用导入</TabsTrigger>
          <TabsTrigger value="qrcode">二维码</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-3">
          {protocols.map((protocol) => (
            <ProtocolLink
              key={protocol}
              protocol={protocol}
              url={subscription.subscribeUrl}
              onCopy={handleCopy}
            />
          ))}
        </TabsContent>

        <TabsContent value="apps" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {platforms.map((platform) => (
              <PlatformButton key={platform.name} platform={platform} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="qrcode" className="mt-4">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="p-4 bg-white rounded-xl">
              <QRCodeCanvas value={subscription.subscribeUrl} size={180} />
            </div>
            <p className="text-sm text-slate-400 text-center">
              使用客户端扫描二维码导入订阅
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* 操作按钮 */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-white/5 border-white/10 hover:bg-white/10"
        >
          <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
          重置 Token
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-white/5 border-white/10 hover:bg-white/10"
        >
          <Icon name="Zap" className="w-4 h-4 mr-2" />
          重置流量
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400"
        >
          <Icon name="RotateCcw" className="w-4 h-4 mr-2" />
          续费
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400"
        >
          <Icon name="XCircle" className="w-4 h-4 mr-2" />
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
      className="flex flex-col items-center text-center"
    >
      <Icon name={icon} className={cn('w-5 h-5 mb-2', color)} />
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </motion.div>
  );
}

// 时间信息项
function TimeInfoItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
      <Icon name={icon} className="w-5 h-5 text-slate-400" />
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
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
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
      <div className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
        <span className="text-xs font-mono text-indigo-400">{protocol}</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm text-slate-400 truncate">{url}</p>
      </div>
      <CopyToClipboard text={url} onCopy={() => onCopy(url)}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-white/10"
        >
          <Icon name="Copy" className="w-4 h-4" />
        </Button>
      </CopyToClipboard>
    </div>
  );
}

// 平台按钮组件
function PlatformButton({
  platform,
}: {
  platform: { name: string; icon: string; url: string };
}) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-3 bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-500/30"
    >
      <Icon name={platform.icon} className="w-5 h-5" />
      <span>{platform.name}</span>
    </Button>
  );
}
