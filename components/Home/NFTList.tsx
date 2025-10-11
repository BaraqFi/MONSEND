'use client'

import { Image as ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Address } from 'viem'

import { useTheme } from '@/components/theme-provider'
import { publicClient } from '@/lib/viem'

interface NFT {
  contractAddress: Address
  tokenId: string
  name: string
  collection: string
  image?: string
}

const ERC721_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
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
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export function NFTList({ address }: { address: Address }) {
  const { theme } = useTheme()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNFTs = async () => {
      setIsLoading(true)

      // Known NFT contract addresses on Monad Testnet
      // You can expand this list with known NFT addresses
      const nftAddresses: Address[] = [
        // Add known Monad Testnet NFT addresses here
        // Example: '0x...' as Address,
      ]

      const nftData: NFT[] = []

      for (const nftAddress of nftAddresses) {
        try {
          const [balance, collectionName] = await Promise.all([
            publicClient.readContract({
              address: nftAddress,
              abi: ERC721_ABI,
              functionName: 'balanceOf',
              args: [address],
            }),
            publicClient.readContract({
              address: nftAddress,
              abi: ERC721_ABI,
              functionName: 'name',
            }),
          ])

          if (balance > BigInt(0)) {
            // For simplicity, just show that the user owns NFTs from this collection
            // In production, you'd want to fetch individual token IDs and metadata
            nftData.push({
              contractAddress: nftAddress,
              tokenId: '0', // Placeholder
              name: `${collectionName} NFT`,
              collection: collectionName,
            })
          }
        } catch (error) {
          console.error(`Failed to fetch NFT ${nftAddress}:`, error)
        }
      }

      setNfts(nftData)
      setIsLoading(false)
    }

    fetchNFTs()

    // Refresh NFTs every 60 seconds
    const interval = setInterval(fetchNFTs, 60000)
    return () => clearInterval(interval)
  }, [address])

  const cardBg = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary =
    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`rounded-lg p-3 ${cardBg}`}>
            <div className="aspect-square animate-pulse rounded-lg bg-gray-700" />
            <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-gray-700" />
            <div className="mt-1 h-4 w-1/2 animate-pulse rounded bg-gray-700" />
          </div>
        ))}
      </div>
    )
  }

  if (nfts.length === 0) {
    return (
      <div className="space-y-3 py-8 text-center">
        <p className={`text-sm ${textSecondary}`}>No NFTs detected</p>
        <div className={`space-y-1 text-xs ${textSecondary}`}>
          <p>
            To detect NFTs automatically, you'll need to add known NFT
            contract addresses.
          </p>
          <p className="mt-2">
            Or use{' '}
            <a
              href="https://info.monadscan.com/myapikey/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              MonadScan API
            </a>{' '}
            for automatic detection.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {nfts.map((nft, index) => (
        <div
          key={`${nft.contractAddress}-${index}`}
          className={`rounded-lg p-3 transition-colors hover:bg-purple-600/10 ${cardBg}`}
        >
          <div
            className={`mb-2 flex aspect-square items-center justify-center rounded-lg bg-purple-600/10`}
          >
            <ImageIcon className="h-10 w-10 text-purple-400" />
          </div>
          <p className={`truncate text-sm font-semibold ${textPrimary}`}>
            {nft.name}
          </p>
          <p className={`truncate text-xs ${textSecondary}`}>
            {nft.collection}
          </p>
        </div>
      ))}
    </div>
  )
}

