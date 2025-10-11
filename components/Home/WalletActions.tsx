import { useFrame } from '@/components/farcaster-provider'
import { useTheme } from '@/components/theme-provider'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { parseEther } from 'viem'
import { monadTestnet } from 'viem/chains'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSwitchChain,
} from 'wagmi'

export function WalletActions() {
  const { theme } = useTheme()
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: hash, sendTransaction } = useSendTransaction()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()

  async function sendTransactionHandler() {
    sendTransaction({
      to: '0x7f748f154B6D180D35fA12460C7E4C631e28A9d7',
      value: parseEther('1'),
    })
  }

  const cardBg = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary =
    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const accentColor = '#9333ea' // Purple 600

  const buttonClasses =
    'w-full rounded-lg p-2 text-sm text-white transition-colors disabled:bg-gray-600'

  if (isConnected) {
    return (
      <div className={`space-y-4 rounded-lg p-4 ${cardBg}`}>
        <h2 className={`text-xl font-bold text-left ${textPrimary}`}>
          Wallet Actions
        </h2>
        <div className="flex flex-col space-y-4">
          <p className={`text-sm text-left ${textSecondary}`}>
            Connected to wallet:{ ' '}
            <span className={`rounded-md p-1 font-mono ${textPrimary}`}>
              {address}
            </span>
          </p>
          <p className={`text-sm text-left ${textSecondary}`}>
            Chain Id:{ ' '}
            <span className={`rounded-md p-1 font-mono ${textPrimary}`}>
              {chainId}
            </span>
          </p>
          {chainId === monadTestnet.id ? (
            <div
              className={`space-y-2 rounded-lg border p-4 ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
              <h2 className={`text-lg font-semibold text-left ${textPrimary}`}>
                Send Transaction Example
              </h2>
              <button
                type="button"
                className={buttonClasses}
                style={{ backgroundColor: accentColor }}
                onClick={sendTransactionHandler}
              >
                Send Transaction
              </button>
              {hash && (
                <button
                  type="button"
                  className={buttonClasses}
                  style={{ backgroundColor: accentColor }}
                  onClick={() =>
                    window.open(
                      `https://testnet.monadexplorer.com/tx/${hash}`,
                      '_blank'
                    )
                  }
                >
                  View Transaction
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              className={buttonClasses}
              style={{ backgroundColor: accentColor }}
              onClick={() => switchChain({ chainId: monadTestnet.id })}
            >
              Switch to Monad Testnet
            </button>
          )}

          <button
            type="button"
            className={buttonClasses}
            style={{ backgroundColor: accentColor }}
            onClick={() => disconnect()}
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    )
  }

  if (isEthProviderAvailable) {
    return (
      <div className={`space-y-4 rounded-lg p-4 ${cardBg}`}>
        <h2 className={`text-xl font-bold text-left ${textPrimary}`}>
          Wallet Actions
        </h2>
        <button
          type="button"
          className={buttonClasses}
          style={{ backgroundColor: accentColor }}
          onClick={() => connect({ connector: miniAppConnector() })}
        >
          Connect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className={`space-y-4 rounded-lg p-4 ${cardBg}`}>
      <h2 className={`text-xl font-bold text-left ${textPrimary}`}>
        Wallet Actions
      </h2>
      <p className={`text-sm text-left ${textSecondary}`}>
        Wallet connection only via Warpcast
      </p>
    </div>
  )
}
