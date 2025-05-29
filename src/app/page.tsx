"use client";

import * as React from 'react';
import type { Routine, TodoItem } from '@/types';
import { AppHeader } from '@/components/layout/app-header';
import { RoutineSection } from '@/components/routine/routine-section';
import { TodoSection }from '@/components/todo/todo-section';
import { useToast } from "@/hooks/use-toast";

// Initial sample data
const initialTodos: TodoItem[] = [
  { id: 'todo-1', text: 'Draft project proposal', completed: false },
  { id: 'todo-2', text: 'Schedule team meeting', completed: true },
  { id: 'todo-3', text: 'Review PR #123', completed: false },
];

const initialRoutines: Routine[] = [
  {
    id: 'routine-1',
    name: 'Morning Kickstart',
    tasks: [
      {
        id: 'task-1a',
        name: 'Plan Day',
        triggerType: 'time',
        activationTime: '08:00',
        action: { type: 'updateTodo', todoItemId: 'todo-1', newText: 'Finalize project proposal draft' },
      },
    ],
  },
  {
    id: 'routine-2',
    name: 'Gym Arrival Focus',
    tasks: [
       {
        id: 'task-2a',
        name: 'Log Workout',
        triggerType: 'geofence',
        geofence: { latitude: 34.0522, longitude: -118.2437, radius: 50, triggerOn: 'enter' },
        action: { type: 'updateTodo', todoItemId: 'todo-3', newText: 'Start workout log for today' },
      },
    ]
  }
];


export default function HomePage() {
  const [routines, setRoutines] = React.useState<Routine[]>(initialRoutines);
  const [todoItems, setTodoItems] = React.useState<TodoItem[]>(initialTodos);
  const { toast } = useToast();

  // --- Todo Handlers ---
  const handleAddTodo = (text: string) => {
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    setTodoItems(prev => [newTodo, ...prev]);
    toast({ title: "Todo Added", description: `"${text}" was added to your list.` });
  };

  const handleToggleCompleteTodo = (id: string) => {
    setTodoItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleUpdateTodoText = (id: string, newText: string) => {
    setTodoItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, text: newText } : item
      )
    );
    toast({ title: "Todo Updated", description: "The todo item text has been changed." });
  };

  const handleDeleteTodo = (id: string) => {
    // Check if any routine task uses this todo item
    const isTodoUsed = routines.some(routine => 
      routine.tasks.some(task => task.action.todoItemId === id)
    );

    if (isTodoUsed) {
      toast({
        title: "Cannot Delete Todo",
        description: "This todo item is used in one or more routine tasks. Please remove it from tasks first.",
        variant: "destructive",
      });
      return;
    }

    setTodoItems(prev => prev.filter(item => item.id !== id));
    toast({ title: "Todo Deleted", description: "The todo item has been removed." });
  };

  // --- Routine Handlers ---
  const handleSaveRoutine = (routineData: Omit<Routine, 'id'>, existingId?: string) => {
    if (existingId) {
      setRoutines(prev =>
        prev.map(r => (r.id === existingId ? { ...r, ...routineData } : r))
      );
      toast({ title: "Routine Updated", description: `"${routineData.name}" has been updated.`});
    } else {
      const newRoutine: Routine = { ...routineData, id: crypto.randomUUID() };
      setRoutines(prev => [newRoutine, ...prev]);
      toast({ title: "Routine Created", description: `"${newRoutine.name}" has been created.`});
    }
  };

  const handleDeleteRoutine = (routineId: string) => {
    setRoutines(prev => prev.filter(r => r.id !== routineId));
    toast({ title: "Routine Deleted", description: "The routine has been removed."});
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto pb-4 pr-2 custom-scrollbar">
             <RoutineSection
                routines={routines}
                todoItems={todoItems}
                onSaveRoutine={handleSaveRoutine}
                onDeleteRoutine={handleDeleteRoutine}
              />
          </div>
          <div className="lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto pb-4 pr-2 custom-scrollbar">
            <TodoSection
              todoItems={todoItems}
              onAddTodo={handleAddTodo}
              onToggleComplete={handleToggleCompleteTodo}
              onUpdateTodoText={handleUpdateTodoText}
              onDeleteTodo={handleDeleteTodo}
            />
          </div>
        </div>
      </main>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--background));
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted)); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--secondary-foreground)); 
        }
      `}</style>
    </div>
  );
}
