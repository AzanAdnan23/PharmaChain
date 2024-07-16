import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Organization from '@/models/Organization';
import User from '@/models/User';

export async function POST(req: Request) {
  await dbConnect();

  const { name, address, contact, actors } = await req.json();
  try {
    const organization = new Organization({
      name,
      address,
      contact,
      actors,
    });
    
    await organization.save();

    for (const actor of actors) {
      const user = new User({
        email: actor.email,
        password: actor.password,
        role: actor.role,
        organization: organization._id,
      });
      await user.save();
    }

    return NextResponse.json(organization, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
