import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Medicine from "@/models/Medicine";

mongoose.connect(process.env.MONGODB_URI!, {})
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

export async function POST(request: Request) {
  try {
    const { rfidUID, medicineName, quantity } = await request.json();

    // Create a new batch in the database
    const newBatch = new Medicine({
      batchId: rfidUID,
      medicineName,
      manufacturer: "Your Manufacturer Name",
      events: { batchCreated: true },
      timestamps: { batchCreatedAt: new Date() },
    });

    await newBatch.save();

    return NextResponse.json({
      success: true,
      message: "Batch created successfully",
      batchId: rfidUID,
    });
  } catch (error) {
    console.error("Error creating batch:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create batch" },
      { status: 500 }
    );
  }
}
