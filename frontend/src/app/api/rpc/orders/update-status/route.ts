import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import RfidTag from '@/models/RfidTag';

export async function POST(req: Request) {
  await dbConnect();

  const { rfidTagId, location } = await req.json();
  try {
    const rfidTag = await RfidTag.findOne({ tagId: rfidTagId }).populate('order');
    if (!rfidTag) {
      throw new Error('RFID tag not found');
    }

    const order = rfidTag.order;
    let newStatus;

    switch (location) {
      case 'Manufacturer':
        newStatus = 'Being Manufactured';
        break;
      case 'Distributor':
        newStatus = 'Being Delivered';
        break;
      case 'Retailer':
        newStatus = 'Delivered';
        break;
      default:
        throw new Error('Invalid location');
    }

    order.status = newStatus;
    order.updatedAt = Date.now();
    await order.save();

    rfidTag.location = location;
    rfidTag.scannedAt = Date.now();
    await rfidTag.save();

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
