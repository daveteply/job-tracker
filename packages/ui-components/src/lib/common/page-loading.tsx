export function PageLoading({ entityName }: { entityName: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-base-100/50 backdrop-blur-none z-50">
      <div>
        <span className="mr-2 capitalize">Loading {entityName}</span>
        <span className="loading loading-bars loading-xs text-primary"></span>
      </div>
    </div>
  );
}

export default PageLoading;
