export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className}`} />
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-2 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  );
}
