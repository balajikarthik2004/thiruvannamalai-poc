import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Outlet, Link, createRootRouteWithContext, useRouter } from "@tanstack/react-router";
import "../styles.css";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center glass-card p-10 rounded-3xl">
        <div className="text-8xl font-serif text-transparent bg-clip-text gradient-saffron pb-2">ॐ</div>
        <h1 className="mt-4 text-3xl font-serif font-bold text-foreground">This path doesn't exist</h1>
        <p className="mt-3 text-base text-muted-foreground">The page you're looking for has wandered off, devotee 🙏</p>
        <Link to="/" className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover-lift shadow-md">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center glass-card p-10 rounded-3xl">
        <h1 className="text-2xl font-serif font-bold text-destructive">Unable to fetch data</h1>
        <p className="mt-3 text-base text-muted-foreground">Please try again, devotee 🙏</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover-lift shadow-md">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      {/* Renders each route's `head()` meta. Without this every tab showed the
          one title baked into index.html, however the route declared it. */}
      <HeadContent />
      <Outlet />
    </QueryClientProvider>
  );
}
