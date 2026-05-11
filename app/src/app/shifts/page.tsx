'use client';

import { useEffect, useState } from 'react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { db } from '@/lib/db';
import { Shift } from '@/types';
import { Layout } from '@/components/Layout';
import { ShiftForm } from '@/components/ShiftForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, Plus, Play, Square } from 'lucide-react';

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    const loadShifts = async () => {
      try {
        const allShifts = await db.shifts.orderBy('date').toArray();
        setShifts(allShifts);
      } catch (error) {
        console.error('Failed to load shifts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShifts();
  }, []);

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
      return format(shiftDate, 'EEEE, MMM d');
    }
  };

  const handleStartShift = async (shiftId: string) => {
    // TODO: Implement shift start logic
    console.log('Starting shift:', shiftId);
  };

  const handleEndShift = async (shiftId: string) => {
    // TODO: Implement shift end logic
    console.log('Ending shift:', shiftId);
  };

  const handleShiftCreated = async () => {
    // Reload shifts after creation
    const allShifts = await db.shifts.orderBy('date').toArray();
    setShifts(allShifts);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Shifts
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your work shifts and track time
                </p>
              </div>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Shift
                </Button>
              </DialogTrigger>
            </div>
          </div>

          {/* Shifts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shifts.map((shift) => {
              const { status, color } = getShiftStatus(shift);
              return (
                <Card key={shift.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {getShiftDisplayText(shift)}
                        </CardTitle>
                        <Badge variant={color} className="mt-2">
                          {status}
                        </Badge>
                      </div>
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
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
                        <p className="text-sm text-muted-foreground">
                          {shift.notes}
                        </p>
                      )}

                      <div className="flex gap-2 pt-2">
                        {status === 'scheduled' && (
                          <Button
                            size="sm"
                            onClick={() => handleStartShift(shift.id)}
                            className="flex-1"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Shift
                          </Button>
                        )}

                        {status === 'in-progress' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleEndShift(shift.id)}
                            className="flex-1"
                          >
                            <Square className="w-4 h-4 mr-2" />
                            End Shift
                          </Button>
                        )}

                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {shifts.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No shifts scheduled
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first shift to get started with time tracking.
              </p>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Shift
                </Button>
              </DialogTrigger>
            </div>
          )}
        </div>
        <DialogContent className="max-w-md">
          <ShiftForm
            onClose={() => setIsCreateDialogOpen(false)}
            onSuccess={handleShiftCreated}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
