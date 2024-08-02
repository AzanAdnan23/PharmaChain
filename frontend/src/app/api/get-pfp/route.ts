import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

// Connect to your MongoDB database
mongoose.connect(process.env.MONGODB_URI!, {
  // No additional options needed
});

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON data
    const { address } = await request.json();

    // Find the user by address
    const user = await User.findOne({ address });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Return the pfpURL
    return NextResponse.json({ pfpURL: user.pfpURL });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error retrieving user:", error.message);
      return NextResponse.json(
        { message: "Error retrieving user", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { message: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
