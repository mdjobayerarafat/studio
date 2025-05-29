"use client";

import * as React from 'react';
import type { Routine, TodoItem } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { RoutineList } from './routine-list';
import { CreateRoutineDialog } from './create-routine-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


interface RoutineSectionProps {
  routines: Routine[];
  todoItems: TodoItem[];
  onSaveRoutine: (routine: Omit<Routine, 'id'>, existingId?: string) => void;
  onDeleteRoutine: (routineId: string) => void;
}

export function RoutineSection({ routines, todoItems, onSaveRoutine, onDeleteRoutine }: RoutineSectionProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [editingRoutine, setEditingRoutine] = React.useState<Routine | undefined>(undefined);

  const handleOpenCreateDialog = () => {
    setEditingRoutine(undefined);
    setIsCreateDialogOpen(true);
  };

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine);
    setIsCreateDialogOpen(true);
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Routines</CardTitle>
          <Button onClick={handleOpenCreateDialog} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Routine
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <RoutineList
          routines={routines}
          todoItems={todoItems}
          onEditRoutine={handleEditRoutine}
          onDeleteRoutine={onDeleteRoutine}
        />
      </CardContent>
      {isCreateDialogOpen && (
         <CreateRoutineDialog
            isOpen={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onSaveRoutine={onSaveRoutine}
            existingRoutine={editingRoutine}
            todoItems={todoItems}
        />
      )}
    </Card>
  );
}
