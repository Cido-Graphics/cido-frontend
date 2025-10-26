import { NextApiRequest, NextApiResponse } from "next";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ message: "Access token is required" });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/users/auth/kakao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.cookie || "",
      },
      body: JSON.stringify({ access_token }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Forward Set-Cookie headers from backend to client
    const anyHeaders = response.headers as any;
    const setCookies: string[] | undefined = anyHeaders.getSetCookie
      ? anyHeaders.getSetCookie()
      : undefined;
    if (setCookies && setCookies.length) {
      res.setHeader(
        "Set-Cookie",
        setCookies.map((c: string) => c.replace(/;\s*Domain=[^;]+/gi, ""))
      );
    } else {
      const single = response.headers.get("set-cookie");
      if (single) {
        const cleaned = single.replace(/;\s*Domain=[^;]+/gi, "");
        res.setHeader("Set-Cookie", cleaned);
      }
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Kakao auth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
