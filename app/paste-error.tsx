import Link from "next/link";

// app/paste-error.tsx
export default function PasteError({ message }: { message: string }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md text-center bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-4xl font-extrabold text-red-600 mb-4">⚠️ Paste Expired</h1>
                <p className="text-gray-700 mb-6">{message}</p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                    Create a new paste
                </Link>
            </div>
        </div>
    );
}
