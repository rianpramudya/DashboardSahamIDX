'use client';

// Error boundary for dashboard
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="glass-card rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mb-6">
          {error.message || 'An unexpected error occurred while loading the dashboard.'}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground mb-4">
            Error ID: {error.digest}
          </p>
        )}
        <Button
          onClick={reset}
          className="gap-2"
          variant="outline"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
