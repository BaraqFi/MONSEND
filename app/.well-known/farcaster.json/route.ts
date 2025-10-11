import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
    version: "1",
    name: "Monad Wallet",
    description: "View and send MON tokens on Monad Testnet",
    icons: {
      app: {
        url: `${APP_URL}/images/icon.png`, // 512x512 PNG in public/images/icon.png
        background: "#000000",
      },
      square: {
        url: `${APP_URL}/images/icon-square.png`, // Optional 1024x1024 PNG
        background: "#000000",
      },
    },
    screenshots: [
      {
        url: `${APP_URL}/images/screenshot1.png`, // Add to public/images
        width: 390,
        height: 844,
      },
    ],
    category: "wallet",
    appUrl: `${APP_URL}/`,
    miniappUrl: `${APP_URL}/`,
    wallets: ["ewi"], // Enables EVM Wallet Integration for Monad
  };

  return NextResponse.json(farcasterConfig);
}