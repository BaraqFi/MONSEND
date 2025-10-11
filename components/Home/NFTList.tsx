'use client'

import { publicClient } from '@/lib/viem'
import { useEffect, useState } from 'react'
import type { Address } from 'viem'

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

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400 text-sm">Loading NFTs...</p>
      </div>
    )
  }

  if (nfts.length === 0 && !isLoading) {
    return (
      <div className="py-8 text-center space-y-3">
        <p className="text-gray-400 text-sm">No NFTs detected</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>
            To detect NFTs automatically, you'll need to add known NFT contract
            addresses.
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
          className="bg-[#1a1a2e] rounded-lg p-3 hover:bg-[#252541] transition-colors"
        >
          <div className="aspect-square bg-purple-600 rounded-lg mb-2 flex items-center justify-center">
            <span className="text-4xl">🖼️</span>
          </div>
          <p className="font-semibold text-white text-sm truncate">
            {nft.name}
          </p>
          <p className="text-xs text-gray-400 truncate">{nft.collection}</p>
        </div>
      ))}
    </div>
  )
}

