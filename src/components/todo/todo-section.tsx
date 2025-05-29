"use client";

import * as React from 'react';
import type { TodoItem } from '@/types';
import { AddTodoForm } from './add-todo-form';
import { TodoList } from './todo-list';
import { RefineTodoItemDialog } from './refine-todo-item-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TodoSectionProps {
  todoItems: TodoItem[];
  onAddTodo: (text: string) => void;
  onToggleComplete: (id: string) => void;
  onUpdateTodoText: (id: string, newText: string) => void;
  onDeleteTodo: (id: string) => void;
}

export function TodoSection({
  todoItems,
  onAddTodo,
  onToggleComplete,
  onUpdateTodoText,
  onDeleteTodo,
}: TodoSectionProps) {
  const [isRefineDialogOpen, setIsRefineDialogOpen] = React.useState(false);
  const [selectedTodoForRefinement, setSelectedTodoForRefinement] = React.useState<TodoItem | null>(null);

  const handleRefine = (item: TodoItem) => {
    setSelectedTodoForRefinement(item);
    setIsRefineDialogOpen(true);
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Todo List</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-4rem-1px)]"> {/* Adjust height based on CardHeader*/}
        <AddTodoForm onAddTodo={onAddTodo} />
        <div className="flex-grow overflow-hidden"> {/* This div will allow TodoList's ScrollArea to work */}
          <TodoList
            items={todoItems}
            onToggleComplete={onToggleComplete}
            onUpdateText={onUpdateTodoText}
            onDelete={onDeleteTodo}
            onRefine={handleRefine}
          />
        </div>
      </CardContent>
      {selectedTodoForRefinement && (
        <RefineTodoItemDialog
          isOpen={isRefineDialogOpen}
          onOpenChange={setIsRefineDialogOpen}
          todoItem={selectedTodoForRefinement}
          onUpdateTodoText={onUpdateTodoText}
        />
      )}
    </Card>
  );
}
