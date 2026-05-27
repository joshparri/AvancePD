'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import {
  Home,
  Calendar,
  Target,
  ClipboardList,
  ClipboardCheck,
  Archive,
  Map,
  Brain,
  Lightbulb,
  NotebookText,
  Wrench,
  HeartPulse,
  BookOpen
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Shifts', href: '/shifts', icon: Calendar },
  { name: 'Work Logs', href: '/work-logs', icon: NotebookText },
  { name: 'MSP Skills', href: '/msp-skills', icon: Target },
  { name: 'MSP Scenarios', href: '/msp-scenarios', icon: ClipboardList },
  { name: 'MSP Quiz', href: '/msp-quiz', icon: Brain },
  { name: 'Learning Cockpit', href: '/learning-cockpit', icon: Lightbulb },
  { name: 'Tool Primers', href: '/tool-primers', icon: Wrench },
  { name: 'Ticket Notes', href: '/ticket-notes', icon: ClipboardCheck },
  { name: 'Evidence Pack', href: '/evidence-pack', icon: Archive },
  { name: 'KB Learning Machine', href: '/kb-learning-machine', icon: BookOpen },
  { name: 'Health & Outdoors', href: '/health-outdoors', icon: HeartPulse },
  { name: 'MSP Roadmap', href: '/msp-roadmap', icon: Map },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex min-w-0 flex-1">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                <span className="text-blue-600 dark:text-blue-400">Avance</span> Academy
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-1 sm:overflow-x-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="ml-3 flex shrink-0 items-center border-l border-slate-200 pl-3 dark:border-slate-700">
            <DarkModeToggle showLabel />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                  isActive
                    ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-300'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:hover:text-gray-300'
                )}
              >
                <div className="flex items-center">
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
