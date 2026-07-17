import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDbSchema } from "@/lib/db-ensure";
import { isOwnerAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ok = await isOwnerAuthenticated();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  await ensureDbSchema();

  try {
    const where: Record<string, unknown> = {};
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { phone: { contains: q } },
      ];
    }

    const appointments = await db.appointment.findMany({
      where,
      orderBy: [{ preferredDate: "desc" }, { createdAt: "desc" }],
      take: 2000,
    });

    const byPhone = new Map<string, typeof appointments>();
    for (const a of appointments) {
      const list = byPhone.get(a.phone) ?? [];
      list.push(a);
      byPhone.set(a.phone, list);
    }

    const patients = Array.from(byPhone.entries()).map(([phone, appts]) => {
      const latest = appts[0];
      return {
        phone,
        name: latest.name,
        age: latest.age,
        totalVisits: appts.length,
        lastVisit: appts[0].preferredDate,
        appointments: appts,
      };
    });

    patients.sort((a, b) => b.totalVisits - a.totalVisits || b.lastVisit.localeCompare(a.lastVisit));

    return NextResponse.json({ patients });
  } catch (err) {
    console.error("[admin/patients] DB error:", err);
    return NextResponse.json({ patients: [] });
  }
}
