export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "blacks" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });

  } catch (error) {
    console.error("🔥 Error uploading file:", error);

    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}