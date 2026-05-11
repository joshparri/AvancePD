'use client';

import { useMemo, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mspSkillCategories, mspSkills, MspReadiness, MspSkillLevel } from '@/data/mspSkills';
import {
  getStoredSkillReadiness,
  mergeSkillsWithProgress,
  mspReadinessOptions,
  MspSkillReadinessById,
  setStoredSkillReadiness,
} from '@/lib/mspProgress';
import { Search, Target, TrendingUp } from 'lucide-react';

const readinessLabels: Record<MspReadiness, string> = {
  unseen: 'Unseen',
  learning: 'Learning',
  practised: 'Practised',
  'work-ready': 'Work-ready',
  'evidence-proven': 'Evidence-proven',
};

const readinessClasses: Record<MspReadiness, string> = {
  unseen: 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200',
  learning: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
  practised:
    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
  'work-ready':
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  'evidence-proven':
    'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-200',
};

const levelClasses: Record<MspSkillLevel, string> = {
  beginner: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
  intermediate:
    'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200',
  advanced: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
};

const readinessPriority: Record<MspReadiness, number> = {
  unseen: 0,
  learning: 1,
  practised: 2,
  'work-ready': 3,
  'evidence-proven': 4,
};

export default function MspSkillsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [skillReadiness, setSkillReadiness] = useState<MspSkillReadinessById>(() =>
    getStoredSkillReadiness()
  );

  const skillsWithProgress = useMemo(
    () => mergeSkillsWithProgress(mspSkills, skillReadiness),
    [skillReadiness]
  );

  const filteredSkills = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return skillsWithProgress.filter((skill) => {
      const matchesCategory = category === 'all' || skill.category === category;
      const matchesLevel = level === 'all' || skill.level === level;
      const searchable = [
        skill.title,
        skill.category,
        skill.description,
        ...skill.practicalExamples,
        ...skill.relatedTools,
        ...skill.evidenceExamples,
        ...skill.suggestedPractice,
      ]
        .join(' ')
        .toLowerCase();

      return matchesCategory && matchesLevel && (!searchTerm || searchable.includes(searchTerm));
    });
  }, [category, level, search, skillsWithProgress]);

  const categoryCounts = useMemo(
    () =>
      mspSkillCategories.map((skillCategory) => ({
        category: skillCategory,
        total: skillsWithProgress.filter((skill) => skill.category === skillCategory).length,
        developing: skillsWithProgress.filter(
          (skill) =>
            skill.category === skillCategory &&
            (skill.readiness === 'unseen' || skill.readiness === 'learning')
        ).length,
      })),
    [skillsWithProgress]
  );

  const practiseNext = useMemo(
    () =>
      [...skillsWithProgress]
        .sort((a, b) => readinessPriority[a.readiness] - readinessPriority[b.readiness])
        .slice(0, 5),
    [skillsWithProgress]
  );

  const workReadyCount = skillsWithProgress.filter(
    (skill) => skill.readiness === 'work-ready' || skill.readiness === 'evidence-proven'
  ).length;
  const earlySkillsCount = skillsWithProgress.filter(
    (skill) => skill.readiness === 'unseen' || skill.readiness === 'learning'
  ).length;

  const handleReadinessChange = (skillId: string, readiness: MspReadiness) => {
    setSkillReadiness(setStoredSkillReadiness(skillId, readiness));
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MSP Skills Matrix</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl">
                A practical map of MSP skills that turn support into calm, safe, evidence-backed work. Search by skill name, tool, or practice. Use readiness levels to spot gaps. Plan your next study area based on what needs focus.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Total skills</p>
                  <p className="text-2xl font-bold">{skillsWithProgress.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Need focus</p>
                  <p className="text-2xl font-bold">{earlySkillsCount}</p>
                </CardContent>
              </Card>
              <Card className="col-span-2 sm:col-span-1">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Work-ready+</p>
                  <p className="text-2xl font-bold">{workReadyCount}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Search className="h-5 w-5" />
                    Search and filter
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-2">Find skills by name, category, level, or related tools. Results show readiness status and next practice step.</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_180px]">
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Skill name, tool, or practice..."
                      aria-label="Search skills"
                    />
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                      aria-label="Filter by category"
                    >
                      <option value="all">All categories</option>
                      {mspSkillCategories.map((skillCategory) => (
                        <option key={skillCategory} value={skillCategory}>
                          {skillCategory}
                        </option>
                      ))}
                    </select>
                    <select
                      value={level}
                      onChange={(event) => setLevel(event.target.value)}
                      className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                      aria-label="Filter by level"
                    >
                      <option value="all">All levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredSkills.map((skill) => (
                  <Card key={skill.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-lg leading-snug">{skill.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{skill.category}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={levelClasses[skill.level]}>
                            {skill.level}
                          </Badge>
                          <Badge variant="outline" className={readinessClasses[skill.readiness]}>
                            {readinessLabels[skill.readiness]}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{skill.description}</p>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Suggested practice
                        </h3>
                        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                          {skill.suggestedPractice.map((practice) => (
                            <li key={practice}>- {practice}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Evidence examples
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {skill.evidenceExamples.map((evidence) => (
                            <Badge key={evidence} variant="outline">
                              {evidence}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Tools</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{skill.relatedTools.join(', ')}</p>
                      </div>

                      <div>
                        <label
                          htmlFor={`readiness-${skill.id}`}
                          className="text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          Current readiness
                        </label>
                        <select
                          id={`readiness-${skill.id}`}
                          value={skill.readiness}
                          onChange={(event) =>
                            handleReadinessChange(skill.id, event.target.value as MspReadiness)
                          }
                          className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        >
                          {mspReadinessOptions.map((option) => (
                            <option key={option} value={option}>
                              {readinessLabels[option]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredSkills.length === 0 && (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No skills match your filters</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Try broader search terms, select all categories or all levels, or clear filters to see all available skills.
                  </p>
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5" />
                    What to practise next
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {practiseNext.map((skill) => (
                    <div key={skill.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-gray-800">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{skill.title}</p>
                        <Badge variant="outline" className={readinessClasses[skill.readiness]}>
                          {readinessLabels[skill.readiness]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{skill.suggestedPractice[0]}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Category health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categoryCounts.map((item) => (
                    <div key={item.category}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">{item.category}</span>
                        <span className="text-muted-foreground">
                          {item.developing}/{item.total} early
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${Math.round((item.developing / item.total) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
