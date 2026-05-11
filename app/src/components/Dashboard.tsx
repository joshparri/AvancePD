'use client';

import { useEffect, useState } from 'react';
import { format, addDays, startOfWeek, isToday, isTomorrow } from 'date-fns';
import { db, initDatabase } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { Shift, WorkLog, Task, PDAchievement } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, CheckSquare, TrendingUp, Plus, BookOpen } from 'lucide-react';

export function Dashboard() {
  const [nextShift, setNextShift] = useState<Shift | null>(null);
  const [recentLogs, setRecentLogs] = useState<WorkLog[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [totalHoursThisMonth, setTotalHoursThisMonth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await initDatabase();

        // Check if we have data, if not seed the database
        const shiftsCount = await db.shifts.count();
        if (shiftsCount === 0) {
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
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Avance Work Companion
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Log
            </Button>
            <Button variant="outline" size="sm">
              <CheckSquare className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Next Shift */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Shift</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {nextShift ? (
                <div>
                  <div className="text-2xl font-bold">
                    {getShiftDisplayText(nextShift)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {nextShift.startTime} - {nextShift.endTime}
                  </p>
                  {nextShift.location && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {nextShift.location}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-2xl font-bold text-muted-foreground">
                  No shifts
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hours This Month */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours This Month</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHoursThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                Target: 160 hours
              </p>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                {pendingTasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length} high priority
              </p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Logs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentLogs.length}</div>
              <p className="text-xs text-muted-foreground">
                Last 7 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Work Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Recent Work Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentLogs.length > 0 ? (
                <div className="space-y-3">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                <p className="text-muted-foreground text-center py-4">
                  No work logs yet. Start by logging your first task!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingTasks.length > 0 ? (
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
      </div>
    </div>
  );
}