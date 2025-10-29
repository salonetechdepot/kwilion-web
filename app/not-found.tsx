export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-semibold">404</h1>
        <p className="text-muted-foreground mt-2">Page not found</p>
        <a
          href="/"
          className="inline-block mt-6 px-4 py-2 rounded bg-primary text-primary-foreground"
        >
          Return Home
        </a>
      </div>
    </main>
  );
}
