"use client";

import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TaskFormSchema } from './create-task-dialog'; // Assuming this will be defined

interface TaskFormFieldsProps {
  form: UseFormReturn<z.infer<typeof TaskFormSchema>>;
  triggerType: 'time' | 'geofence' | '';
}

export function TaskFormFields({ form, triggerType }: TaskFormFieldsProps) {
  if (triggerType === 'time') {
    return (
      <FormField
        control={form.control}
        name="activationTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Activation Time</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (triggerType === 'geofence') {
    return (
      <>
        <FormField
          control={form.control}
          name="geofence.latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="geofence.longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="geofence.radius"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Radius (meters)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="geofence.triggerOn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trigger On</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="enter">Entering Area</SelectItem>
                  <SelectItem value="leave">Leaving Area</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  }

  return null;
}
