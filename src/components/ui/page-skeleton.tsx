import { Skeleton } from '@/components/ui/skeleton';

interface PageSkeletonProps {
  rows?: number;
  className?: string;
}

export const PageSkeleton = ({ rows = 6, className }: PageSkeletonProps) => (
  <div className={`space-y-4 p-6 ${className ?? ''}`}>
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-4 w-1/2" />
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  </div>
);
