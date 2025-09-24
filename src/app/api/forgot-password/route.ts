import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";
import { emailTemplates } from "@/templates/emailTemplates";

// Helper: generate random password
function generateRandomPassword(length = 8) {
    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        await connectToDB();

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User with this email does not exist" },
                { status: 404 }
            );
        }

        // Generate new password
        const newPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in DB
        user.password = hashedPassword;
        await user.save();

        // Send email with new password
        const template = emailTemplates.find(t => t.type === "forgotPassword");
        if (template) {
            await sendEmail(email, template.subject, template.body(user.username, newPassword));
        }

        return NextResponse.json({
            success: true,
            message: "New password sent to your email",
        });
    } catch (error) {
        console.log("Forgot password error:", error);
        return NextResponse.json(
            { error: "Failed to reset password" },
            { status: 500 }
        );
    }
}
