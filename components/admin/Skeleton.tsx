// components/admin/Skeleton.tsx
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function SkeletonText({ className = '' }: SkeletonProps) {
  return <Skeleton className={`h-4 ${className}`} />;
}

export function SkeletonCircle({ className = '' }: SkeletonProps) {
  return <Skeleton className={`rounded-full ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow animate-pulse">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
            <div className="h-8 w-32 bg-gray-300 rounded mb-4"></div>
            <div className="flex items-center mt-4">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="ml-4">
            <div className="size-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}