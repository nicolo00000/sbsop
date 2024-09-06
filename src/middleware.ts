import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/(api|trpc)(.*)',
  '/api/webhooks/stripe'
]);

export default clerkMiddleware((auth, req, evt) => {
  if (isPublicRoute(req)) {
    return;
  }
  // Continue with default behavior for all other routes
});

export const config = {
  matcher: [
    '/((?!_next/image|_next/static|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/(api|trpc)(.*)',
  ],
};