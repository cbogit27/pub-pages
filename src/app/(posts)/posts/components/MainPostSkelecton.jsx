export default function PostSkeleton() {
    return (
      <div className="max-w-4xl mx-auto px-4 animate-pulse">
        {/* Header Skeleton */}
        <header className="mb-8">
          <div className="flex items-center gap-2 md:gap-4 text-xs">
            <div className="h-4 w-24 bg-gray-800 rounded"></div>
            <span>•</span>
            <div className="h-4 w-20 bg-gray-800 rounded"></div>
            <span>•</span>
            <div className="h-4 w-16 bg-gray-800 rounded"></div>
          </div>
        </header>
  
        {/* Image Skeleton */}
        <div className="relative h-48 md:h-64 lg:h-96 bg-slate-800 rounded mb-8"></div>
  
        {/* Title Skeleton */}
        <div className="h-8 w-3/4 bg-slate-800 rounded mb-4"></div>
  
        {/* Description Skeleton */}
        <div className="h-5 w-full bg-slate-800 rounded mb-2"></div>
        <div className="h-5 w-2/3 bg-gray-slate rounded mb-6"></div>
  
        {/* Content Skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-800 rounded"></div>
          <div className="h-4 w-full bg-slate-800 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-800 rounded"></div>
          <div className="h-4 w-2/3 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }
  