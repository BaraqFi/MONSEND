import { Image as ImageIcon } from 'lucide-react'

import { useFrame } from '@/components/farcaster-provider'
import { useTheme } from '@/components/theme-provider'
import { APP_URL } from '@/lib/constants'

export default function CustomOGImageAction() {
  const { theme } = useTheme()
  const { context, actions } = useFrame()

  const fid = context?.user?.fid
  const username = context?.user?.username
  const pfpUrl = context?.user?.pfpUrl

  const handleGenerateCustomOGImage = () => {
    const ogImageUrl = `${APP_URL}/api/og?username=${username}&image=${pfpUrl}`
    actions?.composeCast({
      text: 'I generated a custom OG image using Monad Mini App template',
      embeds: [ogImageUrl],
    })
  }

  const cardBg = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary =
    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const accentColor = '#9333ea' // Purple 600

  return (
    <div className={`rounded-lg p-4 ${cardBg}`}>
      <h2 className={`text-xl font-bold text-left mb-2 ${textPrimary}`}>
        Generate Custom Image
      </h2>
      <div className="flex flex-col space-y-2">
        {fid ? (
          <button
            type="button"
            className="flex items-center justify-center space-x-2 rounded-md p-2 text-sm text-white"
            style={{ backgroundColor: accentColor }}
            onClick={() => handleGenerateCustomOGImage()}
            disabled={!fid}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Generate Custom Image</span>
          </button>
        ) : (
          <p className="text-xs text-red-500">
            Please login to generate a custom image
          </p>
        )}
      </div>
    </div>
  )
}
