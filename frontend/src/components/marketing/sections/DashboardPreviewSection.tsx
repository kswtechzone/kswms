'use client';

import { motion } from 'framer-motion';
import { BarChart3, Users, TrendingUp, DollarSign, Activity, ArrowUpRight, Calendar, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const widgets = [
  {
    icon: DollarSign,
    label: 'Total Revenue',
    value: '$284,500',
    change: '+12.5%',
    positive: true,
    gradient: 'from-primary/5 to-primary/10',
    border: 'border-primary/10',
    iconColor: 'text-primary',
  },
  {
    icon: Users,
    label: 'Active Users',
    value: '1,847',
    change: '+8.2%',
    positive: true,
    gradient: 'from-accent/5 to-accent/10',
    border: 'border-accent/10',
    iconColor: 'text-accent',
  },
  {
    icon: Activity,
    label: 'System Health',
    value: '99.9%',
    change: 'Optimal',
    positive: true,
    gradient: 'from-green-500/5 to-green-500/10',
    border: 'border-green-500/10',
    iconColor: 'text-green-500',
  },
  {
    icon: Calendar,
    label: 'Bookings Today',
    value: '156',
    change: '+23',
    positive: true,
    gradient: 'from-blue-500/5 to-blue-500/10',
    border: 'border-blue-500/10',
    iconColor: 'text-blue-500',
  },
];

const activityLog = [
  { action: 'New booking confirmed', time: '2 min ago', type: 'booking' },
  { action: 'Invoice #INV-2024 generated', time: '15 min ago', type: 'invoice' },
  { action: 'Staff attendance synced', time: '1 hr ago', type: 'attendance' },
  { action: 'Inventory threshold alert', time: '2 hrs ago', type: 'inventory' },
  { action: 'Monthly report ready', time: '3 hrs ago', type: 'report' },
];

const teamMembers = [
  { name: 'Rajesh', role: 'Admin', color: 'bg-primary' },
  { name: 'Anita', role: 'Manager', color: 'bg-accent' },
  { name: 'Sagar', role: 'Staff', color: 'bg-green-500' },
  { name: 'Priya', role: 'Staff', color: 'bg-blue-500' },
  { name: 'Kiran', role: 'Admin', color: 'bg-purple-500' },
];

export default function DashboardPreviewSection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 bg-[var(--bg-main)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Powerful Dashboard. Real-Time Insights."
          subtitle="Get a bird&apos;s-eye view of your entire operations with our intuitive analytics dashboard."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-main)]">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="ml-4 flex gap-4 text-xs text-[var(--text-muted)]">
              <span className="text-primary font-medium">Overview</span>
              <span>Analytics</span>
              <span>Reports</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {widgets.map((w, i) => {
                const Icon = w.icon;
                return (
                  <motion.div
                    key={w.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-xl bg-gradient-to-br ${w.gradient} border ${w.border}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon size={18} className={w.iconColor} />
                      <span className={`flex items-center gap-0.5 text-xs font-medium ${w.positive ? 'text-green-500' : 'text-red-500'}`}>
                        <ArrowUpRight size={12} />
                        {w.change}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-[var(--text-main)]">{w.value}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{w.label}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-[var(--text-main)]">Revenue Trend</h4>
                  <BarChart3 size={16} className="text-[var(--text-muted)]" />
                </div>
                <div className="h-32 flex items-end gap-2">
                  {[40, 55, 45, 70, 65, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-primary to-accent opacity-80 hover:opacity-100 transition-opacity"
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-[var(--text-muted)]">
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                  <span>Dec</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[var(--text-main)]">Recent Activity</h4>
                  <Activity size={16} className="text-[var(--text-muted)]" />
                </div>
                <div className="space-y-2">
                  {activityLog.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-main)] transition-colors"
                    >
                      <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                      <span className="text-sm text-[var(--text-main)] flex-1">{log.action}</span>
                      <span className="text-xs text-[var(--text-muted)] shrink-0">{log.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--text-muted)]">Team Online:</span>
                <div className="flex -space-x-2">
                  {teamMembers.map((member, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-white text-xs font-medium border-2 border-[var(--bg-card)]`}
                      title={`${member.name} - ${member.role}`}
                    >
                      {member.name[0]}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-green-500" />
                <span className="text-sm font-medium text-green-500">+12% this week</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
