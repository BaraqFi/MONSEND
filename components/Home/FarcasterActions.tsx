import { useFrame } from '@/components/farcaster-provider'
import { useTheme } from '@/components/theme-provider'
import { APP_URL } from '@/lib/constants'

export function FarcasterActions() {
  const { theme } = useTheme()
  const { actions } = useFrame()

  const cardBg = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const accentColor = '#9333ea' // Purple 600

  const buttonClasses =
    'w-full rounded-lg p-2 text-sm text-white transition-colors'

  return (
    <div className={`space-y-4 rounded-lg p-4 ${cardBg}`}>
      <h2 className={`text-xl font-bold text-left ${textPrimary}`}>
        Farcaster Actions
      </h2>
      {actions ? (
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className={buttonClasses}
            style={{ backgroundColor: accentColor }}
            onClick={() => actions?.addMiniApp()}
          >
            addFrame
          </button>
          <button
            type="button"
            className={buttonClasses}
            style={{ backgroundColor: accentColor }}
            onClick={() => actions?.close()}
          >
            close
          </button>
          <button
            type="button"
            className={buttonClasses}
            style={{ backgroundColor: accentColor }}
            onClick={() =>
              actions?.composeCast({
                text: 'Check out this Monad Farcaster MiniApp Template!',
                embeds: [`${APP_URL}`],
              })
            }
          >
            composeCast
          </button>
          <button
            type="button"
            className={buttonClasses}
            style={{ backgroundColor: accentColor }}
            onClick={() => actions?.openUrl('https://docs.monad.xyz')}
          >
            openUrl
          </button>
          <button
            type="button"
            className={buttonClasses}
            style={{ backgroundColor: accentColor }}
            onClick={() =>
              actions?.signIn({ nonce: '1201', acceptAuthAddress: true })
            }
          >
            signIn
          </button>
          <button
            type="button"
            className={buttonClasses}
            style={{ backgroundColor: accentColor }}
            onClick={() => actions?.viewProfile({ fid: 17979 })}
          >
            viewProfile
          </button>
        </div>
      ) : (
        <p className="text-sm text-left">Actions not available</p>
      )}
    </div>
  )
}
