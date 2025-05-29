"use client";

import type { TodoItem } from '@/types';
import { TodoItemRow } from './todo-item-row';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TodoListProps {
  items: TodoItem[];
  onToggleComplete: (id: string) => void;
  onUpdateText: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  onRefine: (item: TodoItem) => void;
}

export function TodoList({ items, onToggleComplete, onUpdateText, onDelete, onRefine }: TodoListProps) {
  if (items.length === 0) {
    return <p className="text-muted-foreground italic text-center py-8">Your todo list is empty. Add some tasks!</p>;
  }

  const incompleteItems = items.filter(item => !item.completed);
  const completedItems = items.filter(item => item.completed);

  return (
    <ScrollArea className="h-[calc(100%-4rem)]"> {/* Adjust height as needed */}
      <div className="space-y-3 pr-3">
        {incompleteItems.map((item) => (
          <TodoItemRow
            key={item.id}
            item={item}
            onToggleComplete={onToggleComplete}
            onUpdateText={onUpdateText}
            onDelete={onDelete}
            onRefine={onRefine}
          />
        ))}
        {completedItems.length > 0 && incompleteItems.length > 0 && (
          <div className="py-2">
            <hr className="border-border" />
            <p className="text-sm text-muted-foreground font-medium mt-2">Completed</p>
          </div>
        )}
        {completedItems.map((item) => (
          <TodoItemRow
            key={item.id}
            item={item}
            onToggleComplete={onToggleComplete}
            onUpdateText={onUpdateText}
            onDelete={onDelete}
            onRefine={onRefine}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
