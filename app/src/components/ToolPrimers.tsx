'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, BookOpenText, ChevronDown, Image as ImageIcon, Sparkles, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toolPrimers, type ToolPrimer, type ToolPrimerPriority } from '@/data/toolPrimers';

const priorityStyles: Record<ToolPrimerPriority, string> = {
  high: 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-200',
  medium: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-200',
  low: 'border-slate-400/50 bg-slate-500/10 text-slate-700 dark:text-slate-200',
};

function PrimerPriorityBadge({ priority }: { priority: ToolPrimerPriority }) {
  return (
    <span className={cn('rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide', priorityStyles[priority])}>
      {priority} priority
    </span>
  );
}

function PrimerMeta({ primer }: { primer: ToolPrimer }) {
  const hasMeta = primer.toolUsed || primer.createdBy;

  if (!hasMeta) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
      {primer.toolUsed && (
        <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-1">
          Tool: {primer.toolUsed}
        </span>
      )}
      {primer.createdBy && (
        <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-1">
          Created by: {primer.createdBy}
        </span>
      )}
    </div>
  );
}

function PrimerPanel({ primer, isOpen, onToggle }: { primer: ToolPrimer; isOpen: boolean; onToggle: () => void }) {
  const isCreative = primer.priority === 'low';

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:hover:bg-slate-900"
        aria-expanded={isOpen}
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {isCreative ? (
              <Sparkles className="h-5 w-5 text-cyan-500" />
            ) : (
              <Wrench className="h-5 w-5 text-cyan-500" />
            )}
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{primer.title}</h2>
            <PrimerPriorityBadge priority={primer.priority} />
          </div>
          <p className="max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">{primer.description}</p>
          <div className="flex flex-wrap gap-2">
            {primer.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <ChevronDown className={cn('mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="border-t border-slate-200 px-5 py-5 dark:border-slate-800">
          <div className="mb-4">
            <PrimerMeta primer={primer} />
          </div>
          <div className="space-y-5">
            {primer.sections.map((section) => (
              <div key={section.title} className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
                  <BookOpenText className="h-4 w-4 text-cyan-500" />
                  {section.title}
                </h3>
                {section.body && (
                  <p className="mb-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{section.body}</p>
                )}
                {section.warning && (
                  <div className="mb-3 flex gap-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-100">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{section.warning}</p>
                  </div>
                )}
                {section.steps && (
                  <ol className="space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {section.steps.map((step, index) => (
                      <li key={step} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-slate-950">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
                {section.keyOutputs && (
                  <ul className="space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {section.keyOutputs.map((output) => (
                      <li key={output} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                        <span>{output}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.screenshots && (
                  <div className="mt-3 space-y-2">
                    {section.screenshots.map((screenshot) => (
                      <div
                        key={screenshot}
                        className="flex items-center gap-3 rounded-md border border-dashed border-cyan-500/50 bg-cyan-500/10 px-3 py-3 text-sm text-slate-700 dark:text-slate-200"
                      >
                        <ImageIcon className="h-4 w-4 text-cyan-500" />
                        <span>{screenshot}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export function ToolPrimers() {
  const [openPrimerId, setOpenPrimerId] = useState<string>('windows-rdp-remoteapps');

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        <Card className="mb-6 overflow-hidden border-slate-800 bg-slate-950 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Wrench className="h-6 w-6 text-cyan-400" />
              Tool Primers & How-Tos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="max-w-3xl text-sm leading-6 text-slate-300">
              Quick, local-first reference notes for recurring support workflows. High-impact operational primers stay at the top, while creative or exploratory research remains clearly marked as low priority.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {toolPrimers.map((primer) => (
            <PrimerPanel
              key={primer.id}
              primer={primer}
              isOpen={openPrimerId === primer.id}
              onToggle={() => setOpenPrimerId((current) => (current === primer.id ? '' : primer.id))}
            />
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-slate-700 dark:text-slate-200">
          <p className="font-medium">Privacy note</p>
          <p className="mt-1">
            These primers are manually maintained knowledge notes. They do not connect to HaloPSA, Datto RMM, RDG infrastructure, or any client system.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-3 border-cyan-500/50">
            <Link href="/">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
