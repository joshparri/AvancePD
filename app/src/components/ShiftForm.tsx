'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ZodError } from 'zod';
import { db } from '@/lib/db';
import { CreateShift, shiftSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Save, X } from 'lucide-react';

interface ShiftFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const createDefaultPrepChecklist = (): CreateShift['prepChecklist'] => [
  {
    id: crypto.randomUUID(),
    title: 'Review outstanding tasks',
    description: 'Check dashboard for high-priority tasks and blocked items',
    completed: false,
    category: 'preparation',
  },
  {
    id: crypto.randomUUID(),
    title: 'Check laptop battery and charger',
    description: 'Ensure laptop is charged and charger is packed',
    completed: false,
    category: 'equipment',
  },
  {
    id: crypto.randomUUID(),
    title: 'Review recent knowledge and playbooks',
    description: 'Refresh memory on common issues and current learning goals',
    completed: false,
    category: 'knowledge',
  },
  {
    id: crypto.randomUUID(),
    title: 'Check team communication',
    description: 'Review messages for urgent updates, roster changes, or escalations',
    completed: false,
    category: 'communication',
  },
];

export function ShiftForm({ onClose, onSuccess }: ShiftFormProps) {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '08:30',
    endTime: '17:00',
    location: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateDuration = (start: string, end: string): number => {
    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);
    const diffMs = endDate.getTime() - startDate.getTime();
    return Math.round(diffMs / (1000 * 60)); // minutes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const duration = calculateDuration(formData.startTime, formData.endTime);

      const shiftData: CreateShift = {
        date: new Date(formData.date),
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration,
        location: formData.location || undefined,
        notes: formData.notes || undefined,
        prepChecklist: createDefaultPrepChecklist(),
      };

      // Validate with Zod
      const validatedData = shiftSchema.parse({
        ...shiftData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.shifts.add(validatedData);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const fieldName = err.path[0]?.toString();
          if (fieldName) {
            fieldErrors[fieldName] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Failed to create shift:', error);
        setErrors({ general: 'Failed to create shift' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Create New Shift
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={errors.date ? 'border-red-500' : ''}
            />
            {errors.date && (
              <p className="text-sm text-red-500 mt-1">{errors.date}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={errors.startTime ? 'border-red-500' : ''}
              />
              {errors.startTime && (
                <p className="text-sm text-red-500 mt-1">{errors.startTime}</p>
              )}
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className={errors.endTime ? 'border-red-500' : ''}
              />
              {errors.endTime && (
                <p className="text-sm text-red-500 mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location (Optional)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="e.g., Dubbo Office"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`pl-10 ${errors.location ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.location && (
              <p className="text-sm text-red-500 mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about this shift..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className={errors.notes ? 'border-red-500' : ''}
            />
            {errors.notes && (
              <p className="text-sm text-red-500 mt-1">{errors.notes}</p>
            )}
          </div>

          {formData.startTime && formData.endTime && (
            <div className="text-sm text-muted-foreground">
              Duration: {calculateDuration(formData.startTime, formData.endTime)} minutes
              ({Math.round(calculateDuration(formData.startTime, formData.endTime) / 60 * 10) / 10} hours)
            </div>
          )}

          {errors.general && (
            <p className="text-sm text-red-500">{errors.general}</p>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Shift'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
