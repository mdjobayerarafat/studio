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
import { Textarea } from '@/components/ui/textarea';
import { refineTodoListItem, type RefineTodoListItemOutput } from '@/ai/flows/refine-todo-list-item';
import type { TodoItem } from '@/types';
import { Loader2, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";


interface RefineTodoItemDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  todoItem: TodoItem;
  onUpdateTodoText: (todoId: string, newText: string) => void;
}

export function RefineTodoItemDialog({
  isOpen,
  onOpenChange,
  todoItem,
  onUpdateTodoText,
}: RefineTodoItemDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [refinedResult, setRefinedResult] = React.useState<RefineTodoListItemOutput | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (isOpen && todoItem) {
      setIsLoading(true);
      setError(null);
      setRefinedResult(null);
      refineTodoListItem({ todoListItem: todoItem.text })
        .then(result => {
          setRefinedResult(result);
        })
        .catch(err => {
          console.error("Error refining todo item:", err);
          setError("Failed to refine todo item. Please try again.");
          toast({
            title: "Refinement Failed",
            description: "Could not get suggestion from AI.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, todoItem, toast]);

  const handleUseRefinedText = () => {
    if (refinedResult) {
      onUpdateTodoText(todoItem.id, refinedResult.refinedTodoListItem);
      toast({
        title: "Todo Item Updated",
        description: "The todo item has been updated with the refined text.",
      });
      onOpenChange(false);
    }
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Reset state when dialog is closed
      setIsLoading(false);
      setError(null);
      setRefinedResult(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            Refine Todo Item
          </DialogTitle>
          <DialogDescription>
            AI-powered suggestions to make your todo item clearer and more actionable.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <label htmlFor="originalText" className="block text-sm font-medium text-muted-foreground mb-1">Original Text</label>
            <Textarea id="originalText" value={todoItem?.text || ''} readOnly rows={3} className="bg-muted/50" />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="ml-2">Refining your todo...</p>
            </div>
          )}

          {error && (
            <div className="text-destructive p-3 border border-destructive/50 rounded-md bg-destructive/10">
              <p>{error}</p>
            </div>
          )}

          {refinedResult && !isLoading && (
            <div>
              <label htmlFor="refinedText" className="block text-sm font-medium text-muted-foreground mb-1">Suggested Refinement</label>
              <Textarea id="refinedText" value={refinedResult.refinedTodoListItem} readOnly rows={4} />
              {refinedResult.isDistinct ? (
                 <Badge variant="default" className="mt-2 bg-green-100 text-green-700 border-green-300">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Offers distinct & clearer instructions
                </Badge>
              ) : (
                <Badge variant="secondary" className="mt-2 bg-yellow-100 text-yellow-700 border-yellow-300">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Suggestion is similar to original
                </Badge>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            type="button"
            onClick={handleUseRefinedText}
            disabled={isLoading || !refinedResult}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Use This Text
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
