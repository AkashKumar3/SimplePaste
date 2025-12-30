"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState<string>("");
  const [result, setResult] = useState<string>("");

  async function submit() {
    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data: { url?: string; error?: string } = await res.json();
      setResult(data.url || data.error || "Unknown error");
    } catch {
      setResult("Request failed");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        cols={40}
      />
      <br />
      <button onClick={submit}>Create Paste</button>
      {result && <p>{result}</p>}
    </div>
  );
}
