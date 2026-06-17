// Loading skeleton for dashboard
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-8 px-4 md:px-6 lg:px-8 py-6">
      {/* Hero skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4 max-w-lg" />
        <Skeleton className="h-6 w-1/2 max-w-md" />
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-[250px] md:h-[300px] lg:h-[350px] w-full" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border bg-card p-4 space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
