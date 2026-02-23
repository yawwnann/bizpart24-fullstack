export function CategoryCardSkeleton() {
  return (
    <div className="h-full border border-gray-100 rounded-xl flex flex-col items-center justify-center p-4 text-center bg-white animate-pulse">
      {/* Icon Skeleton */}
      <div className="w-10 h-10 bg-gray-200 rounded-full mb-3" />
      
      {/* Text Skeleton */}
      <div className="h-3 bg-gray-200 rounded w-16" />
    </div>
  )
}
