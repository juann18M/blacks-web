import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
export const runtime = "nodejs";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y password son obligatorios' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const [rows]: any = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Crear token USANDO EL MISMO SECRET
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // También enviar información del usuario
    return NextResponse.json(
      { 
        message: 'Login exitoso', 
        token,
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}