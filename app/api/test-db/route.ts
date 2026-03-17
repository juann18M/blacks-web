import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT 1");

    return NextResponse.json({
      ok: true,
      result: rows
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error.message
    });
  }
}