export default function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-white/5" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-white/5 rounded w-3/4" />
            <div className="h-4 bg-white/5 rounded w-1/2" />
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-white/5 rounded-full" />
              <div className="h-5 w-12 bg-white/5 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
