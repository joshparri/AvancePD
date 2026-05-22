'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Layout } from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { db, initDatabase } from '@/lib/db';
import { Shift, WorkCategory, WorkLog } from '@/types';
import { BookOpen, Clock, Filter, Plus, Search } from 'lucide-react';

const workCategoryLabels: Record<WorkCategory, string> = {
  [WorkCategory.SUPPORT]: 'Support',
  [WorkCategory.DEVELOPMENT]: 'Development',
  [WorkCategory.MAINTENANCE]: 'Maintenance',
  [WorkCategory.CONSULTING]: 'Consulting',
  [WorkCategory.TRAINING]: 'Training',
  [WorkCategory.ADMIN]: 'Admin',
  [WorkCategory.OTHER]: 'Other',
};

const initialFormState = {
  description: '',
  category: WorkCategory.SUPPORT,
  duration: '15',
  date: format(new Date(), 'yyyy-MM-dd'),
  shiftId: '',
  tags: '',
  notes: '',
};

export default function WorkLogsPage() {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [formData, setFormData] = useState(initialFormState);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<WorkCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadWorkLogs = async () => {
    const [logs, allShifts] = await Promise.all([
      db.workLogs.orderBy('date').reverse().toArray(),
      db.shifts.orderBy('date').reverse().toArray(),
    ]);

    setWorkLogs(logs);
    setShifts(allShifts);
  };

  useEffect(() => {
    const initialise = async () => {
      try {
        await initDatabase();
        await loadWorkLogs();
      } catch (loadError) {
        console.error('Failed to load work logs:', loadError);
        setError('Could not load work logs.');
      } finally {
        setIsLoading(false);
      }
    };

    initialise();
  }, []);

  const filteredLogs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return workLogs.filter(log => {
      const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
      const matchesSearch = normalizedSearch.length === 0 ||
        log.description.toLowerCase().includes(normalizedSearch) ||
        log.notes?.toLowerCase().includes(normalizedSearch) ||
        log.tags.some(tag => tag.toLowerCase().includes(normalizedSearch));

      return matchesCategory && matchesSearch;
    });
  }, [workLogs, searchTerm, categoryFilter]);

  const totalMinutes = filteredLogs.reduce((sum, log) => sum + log.duration, 0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const duration = Number(formData.duration);
    if (!formData.description.trim()) {
      setError('Add a short description before saving the work log.');
      return;
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      setError('Duration must be a positive number of minutes.');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date();
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);

      const workLog: WorkLog = {
        id: crypto.randomUUID(),
        shiftId: formData.shiftId || undefined,
        date: new Date(`${formData.date}T12:00:00`),
        description: formData.description.trim(),
        category: formData.category,
        duration,
        tags,
        notes: formData.notes.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };

      await db.workLogs.add(workLog);
      setFormData({
        ...initialFormState,
        date: format(new Date(), 'yyyy-MM-dd'),
      });
      await loadWorkLogs();
    } catch (saveError) {
      console.error('Failed to save work log:', saveError);
      setError('Could not save the work log.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Work Logs</h1>
              <p className="mt-1 max-w-3xl text-gray-600 dark:text-gray-400">
                Capture useful shift evidence quickly: what happened, how long it took, and what should be remembered next time.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border bg-white p-3 dark:bg-gray-900">
                <div className="text-2xl font-bold">{filteredLogs.length}</div>
                <div className="text-muted-foreground">visible logs</div>
              </div>
              <div className="rounded-lg border bg-white p-3 dark:bg-gray-900">
                <div className="text-2xl font-bold">{Math.round((totalMinutes / 60) * 10) / 10}</div>
                <div className="text-muted-foreground">hours shown</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Quick Capture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor="description">What did you do?</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(event) => setFormData(prev => ({ ...prev, description: event.target.value }))}
                      placeholder="e.g., Triaged Outlook MFA prompt loop"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(event) => setFormData(prev => ({ ...prev, category: event.target.value as WorkCategory }))}
                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {Object.entries(workCategoryLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="duration">Minutes</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={formData.duration}
                        onChange={(event) => setFormData(prev => ({ ...prev, duration: event.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(event) => setFormData(prev => ({ ...prev, date: event.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shift">Shift</Label>
                      <select
                        id="shift"
                        value={formData.shiftId}
                        onChange={(event) => setFormData(prev => ({ ...prev, shiftId: event.target.value }))}
                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">No shift link</option>
                        {shifts.map(shift => (
                          <option key={shift.id} value={shift.id}>
                            {format(new Date(shift.date), 'MMM d')} - {shift.startTime}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(event) => setFormData(prev => ({ ...prev, tags: event.target.value }))}
                      placeholder="outlook, m365, escalation"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(event) => setFormData(prev => ({ ...prev, notes: event.target.value }))}
                      placeholder="Keep it client-safe: symptoms, checks, result, next step."
                      rows={4}
                    />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Saving...' : 'Save Work Log'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Find Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search descriptions, tags, or notes"
                        className="pl-9"
                      />
                    </div>
                    <select
                      value={categoryFilter}
                      onChange={(event) => setCategoryFilter(event.target.value as WorkCategory | 'all')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="all">All categories</option>
                      {Object.entries(workCategoryLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              {isLoading ? (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">Loading work logs...</CardContent>
                </Card>
              ) : filteredLogs.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No matching work logs</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add your first support action or clear the filters.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredLogs.map(log => (
                    <Card key={log.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline">{workCategoryLabels[log.category]}</Badge>
                              <span className="text-sm text-muted-foreground">{format(new Date(log.date), 'MMM d, yyyy')}</span>
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                {log.duration} min
                              </span>
                            </div>
                            <h2 className="font-medium text-gray-900 dark:text-white">{log.description}</h2>
                            {log.notes && <p className="text-sm text-gray-600 dark:text-gray-400">{log.notes}</p>}
                            {log.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {log.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          {log.shiftId && (
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/shifts/${log.shiftId}`}>Open Shift</Link>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
