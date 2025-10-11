'use client'

import { monadTestnet } from '@/lib/viem'
import { useState } from 'react'
import { parseEther, type Address, isAddress } from 'viem'
import { useSendTransaction, useSwitchChain, useAccount } from 'wagmi'

export function SendTokens() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const { data: hash, sendTransaction, isPending } = useSendTransaction()
  const { switchChain } = useSwitchChain()
  const { chainId } = useAccount()

  const sendTokens = async () => {
    setError(null)
    setIsSuccess(false)

    // Validation
    if (!recipient || !amount) {
      setError('Please enter recipient address and amount')
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

    // Ensure we're on Monad Testnet
    if (chainId !== monadTestnet.id) {
      try {
        await switchChain({ chainId: monadTestnet.id })
      } catch (err) {
        setError('Please switch to Monad Testnet')
        return
      }
    }

    try {
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
          },
          onError: (err) => {
            setError(`Transaction failed: ${err.message}`)
          },
        },
      )
    } catch (err: any) {
      setError(`Transaction failed: ${err.message}`)
    }
  }

  return (
    <div className="space-y-4 border border-[#333] rounded-md p-4">
      <h2 className="text-xl font-bold text-left">Send MON</h2>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Amount (MON)
          </label>
          <input
            type="text"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            disabled={isPending}
          />
        </div>

        <button
          type="button"
          onClick={sendTokens}
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-md transition-colors"
        >
          {isPending ? 'Sending...' : 'Send MON'}
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {isSuccess && hash && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md text-sm space-y-2">
            <p className="font-semibold">Transaction sent successfully!</p>
            <a
              href={`${monadTestnet.blockExplorers.default.url}/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-blue-600 hover:text-blue-800 underline"
            >
              View on Explorer →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

