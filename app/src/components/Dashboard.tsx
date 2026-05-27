'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format, isToday, isTomorrow } from 'date-fns';
import { db, initDatabase } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { Shift, WorkLog, Task } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, CheckSquare, TrendingUp, Lightbulb, BookOpen } from 'lucide-react';
import { mspLearningActivities, type MspLearningActivity } from '@/data/mspLearningActivities';
import { getLearningStats, getDueReviewSuggestions } from '@/lib/mspLearningProgress';
import { PendingActionTracker } from '@/components/PendingActionTracker';
import { HealthyShiftCard } from '@/components/HealthyShiftCard';
import { HeroPanel, PageShell, SectionHeader, StatCard } from '@/components/academy';
import { LearningIllustration } from '@/components/learning/LearningIllustration';
import { LearningDiagram } from '@/components/learning/LearningDiagram';

export function Dashboard() {
  const [nextShift, setNextShift] = useState<Shift | null>(null);
  const [recentLogs, setRecentLogs] = useState<WorkLog[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [totalHoursThisMonth, setTotalHoursThisMonth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [learningStats, setLearningStats] = useState(getLearningStats());
  const [nextBestActivity, setNextBestActivity] = useState<MspLearningActivity | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await initDatabase();

        // Seed sample data only for a completely fresh local database.
        const [shiftsCount, workLogsCount, tasksCount] = await Promise.all([
          db.shifts.count(),
          db.workLogs.count(),
          db.tasks.count(),
        ]);
        if (shiftsCount === 0 && workLogsCount === 0 && tasksCount === 0) {
          await seedDatabase();
        }

        // Get next shift
        const now = new Date();
        const nextShifts = await db.shifts
          .where('date')
          .aboveOrEqual(now)
          .sortBy('date');

        if (nextShifts.length > 0) {
          setNextShift(nextShifts[0]);
        }

        // Get recent work logs (last 5)
        const recentWorkLogs = await db.workLogs
          .orderBy('createdAt')
          .reverse()
          .limit(5)
          .toArray();
        setRecentLogs(recentWorkLogs);

        // Get pending tasks
        const pendingTasksData = await db.tasks
          .where('status')
          .anyOf('todo', 'in_progress')
          .sortBy('priority');
        setPendingTasks(pendingTasksData.slice(0, 5)); // Top 5

        // Calculate hours this month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const workLogsThisMonth = await db.workLogs
          .where('date')
          .between(startOfMonth, now)
          .toArray();

        const totalHours = workLogsThisMonth.reduce((sum, log) => sum + (log.duration / 60), 0);
        setTotalHoursThisMonth(Math.round(totalHours * 10) / 10);

        // Load learning progress
        const stats = getLearningStats();
        setLearningStats(stats);
        
        const recommendations = getDueReviewSuggestions(mspLearningActivities);
        if (recommendations.length > 0) {
          const nextActivity = mspLearningActivities.find(a => a.id === recommendations[0]);
          setNextBestActivity(nextActivity || null);
        }

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getShiftDisplayText = (shift: Shift) => {
    const shiftDate = new Date(shift.date);
    if (isToday(shiftDate)) {
      return 'Today';
    } else if (isTomorrow(shiftDate)) {
      return 'Tomorrow';
    } else {
      return format(shiftDate, 'EEEE, MMM d');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageShell
      eyebrow="Today"
      title="Command centre"
      subtitle={format(new Date(), 'EEEE, MMMM d, yyyy')}
      actions={
        <>
          <Button size="sm" asChild>
            <Link href="/work-logs">
              <Plus className="w-4 h-4 mr-2" />
              New log
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <CheckSquare className="w-4 h-4 mr-2" />
            New task
          </Button>
        </>
      }
    >
        <HeroPanel
          title="One clear next step"
          subtitle="Balance work, learning, wellbeing, and follow-up — start with PD focus or your next shift."
          illustration={<LearningIllustration variant="dashboard-command-centre" size="lg" decorative />}
          primaryAction={
            nextBestActivity ? (
              <Button size="sm" asChild>
                <Link href="/learning-cockpit">Start: {nextBestActivity.title.slice(0, 36)}…</Link>
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link href="/learning-cockpit">Open Learning Cockpit</Link>
              </Button>
            )
          }
          secondaryAction={
            <Button size="sm" variant="outline" asChild>
              <Link href="/evidence-pack">View Evidence Pack</Link>
            </Button>
          }
          stats={[
            { label: 'Learning done', value: learningStats.completedCount },
            { label: 'Minutes', value: learningStats.totalMinutes },
            { label: 'Pending tasks', value: pendingTasks.length },
          ]}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Calendar}
            label="Next shift"
            value={nextShift ? getShiftDisplayText(nextShift) : 'None'}
            helper={nextShift ? `${nextShift.startTime} – ${nextShift.endTime}` : 'No upcoming shift'}
          />
          <StatCard icon={Clock} label="Hours this month" value={totalHoursThisMonth} helper="Target: 160h" />
          <StatCard
            icon={CheckSquare}
            label="Pending tasks"
            value={pendingTasks.length}
            helper={`${pendingTasks.filter((t) => t.priority === 'urgent' || t.priority === 'high').length} high priority`}
          />
          <StatCard icon={TrendingUp} label="Recent logs" value={recentLogs.length} helper="Last entries" />
        </div>

        <Card className="border-blue-100/80 dark:border-blue-900/40">
          <CardHeader>
            <SectionHeader icon={Lightbulb} title="PD focus today" description="Learning" />
          </CardHeader>
          <CardContent>
            <LearningDiagram variant="learning-loop" className="mb-4" compact />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Learning Progress Summary */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Learning Progress</h3>
                <div className="text-2xl font-bold text-blue-600">
                  {learningStats.completedCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  activities completed
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {learningStats.totalMinutes} minutes logged
                </div>
              </div>

              {/* Next Best Activity */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Next Best Move</h3>
                {nextBestActivity ? (
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {nextBestActivity.title.slice(0, 40)}...
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Badge variant="outline">{nextBestActivity.activityType}</Badge>
                      <span>{nextBestActivity.estimatedMinutes} min</span>
                    </div>
                    <Button size="sm" className="w-full" asChild>
                      <a href="/learning-cockpit">
                        Start Learning
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Great progress! Check the Learning Cockpit for more activities.
                    </p>
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <a href="/learning-cockpit">
                        View All Activities
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              {/* Learning Cockpit Link */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Learning Cockpit</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Your personalized MSP training coach with mixed learning activities.
                </p>
                <Button size="sm" className="w-full" asChild>
                  <a href="/learning-cockpit">
                    Open Learning Cockpit
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <SectionHeader title="Wellbeing" description="Healthy shift habits" />
          <HealthyShiftCard />
        </section>

        <section className="space-y-4">
          <SectionHeader title="Follow-up" description="Pending actions and reminders" />
          <PendingActionTracker />
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <SectionHeader icon={BookOpen} title="Recent work logs" description="Work" />
            </CardHeader>
            <CardContent>
              {recentLogs.length > 0 ? (
                <div className="space-y-3">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="flex items-start justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{log.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {log.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(log.date), 'MMM d')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(log.duration / 60 * 10) / 10}h
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">
                    No work logs yet. Capture the next useful support action.
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/work-logs">Create Work Log</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionHeader icon={CheckSquare} title="Pending tasks" />
            </CardHeader>
            <CardContent>
              {pendingTasks.length > 0 ? (
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="flex items-start justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                          {task.dueDate && (
                            <span className="text-xs text-muted-foreground">
                              Due {format(new Date(task.dueDate), 'MMM d')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No pending tasks. Great job staying on top of things!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
    </PageShell>
  );
}
