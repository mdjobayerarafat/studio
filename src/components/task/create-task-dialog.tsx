"use client";

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskFormFields } from './task-form-fields';
import type { Task, TodoItem } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const geofenceSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(1),
  triggerOn: z.enum(['enter', 'leave']),
});

export const TaskFormSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  triggerType: z.enum(['time', 'geofence'], { required_error: "Trigger type is required" }),
  activationTime: z.string().optional(),
  geofence: geofenceSchema.optional(),
  actionTodoItemId: z.string().min(1, "Target todo item is required"),
  actionNewText: z.string().min(1, "New todo text is required"),
}).superRefine((data, ctx) => {
  if (data.triggerType === 'time' && !data.activationTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Activation time is required for time-based triggers.",
      path: ['activationTime'],
    });
  }
  if (data.triggerType === 'geofence' && !data.geofence) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Geofence details are required for geofence-based triggers.",
      path: ['geofence'],
    });
  }
});

interface CreateTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSaveTask: (task: Omit<Task, 'id'>) => void;
  existingTask?: Task;
  todoItems: TodoItem[];
}

export function CreateTaskDialog({
  isOpen,
  onOpenChange,
  onSaveTask,
  existingTask,
  todoItems,
}: CreateTaskDialogProps) {
  const form = useForm<z.infer<typeof TaskFormSchema>>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: existingTask
      ? {
          name: existingTask.name,
          triggerType: existingTask.triggerType,
          activationTime: existingTask.activationTime,
          geofence: existingTask.geofence,
          actionTodoItemId: existingTask.action.todoItemId,
          actionNewText: existingTask.action.newText,
        }
      : {
          name: '',
          triggerType: undefined,
          activationTime: '',
          geofence: { latitude: 0, longitude: 0, radius: 100, triggerOn: 'enter' },
          actionTodoItemId: '',
          actionNewText: '',
        },
  });

  const triggerType = form.watch('triggerType');

  React.useEffect(() => {
    if (existingTask) {
      form.reset({
        name: existingTask.name,
        triggerType: existingTask.triggerType,
        activationTime: existingTask.activationTime,
        geofence: existingTask.geofence,
        actionTodoItemId: existingTask.action.todoItemId,
        actionNewText: existingTask.action.newText,
      });
    } else {
       form.reset({
          name: '',
          triggerType: undefined,
          activationTime: '',
          geofence: { latitude: 0, longitude: 0, radius: 100, triggerOn: 'enter' },
          actionTodoItemId: '',
          actionNewText: '',
        });
    }
  }, [existingTask, form, isOpen]);


  const onSubmit = (values: z.infer<typeof TaskFormSchema>) => {
    const taskData: Omit<Task, 'id'> = {
      name: values.name,
      triggerType: values.triggerType,
      activationTime: values.triggerType === 'time' ? values.activationTime : undefined,
      geofence: values.triggerType === 'geofence' ? values.geofence : undefined,
      action: {
        type: 'updateTodo',
        todoItemId: values.actionTodoItemId,
        newText: values.actionNewText,
      },
    };
    onSaveTask(taskData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{existingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            Configure the details for your task. Tasks define what happens when a routine is activated.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="max-h-[60vh] p-1 pr-4">
              <div className="space-y-4 p-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Check morning emails" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="triggerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trigger Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select trigger type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="time">Time-based</SelectItem>
                          <SelectItem value="geofence">Geofence-based</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <TaskFormFields form={form} triggerType={triggerType} />

                <h3 className="text-md font-semibold pt-2 border-t mt-4">Action: Update Todo Item</h3>
                <FormField
                  control={form.control}
                  name="actionTodoItemId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Todo Item</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a todo item to update" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {todoItems.filter(item => !item.completed).map(item => (
                            <SelectItem key={item.id} value={item.id}>{item.text}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="actionNewText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Text for Todo Item</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the new text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                {existingTask ? 'Save Changes' : 'Add Task'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
