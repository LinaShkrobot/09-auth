import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import api from "@/lib/api/api";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateRoute) {
    const cookieHeader = request.cookies
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    try {
      const response = await api.get("/auth/session", {
        headers: {
          Cookie: cookieHeader,
        },
      });

      if (!response.data.success) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      const setCookieHeader = response.headers["set-cookie"];

      if (setCookieHeader) {
        const redirectResponse = NextResponse.redirect(request.url);
        const cookies = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];
        cookies.forEach((cookie) => {
          redirectResponse.headers.append("Set-Cookie", cookie);
        });
        return redirectResponse;
      }

      return NextResponse.next();
    } catch (error) {
      console.error(
        "Session check failed for private route:",
        error instanceof Error ? error.message : error
      );
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (isAuthRoute) {
    const cookieHeader = request.cookies
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    try {
      const response = await api.get("/auth/session", {
        headers: {
          Cookie: cookieHeader,
        },
      });

      if (response.data.success) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error(
        "Session check failed for auth route:",
        error instanceof Error ? error.message : error
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
