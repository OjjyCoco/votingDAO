'use client'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  sepolia,
  hardhat
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";


const config = getDefaultConfig({
  appName: 'voting',
  projectId: 'e02d1c9b3c5856ff339e19638eed0a34',
  chains: [sepolia, hardhat],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

// Tanstack :
const queryClient = new QueryClient();

const CustomRainbowKitProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default CustomRainbowKitProvider