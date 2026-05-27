'use client';

import Link from 'next/link';
import {
  Archive,
  BookOpen,
  Brain,
  ClipboardList,
  Gamepad2,
  Lightbulb,
  Map,
  Target,
} from 'lucide-react';

const links = [
  { href: '/learning-cockpit', label: 'Learning Cockpit', icon: Lightbulb },
  { href: '/avance-game', label: 'AvanceGame', icon: Gamepad2 },
  { href: '/kb-learning-machine', label: 'KB Machine', icon: BookOpen },
  { href: '/msp-scenarios', label: 'Scenarios', icon: ClipboardList },
  { href: '/msp-quiz', label: 'Quiz', icon: Brain },
  { href: '/msp-skills', label: 'Skills', icon: Target },
  { href: '/evidence-pack', label: 'Evidence', icon: Archive },
  { href: '/msp-roadmap', label: 'Roadmap', icon: Map },
] as const;

export function PdQuickLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-blue-800 dark:hover:text-blue-300"
        >
          <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
          {label}
        </Link>
      ))}
    </div>
  );
}
