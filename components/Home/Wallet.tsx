'use client'

import { useFrame } from '@/components/farcaster-provider'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { monadTestnet } from '@/lib/viem'
import { WalletBalance } from './WalletBalance'
import { SendTokens } from './SendTokens'

export function Wallet() {
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()

  // Not available in current client
  if (!isEthProviderAvailable) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 border border-[#333] rounded-md p-6 text-center">
          <h2 className="text-2xl font-bold">MONCAST</h2>
          <p className="text-sm text-gray-400">
            Wallet connection is only available via Warpcast or supported
            Farcaster clients
          </p>
        </div>
      </div>
    )
  }

  // Wallet not connected
  if (!isConnected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 border border-[#333] rounded-md p-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">MONCAST</h1>
            <p className="text-sm text-gray-400">
              Connect your Farcaster wallet to manage MON tokens
            </p>
          </div>

          <button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors"
            onClick={() => connect({ connector: miniAppConnector() })}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  // Wallet connected but wrong chain
  if (chainId !== monadTestnet.id) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 border border-[#333] rounded-md p-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">MONCAST</h1>
            <p className="text-sm text-gray-400">
              Please switch to Monad Testnet to continue
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-md text-sm">
              <p className="font-semibold">Wrong Network</p>
              <p className="text-xs mt-1">
                Current chain ID: {chainId}
              </p>
            </div>

            <button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors"
              onClick={() => switchChain({ chainId: monadTestnet.id })}
            >
              Switch to Monad Testnet
            </button>

            <button
              type="button"
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm"
              onClick={() => disconnect()}
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Wallet connected and on correct chain
  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4">
      <div className="w-full max-w-md space-y-6 py-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">MONCAST</h1>
          <p className="text-sm text-gray-400">
            Manage your MON tokens on Monad Testnet
          </p>
        </div>

        {/* Balance Section */}
        {address && <WalletBalance address={address} />}

        {/* Send Section */}
        <SendTokens />

        {/* Disconnect Button */}
        <button
          type="button"
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm"
          onClick={() => disconnect()}
        >
          Disconnect Wallet
        </button>
      </div>
    </div>
  )
}

