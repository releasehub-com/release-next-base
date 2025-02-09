import { NextResponse } from "next/server";
import { isValidVersion } from "@/config/versions";

export async function POST(request: Request) {
  try {
    const { version } = await request.json();

    if (!version || !isValidVersion(version)) {
      return NextResponse.json({ error: "Invalid version" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    // Set the cookie
    response.cookies.set("landing_version", version, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (err) {
    console.error("Version API error:", err);
    return NextResponse.json(
      { error: "Failed to set version" },
      { status: 500 },
    );
  }
}
