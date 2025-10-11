import { useFrame } from '@/components/farcaster-provider'
import { useTheme } from '@/components/theme-provider'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

export function Haptics() {
  const { theme } = useTheme()
  const { haptics } = useFrame()
  const [result, setResult] = useState<string | null>(null)

  const { mutate: triggerHaptic, isPending } = useMutation({
    mutationFn: async (hapticType: string) => {
      if (!haptics) throw new Error('Haptics not available')

      switch (hapticType) {
        case 'impact-light':
          return await haptics.impactOccurred('light')
        case 'impact-medium':
          return await haptics.impactOccurred('medium')
        case 'impact-heavy':
          return await haptics.impactOccurred('heavy')
        case 'impact-soft':
          return await haptics.impactOccurred('soft')
        case 'impact-rigid':
          return await haptics.impactOccurred('rigid')
        case 'notification-success':
          return await haptics.notificationOccurred('success')
        case 'notification-warning':
          return await haptics.notificationOccurred('warning')
        case 'notification-error':
          return await haptics.notificationOccurred('error')
        case 'selection':
          return await haptics.selectionChanged()
        default:
          throw new Error('Invalid haptic type')
      }
    },
    onSuccess: (_, hapticType) => {
      setResult(`${hapticType} triggered successfully!`)
      // Clear result after 2 seconds
      setTimeout(() => setResult(null), 2000)
    },
    onError: (error) => {
      setResult(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      // Clear result after 3 seconds
      setTimeout(() => setResult(null), 3000)
    },
  })

  const hapticButtons = [
    { type: 'impact-light', label: 'Light Impact', category: 'Impact' },
    { type: 'impact-medium', label: 'Medium Impact', category: 'Impact' },
    { type: 'impact-heavy', label: 'Heavy Impact', category: 'Impact' },
    { type: 'impact-soft', label: 'Soft Impact', category: 'Impact' },
    { type: 'impact-rigid', label: 'Rigid Impact', category: 'Impact' },
    {
      type: 'notification-success',
      label: 'Success Notification',
      category: 'Notification',
    },
    {
      type: 'notification-warning',
      label: 'Warning Notification',
      category: 'Notification',
    },
    {
      type: 'notification-error',
      label: 'Error Notification',
      category: 'Notification',
    },
    { type: 'selection', label: 'Selection Changed', category: 'Selection' },
  ]

  const groupedButtons = hapticButtons.reduce(
    (acc, button) => {
      if (!acc[button.category]) {
        acc[button.category] = []
      }
      acc[button.category].push(button)
      return acc
    },
    {} as Record<string, typeof hapticButtons>
  )

  const cardBg = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary =
    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const accentColor = '#9333ea' // Purple 600

  const buttonClasses =
    'rounded-lg p-2 text-sm text-white transition-colors disabled:bg-gray-600'

  return (
    <div className={`space-y-4 rounded-lg p-4 ${cardBg}`}>
      <h2 className={`text-xl font-bold text-left ${textPrimary}`}>Haptics</h2>
      <div className="space-y-6">
        {haptics ? (
          Object.entries(groupedButtons).map(([category, buttons]) => (
            <div key={category} className="space-y-2">
              <h3
                className={`text-sm font-semibold uppercase tracking-wide ${textSecondary}`}>
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {buttons.map((button) => (
                  <button
                    key={button.type}
                    type="button"
                    className={buttonClasses}
                    style={{ backgroundColor: accentColor }}
                    onClick={() => triggerHaptic(button.type)}
                    disabled={isPending}
                  >
                    {isPending ? 'Triggering...' : button.label}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className={`text-sm ${textSecondary}`}>
            Haptics not available on this device
          </p>
        )}
        {result && (
          <p
            className={`mt-4 rounded p-2 text-sm ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
            {result}
          </p>
        )}
      </div>
    </div>
  )
}