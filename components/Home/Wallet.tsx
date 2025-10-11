'use client'

import { useFrame } from '@/components/farcaster-provider'
import { useTheme } from '@/components/theme-provider'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { monadTestnet } from '@/lib/viem'
import { SendTokens } from './SendTokens'
import { TokenList } from './TokenList'
import { NFTList } from './NFTList'
import { TransactionHistory } from './TransactionHistory'
import { useState } from 'react'

type Tab = 'coins' | 'nfts' | 'transactions'
type Modal = 'send' | 'deposit' | null

export function Wallet() {
  const { isEthProviderAvailable, context } = useFrame()
  const { theme, toggleTheme } = useTheme()
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

  const bgColor = theme === 'dark' ? 'bg-[#2c2e30]' : 'bg-[#fafafb]'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-[#2c2e30]'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const borderColor = theme === 'dark' ? 'border-[#7564fb]/30' : 'border-[#7564fb]/20'

  // Not available in current client
  if (!isEthProviderAvailable) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgColor}`}>
        <div className={`w-full max-w-md space-y-4 ${borderColor} border rounded-xl p-6 text-center ${cardBg}`}>
          <h2 className={`text-2xl font-bold ${textPrimary}`}>MONSEND</h2>
          <p className={`text-sm ${textSecondary}`}>
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
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgColor}`}>
        <div className={`w-full max-w-md space-y-6 ${borderColor} border rounded-xl p-8 ${cardBg}`}>
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-[#7564fb] rounded-full mx-auto flex items-center justify-center">
              <span className="text-4xl">👛</span>
            </div>
            <h1 className={`text-3xl font-bold ${textPrimary}`}>MONSEND</h1>
            <p className={`text-sm ${textSecondary}`}>
              Connect your Farcaster wallet to send MON tokens
            </p>
          </div>

          <button
            type="button"
            className="w-full bg-[#7564fb] hover:bg-[#6454eb] text-white font-semibold py-4 px-4 rounded-xl transition-colors"
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
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgColor}`}>
        <div className={`w-full max-w-md space-y-6 ${borderColor} border rounded-xl p-6 ${cardBg}`}>
          <div className="text-center space-y-2">
            <h1 className={`text-2xl font-bold ${textPrimary}`}>Wrong Network</h1>
            <p className={`text-sm ${textSecondary}`}>
              Please switch to Monad Testnet to continue
            </p>
          </div>

          <div className="space-y-4">
            <div className={`${theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100'} border ${theme === 'dark' ? 'border-yellow-500/50' : 'border-yellow-400'} ${theme === 'dark' ? 'text-yellow-200' : 'text-yellow-900'} px-4 py-3 rounded-lg text-sm`}>
              <p className="font-semibold">Current chain ID: {chainId}</p>
              <p className="text-xs mt-1">Expected: {monadTestnet.id}</p>
            </div>

            <button
              type="button"
              className="w-full bg-[#7564fb] hover:bg-[#6454eb] text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              onClick={() => switchChain({ chainId: monadTestnet.id })}
            >
              Switch to Monad Testnet
            </button>

            <button
              type="button"
              className={`w-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} ${theme === 'dark' ? 'text-white' : 'text-[#2c2e30]'} font-semibold py-2 px-4 rounded-xl transition-colors text-sm`}
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
    <div className={`min-h-screen ${bgColor} ${textPrimary}`}>
      <div className="w-full max-w-md mx-auto">
        {/* Profile Section */}
        <div className="p-6 text-center space-y-4">
          {/* User Avatar */}
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-[#7564fb] to-blue-500 flex items-center justify-center">
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

          {/* Address & Theme Toggle */}
          <div className="flex items-center justify-center space-x-2">
            <p className={`${textSecondary} font-mono text-sm`}>
              {address?.slice(0, 6)}...{address?.slice(-6)}
            </p>
            <button
              type="button"
              className={`p-1 hover:bg-[#7564fb]/20 rounded`}
              onClick={() => {
                if (address) {
                  navigator.clipboard.writeText(address)
                }
              }}
            >
              📋
            </button>
            <button
              type="button"
              className={`p-1 hover:bg-[#7564fb]/20 rounded ml-2`}
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Network Badge */}
          <div className={`inline-flex items-center space-x-2 ${theme === 'dark' ? 'bg-[#7564fb]/20' : 'bg-[#7564fb]/10'} border ${theme === 'dark' ? 'border-[#7564fb]/50' : 'border-[#7564fb]/30'} rounded-full px-4 py-2`}>
            <div className="w-2 h-2 bg-[#7564fb] rounded-full animate-pulse" />
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-[#7564fb]' : 'text-[#7564fb]'}`}>
              MONAD TESTNET
            </span>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="px-6 py-4">
          <div className="flex justify-center space-x-8">
            <button
              type="button"
              className="flex flex-col items-center space-y-2 group"
              onClick={() => setActiveModal('send')}
            >
              <div className="w-16 h-16 bg-[#7564fb] rounded-full flex items-center justify-center group-hover:bg-[#6454eb] transition-colors">
                <span className="text-3xl">↗️</span>
              </div>
              <span className={`text-sm font-medium ${textSecondary}`}>Send</span>
            </button>

            <button
              type="button"
              className="flex flex-col items-center space-y-2 group"
              onClick={() => setActiveModal('deposit')}
            >
              <div className="w-16 h-16 bg-[#7564fb] rounded-full flex items-center justify-center group-hover:bg-[#6454eb] transition-colors">
                <span className="text-3xl">↙️</span>
              </div>
              <span className={`text-sm font-medium ${textSecondary}`}>Deposit</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`border-t ${borderColor}`}>
          <div className="flex">
            <button
              type="button"
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                activeTab === 'coins'
                  ? 'text-[#7564fb]'
                  : `${textSecondary} hover:${textPrimary}`
              }`}
              onClick={() => setActiveTab('coins')}
            >
              Coins
              {activeTab === 'coins' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7564fb]" />
              )}
            </button>
            <button
              type="button"
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                activeTab === 'nfts'
                  ? 'text-[#7564fb]'
                  : `${textSecondary} hover:${textPrimary}`
              }`}
              onClick={() => setActiveTab('nfts')}
            >
              NFTs
              {activeTab === 'nfts' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7564fb]" />
              )}
            </button>
            <button
              type="button"
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                activeTab === 'transactions'
                  ? 'text-[#7564fb]'
                  : `${textSecondary} hover:${textPrimary}`
              }`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
              {activeTab === 'transactions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7564fb]" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 min-h-[300px]">
          {activeTab === 'coins' && address && (
            <TokenList address={address} refreshTrigger={balanceRefreshTrigger} />
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
          <div className={`${cardBg} w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto`}>
            <div className={`sticky top-0 ${cardBg} border-b ${borderColor} p-4 flex items-center justify-between`}>
              <h2 className={`text-xl font-bold ${textPrimary}`}>Send Tokens</h2>
              <button
                type="button"
                className={`text-2xl ${textSecondary} hover:${textPrimary}`}
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
          <div className={`${cardBg} w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${textPrimary}`}>Deposit MON</h2>
              <button
                type="button"
                className={`text-2xl ${textSecondary} hover:${textPrimary}`}
                onClick={() => setActiveModal(null)}
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-center">
              <div className={`${theme === 'dark' ? 'bg-white' : 'bg-gray-100'} p-4 rounded-lg`}>
                <p className={`${theme === 'dark' ? 'text-black' : 'text-[#2c2e30]'} font-mono text-sm break-all`}>
                  {address}
                </p>
              </div>
              <p className={`text-sm ${textSecondary}`}>
                Send MON tokens to this address on Monad Testnet
              </p>
              <button
                type="button"
                className="w-full bg-[#7564fb] hover:bg-[#6454eb] text-white py-3 rounded-lg"
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
