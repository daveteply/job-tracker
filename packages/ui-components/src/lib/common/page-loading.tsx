export function PageLoading({ entityName }: { entityName: string }) {
  return (
    <div className="bg-base-100/50 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-none">
      <div>
        <span className="mr-2 capitalize">Loading {entityName}</span>
        <span className="loading loading-bars loading-xs text-primary"></span>
      </div>
    </div>
  );
}

export default PageLoading;
