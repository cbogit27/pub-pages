export default function OtherPostsSkeleton({count = 3}) {
    return (
      <div className="space-y-8 animate-pulse">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="flex gap-4">
            {/* Image Placeholder */}
            <div className="w-[100px] h-[100px] bg-slate-800 rounded"></div>
  
            {/* Text Placeholder */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-slate-800 rounded"></div>
              <div className="h-3 w-1/2 bg-slate-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  