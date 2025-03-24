import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const adminOnly = (handler) => async (request) => {
  try {
    const token = await getToken({ req: request });
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    if (token.role !== "ADMIN") return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    return handler(request);
  } catch (error) {
    return NextResponse.json({ error: "Authentication check failed" }, { status: 500 });
  }
};

export const authenticatedOnly = (handler) => async (request) => {
  try {
    const token = await getToken({ req: request });
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    return handler(request, token);
  } catch (error) {
    return NextResponse.json({ error: "Authentication check failed" }, { status: 500 });
  }
};