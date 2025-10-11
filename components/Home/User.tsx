import { useFrame } from '@/components/farcaster-provider'
import { useTheme } from '@/components/theme-provider'

export function User() {
  const { theme } = useTheme()
  const { context } = useFrame()

  const cardBg = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary =
    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  return (
    <div className={`space-y-4 rounded-lg p-4 ${cardBg}`}>
      <h2 className={`text-xl font-bold text-left ${textPrimary}`}>
        User Context
      </h2>
      <div className="flex flex-row items-start justify-start space-x-4">
        {context?.user ? (
          <>
            {context?.user?.pfpUrl && (
              <img
                src={context?.user?.pfpUrl}
                className="h-14 w-14 rounded-full"
                alt="User Profile"
                width={56}
                height={56}
              />
            )}
            <div className="flex flex-col items-start justify-start space-y-2">
              <p className={`text-sm text-left ${textSecondary}`}>
                Display Name:{ ' '}
                <span
                  className={`rounded-md p-1 font-mono ${textPrimary}`}>
                  {context?.user?.displayName}
                </span>
              </p>
              <p className={`text-sm text-left ${textSecondary}`}>
                Username:{ ' '}
                <span
                  className={`rounded-md p-1 font-mono ${textPrimary}`}>
                  {context?.user?.username}
                </span>
              </p>
              <p className={`text-sm text-left ${textSecondary}`}>
                FID:{ ' '}
                <span
                  className={`rounded-md p-1 font-mono ${textPrimary}`}>
                  {context?.user?.fid}
                </span>
              </p>
            </div>
          </>
        ) : (
          <p className={`text-sm text-left ${textSecondary}`}>
            User context not available
          </p>
        )}
      </div>
    </div>
  )
}
