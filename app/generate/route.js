import { Ratelimit } from "@upstash/ratelimit";
import redis from "../../utils/redis";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.fixedWindow(30, "1440 m"),
      analytics: true,
    })
  : undefined;

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Rate Limiter Code
    if (ratelimit) {
      const headersList = headers(req);
      const ipIdentifier = headersList.get("x-real-ip");

      const result = await ratelimit.limit(ipIdentifier ?? "");

      if (!result.success) {
        return res.status(429).json({
          message: "Too many uploads in 1 day. Please try again in 24 hours.",
          "X-RateLimit-Limit": result.limit,
          "X-RateLimit-Remaining": result.remaining,
        });
      }
    }

    const { imageUrl, theme, room } = await req.body;

    try {
      const startResponse = await fetch(
        "https://api.replicate.com/v1/predictions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + process.env.REPLICATE_API_KEY,
          },
          body: JSON.stringify({
            version:
              "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
            input: {
              image: imageUrl,
              prompt:
                room === "Gaming Room"
                  ? "a room for gaming with gaming computers, gaming consoles, and gaming chairs"
                  : `a ${theme.toLowerCase()} ${room.toLowerCase()}`,
              a_prompt:
                "best quality, extremely detailed, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning",
              n_prompt:
                "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
            },
          }),
        }
      );

      const jsonStartResponse = await startResponse.json();

      const endpointUrl = jsonStartResponse.urls.get;

      let restoredImage = null;
      while (!restoredImage) {
        console.log("polling for result...");
        const finalResponse = await fetch(endpointUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + process.env.REPLICATE_API_KEY,
          },
        });
        const jsonFinalResponse = await finalResponse.json();

        if (jsonFinalResponse.status === "succeeded") {
          restoredImage = jsonFinalResponse.output;
        } else if (jsonFinalResponse.status === "failed") {
          break;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      return res.status(200).json(
        restoredImage ? restoredImage : "Failed to restore image"
      );
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
