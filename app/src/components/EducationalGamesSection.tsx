'use client';

import {
  ArrowUpRight,
  Brain,
  Calculator,
  Gamepad2,
  Globe,
  GraduationCap,
  MapPin,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SectionHeader } from '@/components/academy';
import { LearningIllustration } from '@/components/learning/LearningIllustration';
import {
  educationalGamePlatforms,
  type EducationalGameCategory,
} from '@/data/educationalGamePlatforms';

const categoryIcons: Record<EducationalGameCategory, LucideIcon> = {
  language: Globe,
  geography: MapPin,
  'math-logic': Calculator,
  'brain-training': Brain,
  academics: GraduationCap,
};

export function EducationalGamesSection() {
  return (
    <section className="space-y-4 border-t border-slate-200/80 pt-8 dark:border-slate-800">
      <SectionHeader
        icon={Gamepad2}
        title="Educational games & brain breaks"
        description="Optional off-shift platforms that blend learning with gameplay. These are third-party sites—use on personal time, not for client work."
      />

      <div className="academy-surface-muted flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
        <LearningIllustration variant="external-learning" size="sm" decorative />
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          Top free options for adults: language drills, geography deduction, logic puzzles, brain workouts,
          and academic practice. Open a platform below when you want structured play instead of passive scrolling.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {educationalGamePlatforms.map((platform) => {
          const CategoryIcon = categoryIcons[platform.category];

          return (
            <Card
              key={platform.id}
              className="flex h-full flex-col border-slate-200/80 transition hover:border-blue-200/80 hover:shadow-md dark:border-slate-800 dark:hover:border-blue-900/50"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                      <CategoryIcon className="h-4 w-4" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{platform.name}</h3>
                      <p className="text-xs text-muted-foreground">{platform.provider}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {platform.categoryLabel}
                  </Badge>
                </div>
                <p className="mt-3 text-sm font-medium text-blue-700 dark:text-blue-300">{platform.tagline}</p>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-3 pt-0">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{platform.description}</p>

                <div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">How it plays</p>
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    {platform.gameplayHighlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2">
                        <span className="text-blue-500" aria-hidden>
                          •
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Best for: </span>
                  {platform.bestFor}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {platform.platforms.map((p) => (
                    <Badge key={p} variant="secondary" className="text-[10px]">
                      {p}
                    </Badge>
                  ))}
                </div>

                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">{platform.costNote}</p>
                {platform.caution && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-300">{platform.caution}</p>
                )}

                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  <Button asChild size="sm" className="flex-1 sm:flex-none">
                    <a href={platform.url} target="_blank" rel="noopener noreferrer">
                      Play on {platform.name}
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-muted-foreground">
        Avance PD links out only—games run on each provider&apos;s site. Check their terms, privacy, and workplace policies before signing in.
      </p>
    </section>
  );
}
