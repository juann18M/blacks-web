// app/api/editorial/route.js
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const runtime = "nodejs";

// Datos iniciales
const DEFAULT_DATA = {
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

// Ruta del archivo donde guardaremos los datos
const DATA_FILE = path.join(process.cwd(), 'data', 'editorial.json')

// Función para asegurar que el archivo existe
async function ensureDataFile() {
  try {
    // Intentar leer el archivo
    await fs.access(DATA_FILE)
  } catch {
    // Si no existe, crear el directorio y archivo con datos por defecto
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2))
  }
}

// Función para leer datos
async function readData() {
  await ensureDataFile()
  const data = await fs.readFile(DATA_FILE, 'utf-8')
  return JSON.parse(data)
}

// Función para escribir datos
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const data = await readData()
    
    // Agregar headers para evitar caché
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error en GET:', error)
    // Si hay error, devolver datos por defecto
    return NextResponse.json(DEFAULT_DATA, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
  }
}

export async function PATCH(request: Request) {
  try {
    const updates = await request.json()
    
    // Leer datos actuales
    const currentData = await readData()
    
    // Actualizar solo los campos que vienen en el request
    const newData = { ...currentData, ...updates }
    
    // Guardar
    await writeData(newData)
    
    return NextResponse.json(newData, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error en PATCH:', error)
    return NextResponse.json(
      { error: 'Error actualizando datos' },
      { status: 500 }
    )
  }
}