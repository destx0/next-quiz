import { NextResponse } from "next/server";
import admin from "../../../lib/firebaseAdmin";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const bucket = admin.storage().bucket();
    const fileName = `modified_images/${Date.now()}_${file.name}`;

    const fileUpload = bucket.file(fileName);
    await fileUpload.save(Buffer.from(buffer), {
      metadata: {
        contentType: file.type,
      },
    });

    await fileUpload.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
