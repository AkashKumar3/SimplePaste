import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Paste from "@/models/Paste";
import { now } from "@/lib/time";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function PastePage({ params }: PageProps) {
    const { id } = await params;
    await connectDB();

    const paste = await Paste.findById(id);

    if (!paste) notFound();

    if (paste.expiresAt && paste.expiresAt < now()) {
        notFound();
    }

    return (
        <div style={styles.container}>
            <h1>Paste</h1>

            <pre style={styles.content}>{paste.content}</pre>

            <div style={styles.meta}>
                <span>
                    Created: {new Date(paste.createdAt).toLocaleString()}
                </span>
                <span>
                    Expires:{" "}
                    {paste.expiresAt
                        ? new Date(paste.expiresAt).toLocaleString()
                        : "Never"}
                </span>
                <span>
                    Max views: {paste.maxViews ?? "Unlimited"}
                </span>
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: 800,
        margin: "40px auto",
        padding: 20,
        fontFamily: "system-ui",
    },
    content: {
        background: "#f4f4f4",
        padding: 15,
        whiteSpace: "pre-wrap" as const,
        wordBreak: "break-word" as const,
        fontFamily: "monospace",
        fontSize: 14,
    },
    meta: {
        marginTop: 15,
        display: "flex",
        flexDirection: "column" as const,
        gap: 4,
        color: "#555",
        fontSize: 13,
    },
};
