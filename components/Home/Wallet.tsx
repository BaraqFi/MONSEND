'use client'

import { useFrame } from '@/components/farcaster-provider'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { monadTestnet } from '@/lib/viem'
import { WalletBalance } from './WalletBalance'
import { SendTokens } from './SendTokens'
import { TokenList } from './TokenList'
import { NFTList } from './NFTList'
import { TransactionHistory } from './TransactionHistory'
import { useState } from 'react'

type Tab = 'coins' | 'nfts' | 'transactions'
type Modal = 'send' | 'deposit' | null

export function Wallet() {
  const { isEthProviderAvailable, context } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()
  const [activeTab, setActiveTab] = useState<Tab>('coins')
  const [activeModal, setActiveModal] = useState<Modal>(null)
  const [balanceRefreshTrigger, setBalanceRefreshTrigger] = useState(0)

  // Handle transaction success
  const handleTransactionSuccess = () => {
    setBalanceRefreshTrigger((prev) => prev + 1)
    setActiveModal(null)
  }

  // Not available in current client
  if (!isEthProviderAvailable) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0f0f23]">
        <div className="w-full max-w-md space-y-4 border border-purple-500/30 rounded-xl p-6 text-center bg-[#16162e]">
          <h2 className="text-2xl font-bold text-white">MONSEND</h2>
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
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0f0f23]">
        <div className="w-full max-w-md space-y-6 border border-purple-500/30 rounded-xl p-8 bg-[#16162e]">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-purple-600 rounded-full mx-auto flex items-center justify-center">
              <span className="text-4xl">👛</span>
            </div>
            <h1 className="text-3xl font-bold text-white">MONSEND</h1>
            <p className="text-sm text-gray-400">
              Connect your Farcaster wallet to send MON tokens
            </p>
          </div>

          <button
            type="button"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-4 rounded-xl transition-colors"
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
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0f0f23]">
        <div className="w-full max-w-md space-y-6 border border-purple-500/30 rounded-xl p-6 bg-[#16162e]">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">Wrong Network</h1>
            <p className="text-sm text-gray-400">
              Please switch to Monad Testnet to continue
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-900/30 border border-yellow-500/50 text-yellow-200 px-4 py-3 rounded-lg text-sm">
              <p className="font-semibold">Current chain ID: {chainId}</p>
              <p className="text-xs mt-1">Expected: {monadTestnet.id}</p>
            </div>

            <button
              type="button"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              onClick={() => switchChain({ chainId: monadTestnet.id })}
            >
              Switch to Monad Testnet
            </button>

            <button
              type="button"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors text-sm"
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
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <div className="w-full max-w-md mx-auto">
        {/* Profile Section */}
        <div className="p-6 text-center space-y-4">
          {/* User Avatar */}
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            {context?.user?.pfpUrl ? (
              <img
                src={context.user.pfpUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">👤</span>
            )}
          </div>

          {/* Address */}
          <div className="flex items-center justify-center space-x-2">
            <p className="text-gray-400 font-mono text-sm">
              {address?.slice(0, 6)}...{address?.slice(-6)}
            </p>
            <button
              type="button"
              className="p-1 hover:bg-purple-500/20 rounded"
              onClick={() => {
                if (address) {
                  navigator.clipboard.writeText(address)
                }
              }}
            >
              📋
            </button>
          </div>

          {/* Network Badge */}
          <div className="inline-flex items-center space-x-2 bg-purple-600/20 border border-purple-500/50 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-purple-300">
              MONAD TESTNET
            </span>
          </div>
        </div>

        {/* Balance Display */}
        {address && (
          <WalletBalance address={address} refreshTrigger={balanceRefreshTrigger} />
        )}

        {/* Action Buttons */}
        <div className="px-6 py-4">
          <div className="flex justify-center space-x-8">
            <button
              type="button"
              className="flex flex-col items-center space-y-2 group"
              onClick={() => setActiveModal('send')}
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                <span className="text-3xl">↗️</span>
              </div>
              <span className="text-sm font-medium text-gray-300">Send</span>
            </button>

            <button
              type="button"
              className="flex flex-col items-center space-y-2 group"
              onClick={() => setActiveModal('deposit')}
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                <span className="text-3xl">↙️</span>
              </div>
              <span className="text-sm font-medium text-gray-300">Deposit</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-purple-500/20">
          <div className="flex">
            <button
              type="button"
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                activeTab === 'coins'
                  ? 'text-purple-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('coins')}
            >
              Coins
              {activeTab === 'coins' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
              )}
            </button>
            <button
              type="button"
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                activeTab === 'nfts'
                  ? 'text-purple-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('nfts')}
            >
              NFTs
              {activeTab === 'nfts' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
              )}
            </button>
            <button
              type="button"
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                activeTab === 'transactions'
                  ? 'text-purple-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
              {activeTab === 'transactions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 min-h-[300px]">
          {activeTab === 'coins' && address && (
            <div className="space-y-4">
              <div className="text-center py-8 space-y-2">
                <p className="text-gray-400 text-sm">Native Token</p>
                <p className="text-2xl font-bold text-white">MON (Monad)</p>
                <p className="text-sm text-gray-500">
                  Balance displayed above
                </p>
              </div>
              
              <div className="border-t border-purple-500/20 pt-4">
                <TokenList address={address} />
              </div>
            </div>
          )}

          {activeTab === 'nfts' && address && <NFTList address={address} />}

          {activeTab === 'transactions' && address && (
            <TransactionHistory address={address} />
          )}
        </div>
      </div>

      {/* Send Modal */}
      {activeModal === 'send' && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50">
          <div className="bg-[#16162e] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#16162e] border-b border-purple-500/20 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Send MON</h2>
              <button
                type="button"
                className="text-2xl hover:text-gray-400"
                onClick={() => setActiveModal(null)}
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <SendTokens onTransactionSuccess={handleTransactionSuccess} />
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {activeModal === 'deposit' && address && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50">
          <div className="bg-[#16162e] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Deposit MON</h2>
              <button
                type="button"
                className="text-2xl hover:text-gray-400"
                onClick={() => setActiveModal(null)}
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-center">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-black font-mono text-sm break-all">
                  {address}
                </p>
              </div>
              <p className="text-sm text-gray-400">
                Send MON tokens to this address on Monad Testnet
              </p>
              <button
                type="button"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
                onClick={() => {
                  navigator.clipboard.writeText(address)
                }}
              >
                Copy Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
