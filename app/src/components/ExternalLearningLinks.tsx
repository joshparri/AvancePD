'use client';

import { useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ExternalLearningResource,
  getMatchedExternalResources,
  getResourceCaveatLabel,
} from '@/data/externalLearningResources';

type ExternalLearningLinksProps = {
  domain?: string;
  skill?: string;
  activityTitle?: string;
  limit?: number;
  compact?: boolean;
  heading?: string;
};

const costModelLabel: Record<ExternalLearningResource['costModel'], string> = {
  free: 'Free',
  'free-audit': 'Free audit',
  'free-preview': 'Free preview',
  'free-with-paid-certificate': 'Free learning',
  unknown: 'Cost unknown',
};

export function ExternalLearningLinks({
  domain,
  skill,
  activityTitle,
  limit = 3,
  compact = false,
  heading = 'Go deeper with free learning',
}: ExternalLearningLinksProps) {
  const resources = useMemo(
    () =>
      getMatchedExternalResources({
        domain,
        skill,
        activity: activityTitle,
        limit,
      }),
    [activityTitle, domain, limit, skill]
  );

  if (resources.length === 0) return null;

  return (
    <Card className={compact ? 'border-dashed' : ''}>
      <CardHeader className={compact ? 'pb-3' : undefined}>
        <CardTitle className="text-base">{heading}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {resources.map((resource) => {
          const caveat = getResourceCaveatLabel(resource);
          return (
            <div key={resource.id} className="rounded-lg border p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{resource.title}</p>
                  <p className="text-xs text-muted-foreground">{resource.provider}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">{resource.level}</Badge>
                  <Badge variant="secondary">{costModelLabel[resource.costModel]}</Badge>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{resource.whyItHelps}</p>
              {caveat && <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{caveat}</p>}
              <Button asChild size="sm" variant="outline" className="mt-3">
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  Open course
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
