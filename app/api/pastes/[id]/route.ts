import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Paste from "@/models/Paste";
import { now } from "@/lib/time";

type Params = {
    params: {
        id: string;
    };
};

export async function GET(req: NextRequest, { params }: Params) {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }

    const currentTime = now(req);

    const paste = await Paste.findOneAndUpdate(
        {
            _id: params.id,
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
        return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({
        content: paste.content,
        remaining_views:
            paste.maxViews === null ? null : paste.maxViews - paste.views,
        expires_at: paste.expiresAt?.toISOString() ?? null,
    });
}
