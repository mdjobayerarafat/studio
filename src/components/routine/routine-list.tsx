"use client";

import type { Routine, TodoItem } from '@/types';
import { RoutineCard } from './routine-card';

interface RoutineListProps {
  routines: Routine[];
  todoItems: TodoItem[];
  onEditRoutine: (routine: Routine) => void;
  onDeleteRoutine: (routineId: string) => void;
}

export function RoutineList({ routines, todoItems, onEditRoutine, onDeleteRoutine }: RoutineListProps) {
  if (routines.length === 0) {
    return <p className="text-muted-foreground italic text-center py-8">No routines created yet. Get started by adding one!</p>;
  }

  return (
    <div className="space-y-4">
      {routines.map((routine) => (
        <RoutineCard
          key={routine.id}
          routine={routine}
          todoItems={todoItems}
          onEdit={onEditRoutine}
          onDelete={onDeleteRoutine}
        />
      ))}
    </div>
  );
}
