"use client";
import Link from "next/link";
import { useState } from "react";
import { Copy, CopyCheck } from 'lucide-react';

type PastePayload = {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
};

type PasteResponse = {
  url?: string;
  error?: string;
};

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  async function submit() {
    setResult("");
    setCopied(false);

    if (!content) {
      setResult("Enter credentials");
      return;
    }

    const payload: PastePayload = { content };
    const ttlNum = Number(ttl);
    const maxViewsNum = Number(maxViews);

    if (ttl && ttlNum > 0) payload.ttl_seconds = ttlNum;
    if (maxViews && maxViewsNum > 0) payload.max_views = maxViewsNum;

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: PasteResponse = await res.json();
      setResult(data.url || data.error || "Unknown error");
    } catch {
      setResult("Request failed");
    }
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-10">
        📝 SimplePaste
      </h1>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <label className="block text-gray-700 font-medium text-lg mb-2">
          Your Paste
        </label>

        <textarea
          placeholder="Paste your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="w-full p-5 border border-gray-300 rounded-xl resize-none text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Expire in seconds (optional)
            </label>
            <input
              type="number"
              min={1}
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Max views (optional)
            </label>
            <input
              type="number"
              min={1}
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={submit}
          className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md"
        >
          Create Paste
        </button>

        {result && (
          <div className="mt-4 flex flex-row gap-3 justify-between rounded-xl border bg-gray-50 p-4">
            {result.startsWith("http") ? (
              <>
                <Link
                  href={result}
                  className="text-blue-600 font-medium break-words hover:underline"
                >
                  {result}
                </Link>

                <button
                  onClick={copyToClipboard}
                  className="self-start rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  {copied ? <CopyCheck /> : <Copy />}
                </button>
              </>
            ) : (
              <span className="text-red-600 font-medium">{result}</span>
            )}
          </div>
        )}
      </div>

      <p className="mt-12 text-gray-500 text-sm text-center">
        Developed by Akash Kumar
      </p>
    </div>
  );
}
