'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 142, suffix: 'K+', label: 'Requests / Second', description: 'Peak throughput', color: '#0ea5e9' },
  { value: 99.97, suffix: '%', label: 'Uptime SLA', description: '12-month rolling average', color: '#10b981', decimal: true },
  { value: 2.1, suffix: 'ms', label: 'Median Latency', description: 'Global p50', color: '#8b5cf6', decimal: true },
  { value: 4800, suffix: '+', label: 'Enterprise Clients', description: 'In 89 countries', color: '#ec4899' },
];

const graphData = [28, 45, 35, 60, 48, 72, 55, 88, 65, 92, 78, 100];

function AnimatedCounter({ value, suffix, decimal, color, inView }: {
  value: number;
  suffix: string;
  decimal?: boolean;
  color: string;
  inView: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, value);
      setDisplay(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span style={{ color }}>
      {decimal ? display.toFixed(decimal && value < 10 ? 1 : 2) : Math.round(display).toLocaleString()}
      {suffix}
    </span>
  );
}

function MiniGraph({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const height = 60;
  const width = 200;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - (v / max) * height,
  }));

  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = points[i - 1];
    const cpX = (prev.x + point.x) / 2;
    return `${acc} C ${cpX},${prev.y} ${cpX},${point.y} ${point.x},${point.y}`;
  }, '');

  const fillD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-12 overflow-visible">
      <defs>
        <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#fill-${color.replace('#', '')})`} />
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="3"
        fill={color}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      />
    </svg>
  );
}

export default function MetricsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="metrics" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#0a1628_0%,#020408_60%)]" />

      {/* Horizontal light line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6" ref={sectionRef}>
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 border border-pink-500/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
            <span className="text-xs text-pink-300 font-medium tracking-wide uppercase">By the Numbers</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="display-lg text-white mb-4"
          >
            Numbers that
            <br />
            <span className="gradient-text">don&apos;t lie.</span>
          </motion.h2>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors"
            >
              {/* Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${stat.color}08, transparent 60%)` }}
              />

              <div className="relative z-10">
                <div className="text-4xl font-black font-mono mb-1 tabular-nums">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimal={stat.decimal}
                    color={stat.color}
                    inView={isInView}
                  />
                </div>
                <div className="text-sm font-semibold text-white/70 mb-1">{stat.label}</div>
                <div className="text-xs text-white/25">{stat.description}</div>

                {/* Mini sparkline */}
                <div className="mt-4">
                  <MiniGraph
                    data={graphData.map(v => v * (0.8 + Math.random() * 0.4))}
                    color={stat.color}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dashboard visualization */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden"
          style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-base font-semibold text-white">System Performance</h3>
              <p className="text-sm text-white/30 mt-0.5">Real-time global telemetry</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 8px #4ade80' }} />
              <span className="text-xs text-green-400 font-medium">All systems operational</span>
            </div>
          </div>

          {/* Bars chart */}
          <div className="flex items-end gap-2 h-32 mb-4">
            {graphData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded-t-sm relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to top, #0ea5e9, #8b5cf6)`,
                    opacity: 0.7 + (v / 100) * 0.3,
                  }}
                  initial={{ height: 0 }}
                  animate={isInView ? { height: `${v}%` } : { height: 0 }}
                  transition={{ duration: 1, delay: 0.8 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/20">Jan</span>
            <span className="text-xs text-white/20">Jun</span>
            <span className="text-xs text-white/20">Dec</span>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)', filter: 'blur(40px)' }} />
        </motion.div>
      </div>
    </section>
  );
}
