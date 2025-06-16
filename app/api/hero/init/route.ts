import { initializeHeroData } from "@/lib/hero-init"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await initializeHeroData()
    return NextResponse.json({ message: "Hero data initialized successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error initializing hero data:", error)
    return NextResponse.json({ message: "Failed to initialize hero data", error: error }, { status: 500 })
  }
}
