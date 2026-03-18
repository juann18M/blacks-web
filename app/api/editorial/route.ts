// app/api/editorial/route.js - VERSIÓN SOLO LECTURA
import { NextResponse } from 'next/server'

export const runtime = "nodejs";

// Datos estáticos (solo lectura)
const EDITORIAL_DATA = {
  bloque1_imagen: "/editorial1.jpg",
  bloque1_titulo: "NUEVA TEMPORADA",
  bloque1_descripcion: "Siluetas limpias y materiales premium diseñados para la nueva colección primavera verano.",
  bloque2_imagen: "/editorial2.jpg",
  bloque2_titulo: "ESTILO CONTEMPORÁNEO",
  bloque2_descripcion: "Diseños minimalistas inspirados en la arquitectura urbana.",
  bloque3_imagen: "/editorial3.jpg",
  bloque3_titulo: "ELEGANCIA MODERNA",
  bloque3_descripcion: "Prendas esenciales pensadas para el día a día."
}

export async function GET() {
  return NextResponse.json(EDITORIAL_DATA, {
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  })
}

// Elimina el PATCH o déjalo así:
export async function PATCH() {
  return NextResponse.json(
    { error: 'Operación no soportada en producción' },
    { status: 400 }
  )
}