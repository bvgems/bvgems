import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    console.error("Logout failed:", error.message);
    return NextResponse.json(
      { success: false, message: "Something went wrong during logout" },
      { status: 500 }
    );
  }
}
