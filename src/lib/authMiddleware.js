// lib/authMiddleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const adminOnly = (handler) => async (request, context) => {
  try {
    const token = await getToken({ req: request });
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    if (token.role !== "ADMIN") return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    
    // Pass both request and context to the handler
    return handler(request, context);
  } catch (error) {
    return NextResponse.json({ error: "Authentication check failed" }, { status: 500 });
  }
};

export const authenticatedOnly = (handler) => async (request, context) => {
  try {
    const token = await getToken({ req: request });
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    return handler(request, context, token);
  } catch (error) {
    return NextResponse.json({ error: "Authentication check failed" }, { status: 500 });
  }
};