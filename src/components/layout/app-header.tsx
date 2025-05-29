import { ListChecks } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <ListChecks className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-2xl font-semibold text-foreground">
          Routinely
        </h1>
      </div>
    </header>
  );
}
