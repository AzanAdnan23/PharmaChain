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

// GET: Fetch a Medicine object by batchId
export async function GET(request: Request) {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop()!; // Extract the id from the URL path
  
      // Find the medicine by batchId
      const medicine = await Medicine.findOne({ batchId: id });
  
      if (!medicine) {
        return NextResponse.json(
          { success: false, message: "Batch not found" },
          { status: 404 }
        );
      }
  
      // Ensure the medicine object is correctly structured
      return NextResponse.json({
        success: true,
        medicine,
      });
    } catch (error) {
      console.error("Error fetching medicine data:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch medicine data" },
        { status: 500 }
      );
    }
  }  

// PATCH: Update qrScanned status
export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop()!; // Extract the id from the URL path

    const { qrScanned } = await request.json();

    // Log the received ID and data for debugging
    console.log("PATCH request ID:", id);
    console.log("PATCH request data:", { qrScanned });

    // Find the existing batch by ID and update qrScanned status
    const updatedBatch = await Medicine.findOneAndUpdate(
      { batchId: id },
      { $set: { "events.qrScanned": true, "timestamps.qrScannedAt": new Date() } },
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
      message: "QR scan status updated successfully",
      updatedBatch,
    });
  } catch (error) {
    console.error("Error updating QR scan status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update QR scan status" },
      { status: 500 }
    );
  }
}
