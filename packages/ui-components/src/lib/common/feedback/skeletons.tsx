'use client';

export function CardSkeleton() {
  return (
    <div className="card bg-base-300 card-sm shadow-sm">
      <div className="card-body">
        <div className="flex items-start justify-between gap-2">
          <div className="skeleton h-8 w-3/4"></div>
          <div className="skeleton h-8 w-8 rounded-full"></div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-5/6"></div>
          <div className="skeleton h-4 w-2/3"></div>
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="skeleton h-10 w-48"></div>
        <div className="skeleton h-8 w-32"></div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function PipelineSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <div className="skeleton h-10 w-48"></div>
      </div>
      <div className="-mx-1 flex flex-col items-start gap-6 px-1 pb-8 sm:flex-row sm:overflow-x-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full shrink-0 sm:w-72 md:w-80">
            <div className="bg-base-200/40 border-base-300/30 flex h-full flex-col gap-4 rounded-2xl border p-4 shadow-sm">
              <div className="flex items-center justify-between px-1">
                <div className="skeleton h-6 w-32"></div>
                <div className="skeleton h-4 w-8 rounded-full"></div>
              </div>
              <div className="flex-grow space-y-3">
                {[1, 2, 3].map((j) => (
                  <CardSkeleton key={j} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="space-y-8 pb-8">
      <div className="skeleton ml-1 h-10 w-48"></div>

      <section>
        <div className="skeleton mb-4 ml-1 h-8 w-32"></div>
        <div className="space-y-3">
          <div className="skeleton h-24 w-full"></div>
        </div>
      </section>

      <section>
        <div className="skeleton mb-4 ml-1 h-8 w-48"></div>
        <div className="space-y-3">
          <div className="skeleton h-24 w-full"></div>
          <div className="skeleton h-24 w-full"></div>
        </div>
      </section>

      <section>
        <div className="mb-4 ml-1 flex items-center justify-between">
          <div className="skeleton h-8 w-40"></div>
          <div className="skeleton h-6 w-24"></div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
