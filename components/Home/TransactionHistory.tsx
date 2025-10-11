'use client'

import { publicClient, monadTestnet } from '@/lib/viem'
import { useEffect, useState } from 'react'
import { formatEther, type Address, type Hash } from 'viem'

interface Transaction {
  hash: Hash
  from: Address
  to: Address | null
  value: bigint
  timestamp: number
  blockNumber: bigint
  type: 'sent' | 'received'
}

export function TransactionHistory({ address }: { address: Address }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)

      try {
        // Get the latest block number
        const latestBlock = await publicClient.getBlockNumber()

        // Fetch recent blocks (last 1000 blocks for better coverage)
        const fromBlock =
          latestBlock - BigInt(1000) > BigInt(0)
            ? latestBlock - BigInt(1000)
            : BigInt(0)

        // Fetch blocks and extract transactions
        const txs: Transaction[] = []
        const addressLower = address.toLowerCase()

        // Scan through recent blocks to find transactions
        // Note: This is resource-intensive. In production, use MonadScan API
        const blocksToCheck = Math.min(Number(latestBlock - fromBlock), 50) // Limit to last 50 blocks

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

                  // Check if transaction involves our address
                  if (txFrom === addressLower || txTo === addressLower) {
                    txs.push({
                      hash: tx.hash,
                      from: tx.from,
                      to: tx.to,
                      value: tx.value,
                      timestamp: Number(block.timestamp),
                      blockNumber: block.number,
                      type: txFrom === addressLower ? 'sent' : 'received',
                    })
                  }
                }
              }
            }
          } catch (err) {
            // Skip blocks that error
            console.error(`Failed to fetch block ${blockNum}:`, err)
          }
        }

        // Sort by block number (newest first)
        txs.sort((a, b) => Number(b.blockNumber - a.blockNumber))

        setTransactions(txs)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
        setTransactions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()

    // Refresh every 30 seconds (slower to avoid rate limits)
    const interval = setInterval(fetchTransactions, 30000)
    return () => clearInterval(interval)
  }, [address])

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400 text-sm">Loading transactions...</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400 text-sm">No transactions yet</p>
        <p className="text-gray-500 text-xs mt-2">
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
          className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-lg hover:bg-[#252541] transition-colors cursor-pointer"
          onClick={() =>
            window.open(
              `${monadTestnet.blockExplorers.default.url}/tx/${tx.hash}`,
              '_blank',
            )
          }
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.type === 'sent' ? 'bg-red-500/20' : 'bg-green-500/20'
              }`}
            >
              <span className="text-xl">{tx.type === 'sent' ? '↗' : '↙'}</span>
            </div>
            <div>
              <p className="font-semibold text-white text-sm">
                {tx.type === 'sent' ? 'Sent' : 'Received'}
              </p>
              <p className="text-xs text-gray-400">
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
              {formatEther(tx.value)} MON
            </p>
            <p className="text-xs text-gray-500">
              {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

