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
    if (paste.expiresAt && paste.expiresAt < now()) notFound();

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12">
            {/* Header */}
            <div className="mx-auto mb-8 max-w-4xl text-center">
                <h1 className="text-4xl font-extrabold text-gray-900">
                    📝 SimplePaste
                </h1>
                <p className="mt-2 text-gray-500 text-sm">
                    Secure • Temporary • Shareable
                </p>
            </div>

            {/* Paste Card */}
            <div className="mx-auto max-w-4xl rounded-2xl bg-white shadow-xl overflow-hidden">
                {/* Content */}
                <div className="bg-gray-200 p-6">
                    <pre className="text-black text-md font-bold whitespace-pre-wrap wrap-break-words overflow-x-auto">
                        {paste.content}
                    </pre>
                </div>

                {/* Meta Info */}
                <div className="p-6 border-t space-y-3 text-sm text-gray-700">
                    <div className="flex flex-wrap justify-between gap-2">
                        <span className="font-medium text-gray-600">Created</span>
                        <span>{new Date(paste.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="flex flex-wrap justify-between gap-2">
                        <span className="font-medium text-gray-600">Views</span>
                        <span>{(paste.views).toLocaleString()}</span>
                    </div>

                    <div className="flex flex-wrap justify-between gap-2">
                        <span className="font-medium text-gray-600">Expires</span>
                        <span>
                            {paste.expiresAt
                                ? new Date(paste.expiresAt).toLocaleString()
                                : "Never"}
                        </span>

                    </div>

                    <div className="flex flex-wrap justify-between gap-2">
                        <span className="font-medium text-gray-600">Max Views</span>
                        <span>{paste.maxViews ?? "Unlimited"}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <p className="mt-12 text-center text-gray-500 text-sm">
                Developed by Akash Kumar
            </p>
        </div>
    );
}
