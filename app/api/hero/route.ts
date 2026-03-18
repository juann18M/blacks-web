import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [rows]: any = await db.query("SELECT * FROM hero LIMIT 1");

    if (rows.length === 0) {
      return NextResponse.json({});
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener hero" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();

    await db.query(
      `UPDATE hero SET 
        titulo = ?, 
        subtitulo = ?, 
        imagen = ?, 
        imagen_mobile = ?
      WHERE id = 1`,
      [
        data.titulo,
        data.subtitulo,
        data.imagen,
        data.imagen_mobile,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar hero" }, { status: 500 });
  }
}