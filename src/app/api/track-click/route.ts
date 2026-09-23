import { NextResponse } from "next/server";

export async function GET() {
  // This route is deprecated. All affiliate links now use /go/[slug]
  return new NextResponse("Gone", { status: 410 });
}
