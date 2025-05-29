"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface AddTodoFormProps {
  onAddTodo: (text: string) => void;
}

export function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
  const [text, setText] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo..."
        className="flex-grow"
        aria-label="New todo text"
      />
      <Button type="submit" variant="outline" aria-label="Add todo">
        <Plus className="w-4 h-4 mr-2" /> Add
      </Button>
    </form>
  );
}
