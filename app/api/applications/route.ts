// app/api/applications/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session!.user!.email !== process.env.YOUR_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const applications = await prisma.application.findMany();
    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session!.user!.email !== process.env.YOUR_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const application = await prisma.application.create({
      data: {
        link: data.link,
        role: data.role,
        type: data.type,
        location: data.location,
        status: data.status,
        notes: data.notes,
        company: data.company,
      },
    });
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session!.user!.email !== process.env.YOUR_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const application = await prisma.application.findUnique({
      where: { id: data.id },
    });
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    await prisma.application.update({
      where: {
        id: data.id,
      },
      data: {
        link: data.link,
        role: data.role,
        type: data.type,
        location: data.location,
        status: data.status,
        notes: data.notes,
        company: data.company,
      },
    });

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
