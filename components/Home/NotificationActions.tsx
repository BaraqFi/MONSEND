import { useFrame } from '@/components/farcaster-provider'
import { useTheme } from '@/components/theme-provider'
import { MiniAppNotificationDetails } from '@farcaster/miniapp-core'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function NotificationActions() {
  const { theme } = useTheme()
  const { context, actions } = useFrame()
  const [result, setResult] = useState<string | null>(null)
  const [notificationDetails, setNotificationDetails] =
    useState<MiniAppNotificationDetails | null>(null)

  const fid = context?.user?.fid

  useEffect(() => {
    if (context?.user?.fid) {
      setNotificationDetails(context?.client.notificationDetails ?? null)
    }
  }, [context])

  const { mutate: sendNotification, isPending: isSendingNotification } =
    useMutation({
      mutationFn: async () => {
        if (!fid) throw new Error('No fid')

        return await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fid,
            notificationDetails,
          }),
        })
      },
      onSuccess: (response) => {
        if (response.status === 200) setResult('Notification sent!')
        else if (response.status === 429)
          setResult('Rate limited. Try again later.')
        else setResult('Error sending notification.')
      },
      onError: () => {
        setResult('Error sending notification.')
      },
    })

  const cardBg = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const accentColor = '#9333ea' // Purple 600

  const buttonClasses =
    'w-full rounded-lg p-2 text-sm text-white transition-colors disabled:bg-gray-600'

  return (
    <div className={`space-y-4 rounded-lg p-4 ${cardBg}`}>
      <h2 className={`text-xl font-bold text-left ${textPrimary}`}>
        Notifications
      </h2>
      <div className="flex flex-col space-y-2">
        {notificationDetails ? (
          <button
            type="button"
            className={buttonClasses}
            style={{ backgroundColor: accentColor }}
            onClick={() => sendNotification()}
            disabled={isSendingNotification || !notificationDetails}
          >
            {isSendingNotification ? 'Sending...' : 'Send Test Notification'}
          </button>
        ) : (
          <>
            <button
              type="button"
              className={buttonClasses}
              style={{ backgroundColor: accentColor }}
              onClick={() => actions?.addMiniApp()}
            >
              Add this Mini App to receive notifications
            </button>
            <p className="text-xs text-red-500">
              You must add this Mini App and enable notifications to send a test
              notification.
            </p>
          </>
        )}
        {result && <p className="mt-2 text-sm">{result}</p>}
      </div>
    </div>
  )
}
