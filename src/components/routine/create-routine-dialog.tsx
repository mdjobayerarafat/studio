"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Routine, Task, TodoItem } from '@/types';
import { CreateTaskDialog } from '@/components/task/create-task-dialog';
import { TaskDisplay } from '@/components/task/task-display';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreateRoutineDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSaveRoutine: (routine: Omit<Routine, 'id'>, existingId?: string) => void;
  existingRoutine?: Routine;
  todoItems: TodoItem[];
}

export function CreateRoutineDialog({
  isOpen,
  onOpenChange,
  onSaveRoutine,
  existingRoutine,
  todoItems,
}: CreateRoutineDialogProps) {
  const [routineName, setRoutineName] = React.useState('');
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>(undefined);
  const [editingTaskIndex, setEditingTaskIndex] = React.useState<number | undefined>(undefined);


  React.useEffect(() => {
    if (isOpen) {
      if (existingRoutine) {
        setRoutineName(existingRoutine.name);
        setTasks(existingRoutine.tasks.map(task => ({...task}))); // Deep copy tasks
      } else {
        setRoutineName('');
        setTasks([]);
      }
    }
  }, [isOpen, existingRoutine]);

  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTaskIndex !== undefined) {
      // Editing existing task
      const updatedTasks = [...tasks];
      updatedTasks[editingTaskIndex] = { ...tasks[editingTaskIndex], ...taskData };
      setTasks(updatedTasks);
    } else {
      // Adding new task
      const newTask: Task = { ...taskData, id: crypto.randomUUID() };
      setTasks([...tasks, newTask]);
    }
    setEditingTask(undefined);
    setEditingTaskIndex(undefined);
  };

  const handleEditTask = (task: Task, index: number) => {
    setEditingTask(task);
    setEditingTaskIndex(index);
    setIsTaskDialogOpen(true);
  };

  const handleDeleteTask = (taskIndex: number) => {
    setTasks(tasks.filter((_, i) => i !== taskIndex));
  };
  
  const handleOpenNewTaskDialog = () => {
    setEditingTask(undefined);
    setEditingTaskIndex(undefined);
    setIsTaskDialogOpen(true);
  };

  const handleSaveRoutine = () => {
    if (!routineName.trim()) {
      // Basic validation, consider using a form library for more complex scenarios
      alert("Routine name cannot be empty.");
      return;
    }
    onSaveRoutine({ name: routineName, tasks }, existingRoutine?.id);
    onOpenChange(false);
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingTask(undefined);
      setEditingTaskIndex(undefined);
    }
    onOpenChange(open);
  };


  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{existingRoutine ? 'Edit Routine' : 'Create New Routine'}</DialogTitle>
            <DialogDescription>
              Define a name for your routine and add tasks to be executed.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] p-1 pr-4">
            <div className="grid gap-4 py-4 p-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="routineName" className="text-right">
                  Name
                </Label>
                <Input
                  id="routineName"
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Morning Focus"
                />
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-semibold">Tasks</h3>
                  <Button variant="outline" size="sm" onClick={handleOpenNewTaskDialog}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>
                {tasks.length > 0 ? (
                  <div className="space-y-2 p-2 border rounded-md max-h-64 overflow-y-auto">
                    {tasks.map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <TaskDisplay task={task} todoItems={todoItems} />
                        <div className="flex gap-1 ml-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditTask(task, index)} aria-label="Edit task">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(index)} aria-label="Delete task">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic text-center py-4">No tasks added yet.</p>
                )}
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="button" onClick={handleSaveRoutine} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {existingRoutine ? 'Save Changes' : 'Create Routine'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isTaskDialogOpen && (
        <CreateTaskDialog
          isOpen={isTaskDialogOpen}
          onOpenChange={setIsTaskDialogOpen}
          onSaveTask={handleSaveTask}
          existingTask={editingTask}
          todoItems={todoItems}
        />
      )}
    </>
  );
}
