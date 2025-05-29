"use client";

import * as React from 'react';
import type { TodoItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Edit3, Trash2, Sparkles, Save, X } from 'lucide-react';

interface TodoItemRowProps {
  item: TodoItem;
  onToggleComplete: (id: string) => void;
  onUpdateText: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  onRefine: (item: TodoItem) => void;
}

export function TodoItemRow({ item, onToggleComplete, onUpdateText, onDelete, onRefine }: TodoItemRowProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(item.text);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdateText(item.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(item.text);
    setIsEditing(false);
  };

  return (
    <div className={`flex items-center gap-2 p-3 rounded-md transition-colors duration-200 ${item.completed ? 'bg-muted/30' : 'bg-card hover:bg-muted/10'} border border-border`}>
      <Checkbox
        id={`todo-${item.id}`}
        checked={item.completed}
        onCheckedChange={() => onToggleComplete(item.id)}
        aria-label={item.completed ? `Mark "${item.text}" as incomplete` : `Mark "${item.text}" as complete`}
      />
      {isEditing ? (
        <Input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-grow h-8"
          aria-label="Edit todo text"
          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
        />
      ) : (
        <label
          htmlFor={`todo-${item.id}`}
          className={`flex-grow cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
        >
          {item.text}
        </label>
      )}

      <div className="flex gap-1">
        {isEditing ? (
          <>
            <Button variant="ghost" size="icon" onClick={handleSaveEdit} aria-label="Save changes">
              <Save className="w-4 h-4 text-green-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCancelEdit} aria-label="Cancel edit">
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            {!item.completed && (
              <>
                <Button variant="ghost" size="icon" onClick={() => onRefine(item)} aria-label="Refine todo item with AI">
                  <Sparkles className="w-4 h-4 text-accent" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} aria-label="Edit todo item">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} aria-label="Delete todo item">
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
