import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");
  const isRegistration = searchParams.get("registration") === "true";

  if (provider === "google") {
    return NextResponse.json({ 
      redirectUrl: `${process.env.API_URL}/auth/google.com?registration=${isRegistration}` 
    });
  }

  if (provider === "enterprise") {
    return NextResponse.json({ 
      redirectUrl: `${process.env.WEB_URL}/login/enterprise` 
    });
  }

  return NextResponse.json({ error: "Invalid auth provider" }, { status: 400 });
} 