import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create default tenant for the user
    const tenant = await prisma.tenants.create({
      data: {
        id: crypto.randomUUID(),
        name: `${name}'s Organization`,
        slug: `${email.split('@')[0]}-${Date.now()}`,
        plan: 'free',
        updatedAt: new Date(),
      },
    });

    // Create user
    const user = await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        name,
        email,
        password: hashedPassword,
        role: 'BUYER', // Default role
        tenantId: tenant.id,
        emailVerified: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}

