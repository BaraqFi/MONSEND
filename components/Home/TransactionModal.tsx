'use client'

import { CheckCircle, Clock, X, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatEther, type Address, type Hash } from 'viem'

import { useTheme } from '@/components/theme-provider'
import { monadTestnet, publicClient } from '@/lib/viem'
import { storeTransaction, updateTransactionStatus } from './TransactionHistory'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  transactionHash?: Hash
  fromAddress?: Address
  toAddress?: Address
  amount?: string
  tokenSymbol?: string
  tokenAddress?: Address | 'native'
}

type TransactionStatus = 'pending' | 'confirmed' | 'failed'

export function TransactionModal({
  isOpen,
  onClose,
  transactionHash,
  fromAddress,
  toAddress,
  amount,
  tokenSymbol = 'MON',
  tokenAddress = 'native',
}: TransactionModalProps) {
  const { theme } = useTheme()
  const [status, setStatus] = useState<TransactionStatus>('pending')
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const cardBg = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const borderColor = theme === 'dark' ? 'border-[#16162e]' : 'border-gray-200'

  // Check transaction status
  useEffect(() => {
    if (!isOpen || !transactionHash || !fromAddress) return

    const checkTransaction = async () => {
      setIsChecking(true)
      
      try {
        // Store the transaction immediately as pending
        const pendingTransaction = {
          hash: transactionHash,
          from: fromAddress,
          to: toAddress || null,
          value: tokenAddress === 'native' ? BigInt(0) : BigInt(0), // We'll update this when confirmed
          timestamp: Math.floor(Date.now() / 1000),
          type: 'sent' as const,
          status: 'pending' as const,
          tokenSymbol,
          tokenAddress,
        }
        
        storeTransaction(fromAddress, pendingTransaction)

        // Poll for transaction confirmation
        const pollInterval = setInterval(async () => {
          try {
            const receipt = await publicClient.getTransactionReceipt({
              hash: transactionHash,
            })

            if (receipt) {
              if (receipt.status === 'success') {
                setStatus('confirmed')
                setBlockNumber(receipt.blockNumber)
                
                // Update the stored transaction with confirmed status
                updateTransactionStatus(fromAddress, transactionHash, 'confirmed')
                
                // Get the actual transaction details
                const tx = await publicClient.getTransaction({ hash: transactionHash })
                const confirmedTransaction = {
                  hash: transactionHash,
                  from: tx.from,
                  to: tx.to,
                  value: tx.value,
                  timestamp: Math.floor(Date.now() / 1000),
                  blockNumber: receipt.blockNumber,
                  type: 'sent' as const,
                  status: 'confirmed' as const,
                  tokenSymbol,
                  tokenAddress,
                }
                
                storeTransaction(fromAddress, confirmedTransaction)
              } else {
                setStatus('failed')
                updateTransactionStatus(fromAddress, transactionHash, 'failed')
              }
              
              clearInterval(pollInterval)
              setIsChecking(false)
            }
          } catch (error) {
            // Transaction not yet mined, continue polling
            console.log('Transaction not yet confirmed, continuing to poll...')
          }
        }, 2000) // Poll every 2 seconds

        // Clear interval after 5 minutes to avoid infinite polling
        setTimeout(() => {
          clearInterval(pollInterval)
          if (status === 'pending') {
            setStatus('failed')
            updateTransactionStatus(fromAddress, transactionHash, 'failed')
          }
          setIsChecking(false)
        }, 300000) // 5 minutes

      } catch (error) {
        console.error('Error checking transaction:', error)
        setStatus('failed')
        updateTransactionStatus(fromAddress, transactionHash, 'failed')
        setIsChecking(false)
      }
    }

    checkTransaction()
  }, [isOpen, transactionHash, fromAddress, toAddress, tokenSymbol, tokenAddress, status])

  if (!isOpen) return null

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-400 animate-pulse" />
      case 'confirmed':
        return <CheckCircle className="h-8 w-8 text-green-400" />
      case 'failed':
        return <XCircle className="h-8 w-8 text-red-400" />
      default:
        return <Clock className="h-8 w-8 text-yellow-400" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Transaction Pending'
      case 'confirmed':
        return 'Transaction Confirmed'
      case 'failed':
        return 'Transaction Failed'
      default:
        return 'Processing...'
    }
  }

  const getStatusDescription = () => {
    switch (status) {
      case 'pending':
        return 'Your transaction is being processed on the blockchain. This may take a few moments.'
      case 'confirmed':
        return 'Your transaction has been successfully confirmed and added to the blockchain.'
      case 'failed':
        return 'Your transaction failed to process. Please try again or check your wallet for sufficient funds.'
      default:
        return 'Processing your transaction...'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className={`${cardBg} w-full max-w-md rounded-2xl p-6`}>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className={`text-xl font-bold ${textPrimary}`}>
            Transaction Status
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`text-2xl ${textSecondary} hover:${textPrimary}`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Status Icon and Text */}
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            {getStatusIcon()}
          </div>
          <h3 className={`text-lg font-semibold ${textPrimary}`}>
            {getStatusText()}
          </h3>
          <p className={`mt-2 text-sm ${textSecondary}`}>
            {getStatusDescription()}
          </p>
        </div>

        {/* Transaction Details */}
        <div className={`mb-6 space-y-3 rounded-lg border p-4 ${borderColor}`}>
          <div className="flex justify-between">
            <span className={`text-sm ${textSecondary}`}>Amount:</span>
            <span className={`text-sm font-semibold ${textPrimary}`}>
              {amount} {tokenSymbol}
            </span>
          </div>
          
          {toAddress && (
            <div className="flex justify-between">
              <span className={`text-sm ${textSecondary}`}>To:</span>
              <span className={`text-sm font-mono ${textPrimary}`}>
                {toAddress.slice(0, 6)}...{toAddress.slice(-4)}
              </span>
            </div>
          )}
          
          {transactionHash && (
            <div className="flex justify-between">
              <span className={`text-sm ${textSecondary}`}>Hash:</span>
              <span className={`text-sm font-mono ${textPrimary}`}>
                {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
              </span>
            </div>
          )}
          
          {blockNumber && (
            <div className="flex justify-between">
              <span className={`text-sm ${textSecondary}`}>Block:</span>
              <span className={`text-sm font-mono ${textPrimary}`}>
                {blockNumber.toString()}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {transactionHash && (
            <a
              href={`${monadTestnet.blockExplorers.default.url}/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full rounded-lg border py-3 text-center text-sm font-semibold transition-colors ${borderColor} ${textPrimary} hover:bg-purple-600/10`}
            >
              View on Explorer
            </a>
          )}
          
          {(status === 'confirmed' || status === 'failed') && (
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg bg-purple-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
            >
              Close
            </button>
          )}
        </div>

        {/* Loading indicator for pending transactions */}
        {status === 'pending' && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" style={{ animationDelay: '0.2s' }} />
              <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
