import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

mongoose.connect(process.env.MONGODB_URI!, {})
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON data
    const { address, pfpURL } = await request.json();

    // Create a new user record
    const user = new User({
      address,
      pfpURL,
    });

    // Save the user to the database
    await user.save();

    // Send a success response
    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    // Narrow the type of 'error' to 'Error'
    if (error instanceof Error) {
      console.error("Error saving user:", error.message);

      // Send an error response with the error message
      return NextResponse.json(
        { message: "Error registering user", error: error.message },
        { status: 500 }
      );
    } else {
      // Handle cases where the error is not an instance of Error
      console.error("Unexpected error", error);

      return NextResponse.json(
        { message: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
