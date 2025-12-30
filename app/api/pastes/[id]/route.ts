import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Paste from "@/models/Paste";
import { now } from "@/lib/time";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // ✅ REQUIRED by Next.js
) {
    const { id } = await context.params; // ✅ REQUIRED

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const currentTime = now(req);

    const paste = await Paste.findOneAndUpdate(
        {
            _id: id,
            $and: [
                { $or: [{ expiresAt: null }, { expiresAt: { $gt: currentTime } }] },
                {
                    $or: [
                        { maxViews: null },
                        { $expr: { $lt: ["$views", "$maxViews"] } },
                    ],
                },
            ],
        },
        { $inc: { views: 1 } },
        { new: true }
    );

    if (!paste) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
        content: paste.content,
        remaining_views:
            paste.maxViews === null ? null : paste.maxViews - paste.views,
        expires_at: paste.expiresAt?.toISOString() ?? null,
    });
}
