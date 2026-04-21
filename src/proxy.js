import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function proxy(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token?.role === "ADMIN") {
    return NextResponse.next();
  }

  const signInUrl = new URL("/signin", request.url);
  signInUrl.searchParams.set("callbackUrl", request.nextUrl.href);

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
