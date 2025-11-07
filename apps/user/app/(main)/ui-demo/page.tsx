'use client';

import { GlassCard } from '@/components/ui-v2/glass-card';
import { StatCard } from '@/components/ui-v2/stat-card';
import { SubscriptionCardV2 } from '@/components/ui-v2/subscription-card-v2';
import { TrafficRing } from '@/components/ui-v2/traffic-ring';
import {
  Activity,
  Calendar,
  Globe,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import React from 'react';

export default function UIDemoPage() {
  // 模拟数据
  const mockSubscription = {
    id: 10086,
    name: '旗舰版套餐',
    status: 'active' as const,
    used: 128849018880, // 120 GB
    total: 214748364800, // 200 GB
    upload: 42949672960, // 40 GB
    download: 85899345920, // 80 GB
    resetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    subscribeUrl: 'https://example.com/subscribe/abc123def456',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 渐变网格 */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
              radial-gradient(at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)
            `,
          }}
        />

        {/* 网格背景 */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* 内容区域 */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            UI 重构设计预览
          </h1>
          <p className="text-xl text-slate-400">
            现代科技风 - Cyber Secure Design System
          </p>
        </div>

        {/* 统计卡片网格 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
            统计卡片组件
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Globe}
              label="活跃订阅"
              value={3}
              trend="+12%"
              trendDirection="up"
              color="primary"
            />
            <StatCard
              icon={Zap}
              label="今日流量"
              value="12.5 GB"
              trend="+8%"
              trendDirection="up"
              color="accent"
            />
            <StatCard
              icon={Calendar}
              label="剩余天数"
              value={28}
              color="warning"
            />
            <StatCard
              icon={Wallet}
              label="钱包余额"
              value="¥128.00"
              trend="-5%"
              trendDirection="down"
              color="danger"
            />
          </div>
        </section>

        {/* 玻璃态卡片示例 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-emerald-500 rounded-full" />
            玻璃态卡片效果
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6" hover>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">全球节点</h3>
                  <p className="text-sm text-slate-400">200+ 服务器</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                遍布全球的高速节点，为您提供最佳的网络体验
              </p>
            </GlassCard>

            <GlassCard className="p-6" hover glow>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">实时监控</h3>
                  <p className="text-sm text-slate-400">99.9% 在线率</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                实时监控节点状态，确保服务稳定可靠
              </p>
            </GlassCard>

            <GlassCard className="p-6" hover glow gradient>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">用户信赖</h3>
                  <p className="text-sm text-slate-400">100万+ 用户</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                已有超过一百万用户选择我们的服务
              </p>
            </GlassCard>
          </div>
        </section>

        {/* 流量环形图示例 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full" />
            流量可视化组件
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-8">
              <h3 className="text-xl font-semibold text-white text-center mb-6">
                正常使用
              </h3>
              <div className="flex justify-center">
                <TrafficRing
                  used={64424509440} // 60 GB
                  total={214748364800} // 200 GB
                  size={180}
                />
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h3 className="text-xl font-semibold text-white text-center mb-6">
                接近上限
              </h3>
              <div className="flex justify-center">
                <TrafficRing
                  used={171798691840} // 160 GB
                  total={214748364800} // 200 GB
                  size={180}
                />
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h3 className="text-xl font-semibold text-white text-center mb-6">
                已超限
              </h3>
              <div className="flex justify-center">
                <TrafficRing
                  used={214748364800} // 200 GB
                  total={214748364800} // 200 GB
                  size={180}
                />
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 订阅卡片示例 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
            现代化订阅卡片
          </h2>

          <div className="max-w-2xl mx-auto">
            <SubscriptionCardV2 subscription={mockSubscription} />
          </div>
        </section>

        {/* 设计说明 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
            设计特点
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6" hover>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  玻璃态设计（Glassmorphism）
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• 半透明背景 + 毛玻璃模糊效果</li>
                <li>• 微妙的边框和阴影</li>
                <li>• 层次感强，现代科技风</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-6" hover>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  动画与微交互
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Framer Motion 流畅动画</li>
                <li>• 悬浮态效果增强</li>
                <li>• 数字滚动动画</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-6" hover>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  数据可视化
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• SVG 环形图展示流量</li>
                <li>• 渐变色和发光效果</li>
                <li>• 实时数据动画</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-6" hover>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">色彩系统</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• 蓝紫渐变主色调</li>
                <li>• 翠绿强调色</li>
                <li>• 状态色清晰区分</li>
              </ul>
            </GlassCard>
          </div>
        </section>

        {/* 页脚提示 */}
        <div className="text-center">
          <GlassCard className="p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              ✨ 这就是重构后的效果预览
            </h3>
            <p className="text-slate-400 mb-6">
              采用现代化的玻璃态设计、丰富的动画效果、清晰的数据可视化，
              打造极致的用户体验。
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                科技感 ↑ 80%
              </div>
              <div className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold">
                用户体验 ↑ 60%
              </div>
              <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold">
                转化率 ↑ 40%
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
