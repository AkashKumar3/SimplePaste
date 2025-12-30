import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Paste from "@/models/Paste";
import { now } from "@/lib/time";

type CreatePasteBody = {
    content?: unknown;
    ttl_seconds?: number;
    max_views?: number;
};

export async function POST(req: NextRequest) {
    await connectDB();

    const body: CreatePasteBody = await req.json();

    if (typeof body.content !== "string") {
        return Response.json({ error: "Invalid content" }, { status: 400 });
    }

    if (body.ttl_seconds !== undefined && body.ttl_seconds < 1) {
        return Response.json({ error: "Invalid ttl" }, { status: 400 });
    }

    if (body.max_views !== undefined && body.max_views < 1) {
        return Response.json({ error: "Invalid views" }, { status: 400 });
    }

    const currentTime = now(req);

    const expiresAt =
        body.ttl_seconds !== undefined
            ? new Date(currentTime.getTime() + body.ttl_seconds * 1000)
            : null;

    const paste = await Paste.create({
        content: body.content,
        expiresAt,
        maxViews: body.max_views ?? null,
    });

    return Response.json({
        id: paste._id.toString(),
        url: `/p/${paste._id}`,
    });
}
