'use client';

import { motion } from 'framer-motion';

const links = {
  Product: ['Platform', 'Models', 'API', 'Pricing', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Developers: ['Docs', 'SDKs', 'Examples', 'Community', 'Status'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#020408] overflow-hidden">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-sky-400 to-violet-600 opacity-80" />
                <div className="absolute inset-0.5 rounded-md bg-[#020408] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-sky-400 to-violet-500" />
                </div>
              </div>
              <span className="text-white font-semibold">
                Nexus<span className="text-sky-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed mb-6">
              The AI platform for the next generation of builders.
            </p>
            <div className="flex gap-3">
              {['𝕏', '⚡', '◉'].map((icon, i) => (
                <div
                  key={i}
                  className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-white cursor-pointer transition-colors border border-white/5 hover:border-white/15 text-sm"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-white/30 hover:text-white/70 transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs text-white/20">
            © 2026 NexusAI, Inc. All rights reserved.
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px #4ade80' }} />
            <span className="text-xs text-white/20">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
