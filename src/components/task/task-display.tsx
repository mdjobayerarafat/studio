"use client";

import type { Task, TodoItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TriggerIcon } from '@/components/icons/trigger-icons';
import { ArrowRight } from 'lucide-react';

interface TaskDisplayProps {
  task: Task;
  todoItems: TodoItem[];
}

export function TaskDisplay({ task, todoItems }: TaskDisplayProps) {
  const targetTodo = todoItems.find(todo => todo.id === task.action.todoItemId);

  return (
    <div className="p-3 bg-muted/50 rounded-md border border-border/50 mb-2 last:mb-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TriggerIcon triggerType={task.triggerType} className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm text-foreground">{task.name}</span>
        </div>
      </div>
      {task.triggerType === 'time' && task.activationTime && (
        <p className="text-xs text-muted-foreground mt-1 ml-6">At {task.activationTime}</p>
      )}
      {task.triggerType === 'geofence' && task.geofence && (
        <p className="text-xs text-muted-foreground mt-1 ml-6">
          {task.geofence.triggerOn === 'enter' ? 'Entering' : 'Leaving'} area ({task.geofence.radius}m)
        </p>
      )}
      <div className="mt-1 ml-6 text-xs text-muted-foreground flex items-center gap-1">
        <span>Update Todo:</span>
        <span className="italic">{targetTodo ? `"${targetTodo.text}"` : "Unknown Todo"}</span>
        <ArrowRight className="w-3 h-3" />
        <span className="italic font-semibold text-foreground">{`"${task.action.newText}"`}</span>
      </div>
    </div>
  );
}
