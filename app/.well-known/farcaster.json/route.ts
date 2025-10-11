import { NextResponse } from "next/server";

export async function GET() {
  const farcasterManifest = {
    frame: {
      name: "MONSEND",
      version: "1",
      iconUrl: "https://monsend.vercel.app/images/icon.png",
      homeUrl: "https://monsend.vercel.app",
      imageUrl: "https://monsend.vercel.app/images/feed.png",
      splashImageUrl: "https://monsend.vercel.app/images/splash.png",
      splashBackgroundColor: "#fafafb",
      webhookUrl: "https://monsend.vercel.app/api/webhook",
      subtitle: "send monad tokens on farcaster",
      description: "Easily send monad tokens from your farcaster wallet to another wallet",
      primaryCategory: "finance",
      tags: [
        "monad",
        "send",
        "tokens",
        "wallet"
      ],
      ogTitle: "MONSEND - Send on Farcaster",
      ogDescription: "Easily send monad tokens from your farcaster wallet to another wallet"
    },
    accountAssociation: {
      header: "eyJmaWQiOjMyODE4MSwidHlwZSI6ImF1dGgiLCJrZXkiOiIweGI0Nzk3NzJmMjI5ODkwOTQ5NDcwOTA2YmUxMGIyM0Y3ZjdhRTAwOTEifQ",
      payload: "eyJkb21haW4iOiJtb25zZW5kLnZlcmNlbC5hcHAifQ",
      signature: "9UOw2JmIcXgyoFavZT7I1rPA4ec5L2vfOyXBWOsUGJwek/ZJl6tNlNCzZAy37LxVBf1aGn7mv1/Nj8wzmmACnxw="
    }
  };

  return NextResponse.json(farcasterManifest);
}