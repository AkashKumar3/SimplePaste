import type { NextRequest } from "next/server";

export function now(req: NextRequest): Date {
  if (process.env.TEST_MODE === "1") {
    const header = req.headers.get("x-test-now-ms");
    if (header && !isNaN(Number(header))) {
      return new Date(Number(header));
    }
  }
  return new Date();
}
