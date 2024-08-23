import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Medicine from "@/models/Medicine";

// Ensure mongoose connection
mongoose.connect(process.env.MONGODB_URI!, {})
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

// POST: Create a new Medicine object
export async function POST(request: Request) {
  try {
    const { rfidUID, medicineName, quantity } = await request.json();

    // Create a new batch in the database
    const newBatch = new Medicine({
      batchId: rfidUID,
      medicineName,
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

// PATCH: Update an existing Medicine object
export async function PATCH(request: Request) {
  try {
    const { rfidUID, updateData } = await request.json();

    // Find the existing batch by rfidUID and update it
    const updatedBatch = await Medicine.findOneAndUpdate(
      { batchId: rfidUID },
      { $set: updateData },
      { new: true }
    );

    if (!updatedBatch) {
      return NextResponse.json(
        { success: false, message: "Batch not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Batch updated successfully",
      batchId: rfidUID,
      updatedBatch,
    });
  } catch (error) {
    console.error("Error updating batch:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update batch" },
      { status: 500 }
    );
  }
}
