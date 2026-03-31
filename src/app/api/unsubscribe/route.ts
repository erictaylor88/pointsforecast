import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return new NextResponse(unsubscribePage("Missing email parameter."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return new NextResponse(
      unsubscribePage("Service temporarily unavailable. Please try again later."),
      { status: 503, headers: { "Content-Type": "text/html" } }
    );
  }

  const { error } = await supabase
    .from("email_subscribers")
    .delete()
    .eq("email", email);

  if (error) {
    console.error("Unsubscribe error:", error);
    return new NextResponse(
      unsubscribePage("Something went wrong. Please try again."),
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }

  return new NextResponse(
    unsubscribePage("You've been unsubscribed from PointsForecast alerts. You won't receive any more emails."),
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}

function unsubscribePage(message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Unsubscribe — PointsForecast</title>
  <style>
    body { margin: 0; padding: 40px 16px; background: #FAFAF8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; color: #1A1A1A; display: flex; justify-content: center; }
    .card { max-width: 480px; width: 100%; background: #fff; border: 1px solid #E2E0DB; border-radius: 12px; padding: 32px; text-align: center; }
    h1 { font-size: 20px; font-weight: 600; margin: 0 0 12px; }
    p { font-size: 15px; color: #6B6B6B; margin: 0 0 24px; line-height: 1.6; }
    a { display: inline-block; padding: 10px 24px; background: #0F3D8C; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Unsubscribe</h1>
    <p>${message}</p>
    <a href="https://pointsforecast.vercel.app">Back to Dashboard</a>
  </div>
</body>
</html>`;
}
