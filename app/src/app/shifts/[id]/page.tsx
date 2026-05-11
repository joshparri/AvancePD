'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { db } from '@/lib/db';
import { Shift, PrepChecklistItem } from '@/types';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Play,
  Square,
  AlertCircle,
  Briefcase,
  Wrench,
  BookOpen,
  MessageSquare
} from 'lucide-react';

export default function ShiftDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shiftId = params.id as string;

  const [shift, setShift] = useState<Shift | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadShift = async () => {
      try {
        const shiftData = await db.shifts.get(shiftId);
        if (shiftData) {
          setShift(shiftData);
        }
      } catch (error) {
        console.error('Failed to load shift:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (shiftId) {
      loadShift();
    }
  }, [shiftId]);

  const getShiftStatus = (shift: Shift): { status: string; color: BadgeProps['variant'] } => {
    const now = new Date();
    const shiftStart = new Date(`${shift.date}T${shift.startTime}`);
    const shiftEnd = new Date(`${shift.date}T${shift.endTime}`);

    if (isPast(shiftEnd)) {
      return { status: 'completed', color: 'secondary' };
    } else if (now >= shiftStart && now <= shiftEnd) {
      return { status: 'in-progress', color: 'default' };
    } else {
      return { status: 'scheduled', color: 'outline' };
    }
  };

  const getShiftDisplayText = (shift: Shift) => {
    const shiftDate = new Date(shift.date);
    if (isToday(shiftDate)) {
      return 'Today';
    } else if (isTomorrow(shiftDate)) {
      return 'Tomorrow';
    } else {
      return format(shiftDate, 'EEEE, MMMM d, yyyy');
    }
  };

  const handleChecklistToggle = async (itemId: string, completed: boolean) => {
    if (!shift) return;

    setIsUpdating(true);
    try {
      const updatedChecklist = shift.prepChecklist.map(item =>
        item.id === itemId
          ? {
              ...item,
              completed,
              completedAt: completed ? new Date() : undefined
            }
          : item
      );

      const updatedShift = {
        ...shift,
        prepChecklist: updatedChecklist,
        updatedAt: new Date()
      };

      await db.shifts.update(shiftId, updatedShift);
      setShift(updatedShift);
    } catch (error) {
      console.error('Failed to update checklist:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStartShift = async () => {
    if (!shift) return;

    setIsUpdating(true);
    try {
      // TODO: Implement shift start logic
      console.log('Starting shift:', shiftId);
    } catch (error) {
      console.error('Failed to start shift:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEndShift = async () => {
    if (!shift) return;

    setIsUpdating(true);
    try {
      // TODO: Implement shift end logic
      console.log('Ending shift:', shiftId);
    } catch (error) {
      console.error('Failed to end shift:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getCategoryIcon = (category: PrepChecklistItem['category']) => {
    switch (category) {
      case 'preparation':
        return <Briefcase className="w-4 h-4" />;
      case 'equipment':
        return <Wrench className="w-4 h-4" />;
      case 'knowledge':
        return <BookOpen className="w-4 h-4" />;
      case 'communication':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: PrepChecklistItem['category']) => {
    switch (category) {
      case 'preparation':
        return 'text-blue-600';
      case 'equipment':
        return 'text-orange-600';
      case 'knowledge':
        return 'text-green-600';
      case 'communication':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!shift) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Shift not found
            </h3>
            <p className="text-muted-foreground mb-4">
              The shift could not be found.
            </p>
            <Button onClick={() => router.push('/shifts')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shifts
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const { status, color } = getShiftStatus(shift);
  const completedItems = shift.prepChecklist.filter(item => item.completed).length;
  const totalItems = shift.prepChecklist.length;

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/shifts')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shifts
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {getShiftDisplayText(shift)}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Shift Details & Preparation
                </p>
              </div>
            </div>
            <Badge variant={color} className="text-sm">
              {status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shift Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Shift Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  {shift.startTime} - {shift.endTime}
                  <span className="ml-2 font-medium">
                    ({shift.duration} min)
                  </span>
                </div>

                {shift.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {shift.location}
                  </div>
                )}

                {shift.notes && (
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      {shift.notes}
                    </p>
                  </div>
                )}

                <Separator />

                <div className="flex gap-2">
                  {status === 'scheduled' && (
                    <Button
                      onClick={handleStartShift}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Shift
                    </Button>
                  )}

                  {status === 'in-progress' && (
                    <Button
                      variant="destructive"
                      onClick={handleEndShift}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      End Shift
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Prep Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Pre-Shift Checklist
                  </span>
                  <Badge variant="outline">
                    {completedItems}/{totalItems} Complete
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {shift.prepChecklist.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No checklist items for this shift.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {shift.prepChecklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={(checked) =>
                            handleChecklistToggle(item.id, checked as boolean)
                          }
                          disabled={isUpdating}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={getCategoryColor(item.category)}>
                              {getCategoryIcon(item.category)}
                            </span>
                            <span className={`text-sm font-medium ${
                              item.completed ? 'line-through text-muted-foreground' : ''
                            }`}>
                              {item.title}
                            </span>
                          </div>
                          {item.description && (
                            <p className={`text-sm text-muted-foreground ${
                              item.completed ? 'line-through' : ''
                            }`}>
                              {item.description}
                            </p>
                          )}
                          {item.completed && item.completedAt && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Completed {format(item.completedAt, 'HH:mm')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
