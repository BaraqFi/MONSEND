'use client'

import { ArrowLeft, CheckCircle, CircleDollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  isAddress,
  parseEther,
  parseUnits,
  type Address,
  formatUnits,
} from 'viem'
import {
  useAccount,
  useSendTransaction,
  useSwitchChain,
  useWriteContract,
} from 'wagmi'

import { useTheme } from '@/components/theme-provider'
import { monadTestnet, publicClient } from '@/lib/viem'

interface SendTokensProps {
  onTransactionSuccess?: () => void
}

interface Token {
  address: Address | 'native'
  symbol: string
  name: string
  decimals: number
  balance: string
  isNative?: boolean
}

const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export function SendTokens({ onTransactionSuccess }: SendTokensProps) {
  const { theme } = useTheme()
  const [step, setStep] = useState<'select' | 'send'>('select')
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [availableTokens, setAvailableTokens] = useState<Token[]>([])
  const [customTokenAddress, setCustomTokenAddress] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifiedToken, setVerifiedToken] = useState<Token | null>(null)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const { address, chainId } = useAccount()

  const cardBg = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary =
    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const inputBg = theme === 'dark' ? 'bg-[#16162e]' : 'bg-gray-100'
  const accentColor = '#9333ea' // Purple 600

  const { data: nativeHash, sendTransaction, isPending: isNativePending } =
    useSendTransaction()
  const { data: erc20Hash, writeContract, isPending: isErc20Pending } =
    useWriteContract()
  const { switchChain } = useSwitchChain()

  const isPending = isNativePending || isErc20Pending
  const hash = nativeHash || erc20Hash

  // Fetch available tokens on mount
  useEffect(() => {
    const fetchTokens = async () => {
      if (!address) return

      const tokens: Token[] = []

      // Add MON (native token)
      try {
        const monBalance = await publicClient.getBalance({ address })
        tokens.push({
          address: 'native',
          symbol: 'MON',
          name: 'Monad',
          decimals: 18,
          balance: formatUnits(monBalance, 18),
          isNative: true,
        })
      } catch (err) {
        console.error('Failed to fetch MON balance:', err)
      }

      // Add known ERC-20 tokens with balances
      const tokenAddresses: Address[] = [
        // Add known token addresses here
        // Example: '0x...' as Address,
      ]

      for (const tokenAddress of tokenAddresses) {
        try {
          const [balance, decimals, symbol, name] = await Promise.all([
            publicClient.readContract({
              address: tokenAddress,
              abi: ERC20_ABI,
              functionName: 'balanceOf',
              args: [address],
            }),
            publicClient.readContract({
              address: tokenAddress,
              abi: ERC20_ABI,
              functionName: 'decimals',
            }),
            publicClient.readContract({
              address: tokenAddress,
              abi: ERC20_ABI,
              functionName: 'symbol',
            }),
            publicClient.readContract({
              address: tokenAddress,
              abi: ERC20_ABI,
              functionName: 'name',
            }),
          ])

          tokens.push({
            address: tokenAddress,
            symbol,
            name,
            decimals,
            balance: formatUnits(balance, decimals),
            isNative: false,
          })
        } catch (err) {
          console.error(`Failed to fetch token ${tokenAddress}:`, err)
        }
      }

      setAvailableTokens(tokens)
    }

    fetchTokens()
  }, [address])

  // Verify custom token address
  const verifyTokenAddress = async () => {
    if (!customTokenAddress || !address) return

    if (!isAddress(customTokenAddress)) {
      setError('Invalid token address')
      return
    }

    setIsVerifying(true)
    setError(null)
    setVerifiedToken(null)

    try {
      const tokenAddress = customTokenAddress as Address

      const [balance, decimals, symbol, name] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [address],
        }),
        publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'decimals',
        }),
        publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'symbol',
        }),
        publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'name',
        }),
      ])

      const token: Token = {
        address: tokenAddress,
        symbol,
        name,
        decimals,
        balance: formatUnits(balance, decimals),
        isNative: false,
      }

      setVerifiedToken(token)

      // Check if balance is positive
      if (balance === BigInt(0)) {
        setError('You have zero balance of this token')
      }
    } catch (err) {
      setError(
        "Failed to verify token. Make sure it's a valid ERC-20 token."
      )
      console.error('Token verification error:', err)
    } finally {
      setIsVerifying(false)
    }
  }

  // Send tokens
  const sendTokens = async () => {
    if (!selectedToken || !recipient || !amount) {
      setError('Please fill in all fields')
      return
    }

    if (!isAddress(recipient)) {
      setError('Invalid recipient address')
      return
    }

    if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Invalid amount')
      return
    }

    // Check if amount exceeds balance
    if (Number(amount) > Number(selectedToken.balance)) {
      setError('Amount exceeds balance')
      return
    }

    // Ensure we're on Monad Testnet
    if (chainId !== monadTestnet.id) {
      try {
        await switchChain({ chainId: monadTestnet.id })
      } catch (err) {
        setError('Please switch to Monad Testnet')
        return
      }
    }

    setError(null)
    setIsSuccess(false)

    try {
      if (selectedToken.isNative) {
        // Send native MON
        sendTransaction(
          {
            to: recipient as Address,
            value: parseEther(amount),
          },
          {
            onSuccess: () => {
              setIsSuccess(true)
              setRecipient('')
              setAmount('')
              onTransactionSuccess?.()
            },
            onError: (err) => {
              setError(`Transaction failed: ${err.message}`)
            },
          }
        )
      } else {
        // Send ERC-20 token
        const amountInWei = parseUnits(amount, selectedToken.decimals)

        writeContract(
          {
            address: selectedToken.address as Address,
            abi: ERC20_ABI,
            functionName: 'transfer',
            args: [recipient as Address, amountInWei],
          },
          {
            onSuccess: () => {
              setIsSuccess(true)
              setRecipient('')
              setAmount('')
              onTransactionSuccess?.()
            },
            onError: (err) => {
              setError(`Transaction failed: ${err.message}`)
            },
          }
        )
      }
    } catch (err: any) {
      setError(`Transaction failed: ${err.message}`)
    }
  }

  // Token Selection Step
  if (step === 'select') {
    return (
      <div className="space-y-4">
        {/* Available Tokens List */}
        {availableTokens.length > 0 && (
          <div className="space-y-2">
            <p className={`text-sm ${textSecondary}`}>Your Tokens</p>
            {availableTokens.map((token) => (
              <button
                type="button"
                key={token.address}
                onClick={() => {
                  setSelectedToken(token)
                  setStep('send')
                  setError(null)
                }}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors text-left ${cardBg} hover:bg-purple-600/10`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: accentColor }}
                  >
                    <CircleDollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className={`font-semibold ${textPrimary}`}>
                      {token.symbol}
                    </p>
                    <p className={`text-xs ${textSecondary}`}>{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${textPrimary}`}>
                    {Number.parseFloat(token.balance).toFixed(4)}
                  </p>
                  <p className={`text-xs ${textSecondary}`}>{token.symbol}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Custom Token Address Input */}
        <div className="space-y-3 border-t border-purple-500/20 pt-4">
          <p className={`text-sm ${textSecondary}`}>Or enter token address</p>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="0x... (Token Contract Address)"
              value={customTokenAddress}
              onChange={(e) => {
                setCustomTokenAddress(e.target.value)
                setVerifiedToken(null)
                setError(null)
              }}
              className={`w-full rounded-lg border border-purple-500/30 bg-transparent px-3 py-2 font-mono text-base focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBg} ${textPrimary}`}
              disabled={isVerifying}
            />

            {verifiedToken && (
              <div className="space-y-2 rounded-lg border border-green-500/50 bg-green-900/30 p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="flex-1">
                    <p className={`font-semibold ${textPrimary}`}>
                      {verifiedToken.symbol} - {verifiedToken.name}
                    </p>
                    <p className={`text-sm ${textSecondary}`}>
                      Balance:{ ' '}
                      {Number.parseFloat(verifiedToken.balance).toFixed(4)}{' '}
                      {verifiedToken.symbol}
                    </p>
                  </div>
                </div>
                {Number(verifiedToken.balance) > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedToken(verifiedToken)
                      setStep('send')
                      setCustomTokenAddress('')
                      setVerifiedToken(null)
                      setError(null)
                    }}
                    className="w-full rounded-lg bg-green-600 py-2 text-white transition-colors hover:bg-green-700"
                  >
                    Send {verifiedToken.symbol}
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={verifyTokenAddress}
              disabled={isVerifying || !customTokenAddress}
              className="w-full rounded-lg py-2 text-white transition-colors disabled:bg-gray-600"
              style={{ backgroundColor: accentColor }}
            >
              {isVerifying ? 'Verifying...' : 'Verify Token'}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-900/30 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>
    )
  }

  // Send Step
  return (
    <div className="space-y-4">
      {/* Header with back button */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => {
            setStep('select')
            setSelectedToken(null)
            setRecipient('')
            setAmount('')
            setError(null)
            setIsSuccess(false)
          }}
          className={`flex items-center space-x-2 ${textSecondary} hover:${textPrimary}`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <h2 className={`text-xl font-bold ${textPrimary}`}>
          Send {selectedToken?.symbol}
        </h2>
      </div>

      {/* Selected Token Display */}
      {selectedToken && (
        <div className={`rounded-lg p-4 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: accentColor }}
              >
                <CircleDollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className={`font-semibold ${textPrimary}`}>
                  {selectedToken.symbol}
                </p>
                <p className={`text-xs ${textSecondary}`}>
                  {selectedToken.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm ${textSecondary}`}>Available</p>
              <p className={`font-semibold ${textPrimary}`}>
                {Number.parseFloat(selectedToken.balance).toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Send Form */}
      <div className="space-y-3">
        <div>
          <label
            className={`mb-1 block text-sm font-medium ${textSecondary}`}>
            Recipient Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className={`w-full rounded-lg border border-purple-500/30 px-3 py-2 font-mono text-base focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBg} ${textPrimary}`}
            disabled={isPending}
          />
        </div>

        <div>
          <label
            className={`mb-1 block text-sm font-medium ${textSecondary}`}>
            Amount
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full rounded-lg border border-purple-500/30 px-3 py-2 font-mono text-base focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBg} ${textPrimary}`}
              disabled={isPending}
            />
            {selectedToken && (
              <button
                type="button"
                onClick={() => setAmount(selectedToken.balance)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-purple-400 hover:text-purple-300"
              >
                MAX
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={sendTokens}
          disabled={isPending}
          className="w-full rounded-lg py-3 px-4 font-semibold text-white transition-colors disabled:bg-gray-600"
          style={{ backgroundColor: accentColor }}
        >
          {isPending ? 'Sending...' : `Send ${selectedToken?.symbol || 'Token'}`}
        </button>

        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-900/30 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {isSuccess && hash && (
          <div className="space-y-2 rounded-lg border border-green-500/50 bg-green-900/30 px-4 py-3 text-sm text-green-200">
            <p className="font-semibold">Transaction sent successfully!</p>
            <a
              href={`${monadTestnet.blockExplorers.default.url}/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-purple-400 underline hover:text-purple-300"
            >
              View on Explorer →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
