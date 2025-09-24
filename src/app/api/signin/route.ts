import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectToDB();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signToken({ id: user._id.toString(), email: user.email });

    // Create response and set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: "Sign in successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

    // Set cookie (HTTP-only, secure in production)
    response.cookies.set({
      name: "jwt-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    return response;
  } catch (error) {
    console.log("Sign in error:", error);
    return NextResponse.json(
      { error: "Sign in failed" },
      { status: 500 }
    );
  }
}
