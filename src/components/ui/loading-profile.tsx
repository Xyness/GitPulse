import { Skeleton } from "./skeleton";

export function LoadingProfile() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-64" />
          <div className="flex gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </div>

      <Skeleton className="h-10 w-full max-w-lg" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-lg" />
        <Skeleton className="h-80 rounded-lg" />
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}
