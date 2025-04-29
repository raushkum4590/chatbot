import { generateResponse } from "@/app/utils/gemini";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ message: "Message is required" }, { status: 400 });
    }

    const response = await generateResponse(message);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
