'use client'

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatEther, type Address, type Hash } from 'viem'

import { useTheme } from '@/components/theme-provider'
import { monadTestnet, publicClient } from '@/lib/viem'

interface Transaction {
  hash: Hash
  from: Address
  to: Address | null
  value: bigint
  timestamp: number
  blockNumber?: bigint
  type: 'sent' | 'received'
  status?: 'pending' | 'confirmed' | 'failed'
  tokenSymbol?: string
  tokenAddress?: Address | 'native'
}

// Local storage key for transaction history
const TRANSACTION_HISTORY_KEY = 'monsend_transaction_history'

// Helper functions for local storage
const getStoredTransactions = (address: Address): Transaction[] => {
  try {
    const stored = localStorage.getItem(`${TRANSACTION_HISTORY_KEY}_${address}`)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const storeTransaction = (address: Address, transaction: Transaction) => {
  try {
    const stored = getStoredTransactions(address)
    const updated = [transaction, ...stored.filter(tx => tx.hash !== transaction.hash)]
    localStorage.setItem(`${TRANSACTION_HISTORY_KEY}_${address}`, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to store transaction:', error)
  }
}

const updateTransactionStatus = (address: Address, hash: Hash, status: 'confirmed' | 'failed') => {
  try {
    const stored = getStoredTransactions(address)
    const updated = stored.map(tx => 
      tx.hash === hash ? { ...tx, status } : tx
    )
    localStorage.setItem(`${TRANSACTION_HISTORY_KEY}_${address}`, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to update transaction status:', error)
  }
}

export function TransactionHistory({ address }: { address: Address }) {
  const { theme } = useTheme()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)

      try {
        // Get stored transactions first
        const storedTransactions = getStoredTransactions(address)
        
        // Get blockchain transactions
        const latestBlock = await publicClient.getBlockNumber()
        const fromBlock = latestBlock - BigInt(1000) > BigInt(0) ? latestBlock - BigInt(1000) : BigInt(0)
        
        const txs: Transaction[] = []
        const addressLower = address.toLowerCase()
        const blocksToCheck = Math.min(Number(latestBlock - fromBlock), 50)

        for (let i = 0; i < blocksToCheck; i++) {
          const blockNum = latestBlock - BigInt(i)

          try {
            const block = await publicClient.getBlock({
              blockNumber: blockNum,
              includeTransactions: true,
            })

            if (block.transactions) {
              for (const tx of block.transactions) {
                if (typeof tx === 'object') {
                  const txFrom = tx.from?.toLowerCase()
                  const txTo = tx.to?.toLowerCase()

                  if (txFrom === addressLower || txTo === addressLower) {
                    txs.push({
                      hash: tx.hash,
                      from: tx.from,
                      to: tx.to,
                      value: tx.value,
                      timestamp: Number(block.timestamp),
                      blockNumber: block.number,
                      type: txFrom === addressLower ? 'sent' : 'received',
                      status: 'confirmed',
                      tokenSymbol: 'MON',
                      tokenAddress: 'native',
                    })
                  }
                }
              }
            }
          } catch (err) {
            console.error(`Failed to fetch block ${blockNum}:`, err)
          }
        }

        // Combine stored and blockchain transactions, removing duplicates
        const allTransactions = [...storedTransactions]
        
        for (const tx of txs) {
          const exists = allTransactions.some(storedTx => storedTx.hash === tx.hash)
          if (!exists) {
            allTransactions.push(tx)
          }
        }

        // Sort by timestamp (newest first)
        allTransactions.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1
          if (b.status === 'pending' && a.status !== 'pending') return 1
          return b.timestamp - a.timestamp
        })

        setTransactions(allTransactions)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
        // Fallback to stored transactions only
        setTransactions(getStoredTransactions(address))
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()

    // Refresh every 15 seconds (faster than before)
    const interval = setInterval(fetchTransactions, 15000)
    return () => clearInterval(interval)
  }, [address])

  const cardBg = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-lg p-4 ${cardBg}`}
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-700" />
              <div>
                <div className="h-5 w-20 animate-pulse rounded bg-gray-700" />
                <div className="mt-1 h-4 w-24 animate-pulse rounded bg-gray-700" />
              </div>
            </div>
            <div className="text-right">
              <div className="h-5 w-24 animate-pulse rounded bg-gray-700" />
              <div className="mt-1 h-4 w-16 animate-pulse rounded bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className={`text-sm ${textSecondary}`}>No transactions yet</p>
        <p className={`mt-2 text-xs ${textSecondary}`}>
          Your transaction history will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div
          key={tx.hash}
          className={`flex items-center justify-between rounded-lg p-4 transition-colors cursor-pointer ${cardBg} hover:bg-purple-600/10`}
          onClick={() =>
            window.open(
              `${monadTestnet.blockExplorers.default.url}/tx/${tx.hash}`,
              '_blank'
            )
          }
        >
          <div className="flex items-center space-x-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                tx.type === 'sent' ? 'bg-red-500/20' : 'bg-green-500/20'
              } ${tx.status === 'pending' ? 'animate-pulse' : ''}`}
            >
              {tx.type === 'sent' ? (
                <ArrowUpRight className="h-5 w-5 text-red-400" />
              ) : (
                <ArrowDownLeft className="h-5 w-5 text-green-400" />
              )}
            </div>
            <div>
              <p className={`text-sm font-semibold ${textPrimary}`}>
                {tx.type === 'sent' ? 'Sent' : 'Received'}
                {tx.status === 'pending' && (
                  <span className="ml-2 text-xs text-yellow-400">(Pending)</span>
                )}
                {tx.status === 'failed' && (
                  <span className="ml-2 text-xs text-red-400">(Failed)</span>
                )}
              </p>
              <p className={`text-xs ${textSecondary}`}>
                {new Date(tx.timestamp * 1000).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`font-semibold ${
                tx.type === 'sent' ? 'text-red-400' : 'text-green-400'
              }`}
            >
              {tx.type === 'sent' ? '-' : '+'}
              {formatEther(tx.value)} {tx.tokenSymbol || 'MON'}
            </p>
            <p className={`text-xs ${textSecondary}`}>
              {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Export functions for use in other components
export { storeTransaction, updateTransactionStatus }

