import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";
import { emailTemplates } from "@/templates/emailTemplates";

// Helper to generate random password
function generateRandomPassword(length = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();
    console.log(`[info] - name - ${name} - email - ${email}`)

    if (!name || !email) {
      return NextResponse.json({ error: "Username and email are required" }, { status: 400 });
    }

    await connectToDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Send email with password
    const template = emailTemplates.find(t => t.type === "signup");
    if (template) {
      await sendEmail(email, template.subject, template.body(name, password));
    }

    return NextResponse.json({ success: true, message: "User created and email sent." });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
