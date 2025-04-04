import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const response = await fetch(`${process.env.API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();
    const responseData = text ? JSON.parse(text) : null;

    if (!response.ok) {
      return NextResponse.json(
        {
          error: Array.isArray(responseData)
            ? responseData
            : [responseData?.toString() || "Signup failed"],
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      redirectUrl: `${process.env.WEB_URL}/register/verify?email=${data.user.email}`,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: [err instanceof Error ? err.message : "Failed to sign up"] },
      { status: 500 },
    );
  }
}
