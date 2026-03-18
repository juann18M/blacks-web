import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [rows]: any = await db.query("SELECT * FROM editorial LIMIT 1");

    return NextResponse.json(rows[0] || {});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error editorial" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();

    await db.query(
      `UPDATE editorial SET 
        bloque1_imagen = ?, 
        bloque1_titulo = ?, 
        bloque1_descripcion = ?, 
        bloque2_imagen = ?, 
        bloque2_titulo = ?, 
        bloque2_descripcion = ?, 
        bloque3_imagen = ?, 
        bloque3_titulo = ?, 
        bloque3_descripcion = ?
      WHERE id = 1`,
      [
        data.bloque1_imagen,
        data.bloque1_titulo,
        data.bloque1_descripcion,
        data.bloque2_imagen,
        data.bloque2_titulo,
        data.bloque2_descripcion,
        data.bloque3_imagen,
        data.bloque3_titulo,
        data.bloque3_descripcion,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error editorial" }, { status: 500 });
  }
}