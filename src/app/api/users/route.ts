import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-static'; // Optional: Enable static caching for this route

export async function GET() {
  try {
    await connectToDB();
    const users = await User.find();
    return NextResponse.json(users);
  } catch (error) {
    console.log('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}