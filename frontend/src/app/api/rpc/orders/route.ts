import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import RfidTag from '@/models/RfidTag';

export async function POST(req: Request) {
  await dbConnect();

  const { product, quantity, rfidTag, organizationId } = await req.json();
  try {
    const order = new Order({
      product,
      quantity,
      status: 'Being Manufactured',
      rfidTag,
      organization: organizationId,
    });
    
    await order.save();

    const tag = new RfidTag({
      tagId: rfidTag,
      order: order._id,
      location: 'Manufacturer',
    });

    await tag.save();

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
