export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`rounded-xl bg-white border border-slate-200 p-5 shadow-sm animate-pulse ${className ?? ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-3.5 w-24 bg-slate-200 rounded" />
          <div className="mt-3 h-7 w-16 bg-slate-200 rounded" />
        </div>
        <div className="h-10 w-10 rounded-lg bg-slate-200" />
      </div>
      <div className="mt-3 h-3 w-32 bg-slate-100 rounded" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden animate-pulse">
      <div className="h-11 bg-slate-50 border-b border-slate-200" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-slate-100 last:border-0">
          <div className="h-4 w-4 rounded bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
          <div className="h-3.5 w-24 bg-slate-200 rounded" />
          <div className="h-3.5 w-16 bg-slate-200 rounded" />
          <div className="h-6 w-16 bg-slate-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white border border-slate-200 p-5 shadow-sm animate-pulse ${className ?? ""}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-slate-200" />
        <div className="space-y-1">
          <div className="h-3.5 w-24 bg-slate-200 rounded" />
          <div className="h-2.5 w-36 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="h-[180px] flex items-end gap-2 pt-4">
        {[40, 65, 30, 80, 55, 70, 45].map((h, i) => (
          <div key={i} className="flex-1 bg-slate-100 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm animate-pulse">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-2 flex-1">
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-3 w-20 bg-slate-100 rounded" />
        </div>
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="h-14 rounded-lg bg-slate-100" />
        <div className="h-14 rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}
