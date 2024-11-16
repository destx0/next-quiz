import { NextResponse } from "next/server";

const ADMIN_EMAILS = [
  "classcommon2@gmail.com",
  "iampulakghosh@gmail.com",
];

export function middleware(request) {
  const authToken = request.cookies.get("authToken");
  const userEmail = request.cookies.get("userEmail")?.value;

  // If no auth token, redirect to login
  if (
    !authToken &&
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/image-thing") ||
      request.nextUrl.pathname.startsWith("/upload") ||
      request.nextUrl.pathname.startsWith("/ssc-edit"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is authenticated but not an admin, block access to admin routes
  if (
    authToken &&
    !ADMIN_EMAILS.includes(userEmail) &&
    (request.nextUrl.pathname.startsWith("/upload") ||
      request.nextUrl.pathname.startsWith("/ssc-edit"))
  ) {
    // Redirect to unauthorized page or home
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/image-thing/:path*",
    "/upload/:path*",
    "/ssc-edit/:path*",
  ],
};
