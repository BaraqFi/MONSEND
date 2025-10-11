import App from '@/components/pages/app'
import { APP_URL } from '@/lib/constants'
import type { Metadata } from 'next'

const frame = {
  version: 'next',
  imageUrl: `${APP_URL}/images/feed.png`,
  button: {
    title: 'Launch MONSEND',
    action: {
      type: 'launch_frame',
      name: 'MONSEND',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: '#16162e',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'MONSEND',
    openGraph: {
      title: 'MONSEND',
      description: 'Send and receive MON tokens on Monad Testnet',
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default function Home() {
  return <App />
}
