export default function PulseLoader({ count = 1 }) {
  return (
    <div className="py-12 md:py-8">
      <div className="h-9 w-56 mx-auto my-8 md:mb-8 rounded bg-slate-800 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4 animate-pulse">
        {[...Array(count)].map((_, index) => (
          <article key={index} className="rounded shadow-md overflow-hidden">
            <div className="h-48 w-full bg-slate-800"></div>
            <div className="p-4 space-y-8">
              <div className="h-3 w-24 bg-slate-800 rounded"></div>
              <div className="space-y-3">
                <div className="h-6 w-5/6 bg-slate-800 rounded"></div>
                <div className="h-6 w-2/3 bg-slate-800 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-800 rounded"></div>
                <div className="h-4 w-11/12 bg-slate-800 rounded"></div>
                <div className="h-4 w-3/4 bg-slate-800 rounded"></div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="h-3 w-24 bg-slate-800 rounded"></div>
                <div className="h-6 w-20 bg-slate-800 rounded"></div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
