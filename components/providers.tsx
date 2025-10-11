'use client'

import { FrameProvider } from '@/components/farcaster-provider'
import { WalletProvider } from '@/components/wallet-provider'
import { ThemeProvider } from '@/components/theme-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <WalletProvider>
        <FrameProvider>{children}</FrameProvider>
      </WalletProvider>
    </ThemeProvider>
  )
}
