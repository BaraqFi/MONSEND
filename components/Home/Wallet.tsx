'use client'

import {
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Moon,
  Sun,
  User as UserIcon,
  Wallet as WalletIcon,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'

import { useFrame } from '@/components/farcaster-provider'
import { NFTList } from '@/components/Home/NFTList'
import { SendTokens } from '@/components/Home/SendTokens'
import { TokenList } from '@/components/Home/TokenList'
import { TransactionHistory } from '@/components/Home/TransactionHistory'
import { WalletBalance } from '@/components/Home/WalletBalance'
import { useTheme } from '@/components/theme-provider'
import { monadTestnet } from '@/lib/viem'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'

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

  const bgColor = theme === 'dark' ? 'bg-[#0f0f23]' : 'bg-gray-50'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary =
    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const borderColor = theme === 'dark' ? 'border-[#16162e]' : 'border-gray-200'
  const accentColor = '#9333ea' // Purple 600

  // Not available in current client
  if (!isEthProviderAvailable) {
    return (
      <div
        className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgColor}`}
      >
        <div
          className={`w-full space-y-4 rounded-xl p-6 text-center ${cardBg}`}
        >
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
      <div
        className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgColor}`}
      >
        <div className={`w-full space-y-6 rounded-xl p-8 ${cardBg}`}>
          <div className="text-center space-y-3">
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: accentColor }}
            >
              <WalletIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className={`text-3xl font-bold ${textPrimary}`}>MONSEND</h1>
            <p className={`text-sm ${textSecondary}`}>
              Connect your Farcaster wallet to send MON tokens
            </p>
          </div>

          <button
            type="button"
            className="w-full font-semibold text-white py-4 px-4 rounded-xl transition-colors"
            style={{ backgroundColor: accentColor }}
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
      <div
        className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgColor}`}
      >
        <div className={`w-full space-y-6 rounded-xl p-6 ${cardBg}`}>
          <div className="text-center space-y-2">
            <h1 className={`text-2xl font-bold ${textPrimary}`}>
              Wrong Network
            </h1>
            <p className={`text-sm ${textSecondary}`}>
              Please switch to Monad Testnet to continue
            </p>
          </div>

          <div className="space-y-4">
            <div
              className={`${
                theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100'
              } border ${
                theme === 'dark' ? 'border-yellow-500/50' : 'border-yellow-400'
              } ${
                theme === 'dark' ? 'text-yellow-200' : 'text-yellow-900'
              } rounded-lg px-4 py-3 text-sm`}
            >
              <p className="font-semibold">Current chain ID: {chainId}</p>
              <p className="mt-1 text-xs">Expected: {monadTestnet.id}</p>
            </div>

            <button
              type="button"
              className="w-full font-semibold text-white py-3 px-4 rounded-xl transition-colors"
              style={{ backgroundColor: accentColor }}
              onClick={() => switchChain({ chainId: monadTestnet.id })}
            >
              Switch to Monad Testnet
            </button>

            <button
              type="button"
              className={`w-full font-semibold py-2 px-4 rounded-xl transition-colors text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
              }`}
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
      <div className="w-full">
        {/* Profile Section */}
        <div className="space-y-4 p-6 text-center">
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            {context?.user?.pfpUrl ? (
              <img
                src={context.user.pfpUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="h-12 w-12 text-white" />
            )}
          </div>

          <div className="flex items-center justify-center space-x-2">
            <p className={`${textSecondary} font-mono text-sm`}>
              {address?.slice(0, 6)}...{address?.slice(-6)}
            </p>
            <button
              type="button"
              className="rounded p-1 hover:bg-purple-600/20"
              onClick={() => {
                if (address) {
                  navigator.clipboard.writeText(address)
                }
              }}
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="ml-2 rounded p-1 hover:bg-purple-600/20"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>

          <div
            className={`inline-flex items-center space-x-2 rounded-full px-4 py-2 border ${
              theme === 'dark'
                ? 'bg-purple-600/20 border-purple-600/50'
                : 'bg-purple-600/10 border-purple-600/30'
            }`}
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />
            <span className="text-sm font-semibold text-purple-400">
              MONAD TESTNET
            </span>
          </div>
        </div>

        {/* Balance Display */}
        {address && (
          <WalletBalance
            address={address}
            refreshTrigger={balanceRefreshTrigger}
          />
        )}

        {/* Action Buttons */}
        <div className="px-6 py-4">
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="flex flex-col items-center space-y-2 group"
              onClick={() => setActiveModal('send')}
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: accentColor }}
              >
                <ArrowUpRight className="h-8 w-8 text-white" />
              </div>
              <span className={`text-sm font-medium ${textSecondary}`}>
                Send
              </span>
            </button>

            <button
              type="button"
              className="flex flex-col items-center space-y-2 group"
              onClick={() => setActiveModal('deposit')}
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: accentColor }}
              >
                <ArrowDownLeft className="h-8 w-8 text-white" />
              </div>
              <span className={`text-sm font-medium ${textSecondary}`}>
                Deposit
              </span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`border-t ${borderColor}`}>
          <div className="flex">
            <button
              type="button"
              className={`relative flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'coins'
                  ? 'text-purple-400'
                  : `${textSecondary} hover:text-white`
              }`}
              onClick={() => setActiveTab('coins')}
            >
              Coins
              {activeTab === 'coins' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />
              )}
            </button>
            <button
              type="button"
              className={`relative flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'nfts'
                  ? 'text-purple-400'
                  : `${textSecondary} hover:text-white`
              }`}
              onClick={() => setActiveTab('nfts')}
            >
              NFTs
              {activeTab === 'nfts' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />
              )}
            </button>
            <button
              type="button"
              className={`relative flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'transactions'
                  ? 'text-purple-400'
                  : `${textSecondary} hover:text-white`
              }`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
              {activeTab === 'transactions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px] p-4">
          {activeTab === 'coins' && address && (
            <TokenList
              address={address}
              refreshTrigger={balanceRefreshTrigger}
            />
          )}

          {activeTab === 'nfts' && address && <NFTList address={address} />}

          {activeTab === 'transactions' && address && (
            <TransactionHistory address={address} />
          )}
        </div>
      </div>

      {/* Send Modal */}
      {activeModal === 'send' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 sm:items-center">
          <div
            className={`${cardBg} max-h-[90vh] w-full overflow-y-auto rounded-t-2xl sm:max-w-md sm:rounded-2xl`}
          >
            <div
              className={`sticky top-0 flex items-center justify-between border-b p-4 ${borderColor} ${cardBg}`}
            >
              <h2 className={`text-xl font-bold ${textPrimary}`}>
                Send Tokens
              </h2>
              <button
                type="button"
                className={`text-2xl ${textSecondary} hover:${textPrimary}`}
                onClick={() => setActiveModal(null)}
              >
                <X className="h-6 w-6" />
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 sm:items-center">
          <div
            className={`${cardBg} w-full rounded-t-2xl p-6 sm:max-w-md sm:rounded-2xl`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className={`text-xl font-bold ${textPrimary}`}>
                Deposit MON
              </h2>
              <button
                type="button"
                className={`text-2xl ${textSecondary} hover:${textPrimary}`}
                onClick={() => setActiveModal(null)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4 text-center">
              <div
                className={`${
                  theme === 'dark' ? 'bg-white' : 'bg-gray-100'
                } rounded-lg p-4`}
              >
                <p
                  className={`${
                    theme === 'dark' ? 'text-black' : 'text-gray-800'
                  } break-all font-mono text-sm`}
                >
                  {address}
                </p>
              </div>
              <p className={`text-sm ${textSecondary}`}>
                Send MON tokens to this address on Monad Testnet
              </p>
              <button
                type="button"
                className="w-full py-3 text-white rounded-lg"
                style={{ backgroundColor: accentColor }}
                onClick={() => {
                  navigator.clipboard.writeText(address)
                }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Copy className="h-4 w-4" />
                  <span>Copy Address</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
