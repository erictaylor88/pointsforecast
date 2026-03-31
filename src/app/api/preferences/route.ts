import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

interface PreferencesPayload {
  issuers?: string[]; // issuer slugs, empty = all
  partners?: string[]; // partner slugs, empty = all
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json(
      { error: "Missing email parameter." },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service temporarily unavailable." },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("email_subscribers")
    .select("id, email, issuer_preferences")
    .eq("email", email)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Subscriber not found. Please subscribe first." },
      { status: 404 }
    );
  }

  // Also fetch issuers and airline partners for the form
  const [{ data: issuers }, { data: partners }] = await Promise.all([
    supabase
      .from("issuers")
      .select("id, short_name, slug")
      .order("short_name"),
    supabase
      .from("partners")
      .select("id, short_name, slug, type")
      .eq("type", "airline")
      .order("short_name"),
  ]);

  return NextResponse.json({
    preferences: data.issuer_preferences ?? { issuers: [], partners: [] },
    issuers: issuers ?? [],
    partners: partners ?? [],
  });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const preferences: PreferencesPayload = body.preferences ?? {};

    if (!email) {
      return NextResponse.json(
        { error: "Missing email." },
        { status: 400 }
      );
    }

    // Validate structure
    const cleaned: PreferencesPayload = {
      issuers: Array.isArray(preferences.issuers)
        ? preferences.issuers.filter((s): s is string => typeof s === "string")
        : [],
      partners: Array.isArray(preferences.partners)
        ? preferences.partners.filter((s): s is string => typeof s === "string")
        : [],
    };

    const supabase = createServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Service temporarily unavailable." },
        { status: 503 }
      );
    }

    const { error } = await supabase
      .from("email_subscribers")
      .update({ issuer_preferences: cleaned as never })
      .eq("email", email);

    if (error) {
      console.error("Preferences update error:", error);
      return NextResponse.json(
        { error: "Failed to update preferences." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Preferences saved." });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
