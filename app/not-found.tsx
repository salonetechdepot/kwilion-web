// app/not-found.tsx  (preferred in App Router)
export default function NotFound() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">
        The page you’re looking for doesn’t exist.
      </p>
    </div>
  );
}
