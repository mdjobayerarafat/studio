"use client";

import type { Routine, Task, TodoItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, Settings2 } from 'lucide-react';
import { TaskDisplay } from '@/components/task/task-display';

interface RoutineCardProps {
  routine: Routine;
  todoItems: TodoItem[];
  onEdit: (routine: Routine) => void;
  onDelete: (routineId: string) => void;
}

export function RoutineCard({ routine, todoItems, onEdit, onDelete }: RoutineCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings2 className="w-6 h-6 text-primary" />
              {routine.name}
            </CardTitle>
            <CardDescription>{routine.tasks.length} task(s)</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => onEdit(routine)} aria-label={`Edit routine ${routine.name}`}>
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={() => onDelete(routine.id)} aria-label={`Delete routine ${routine.name}`}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {routine.tasks.length > 0 ? (
          <div className="space-y-2">
            {routine.tasks.map((task) => (
              <TaskDisplay key={task.id} task={task} todoItems={todoItems} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No tasks in this routine yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
