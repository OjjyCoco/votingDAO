'use client'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
//import { hardhat } from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
//import { sepolia } from '@/utils/sepolia';
import { configSepolia } from '@/utils/wagmi';


const config = getDefaultConfig({
  appName: 'voting',
  projectId: 'e02d1c9b3c5856ff339e19638eed0a34',
  chains: [configSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

// Tanstack :
const queryClient = new QueryClient();

const CustomRainbowKitProvider = ({ children }) => {
  return (
    <WagmiProvider config={configSepolia}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
          accentColor: '#1F2937',
          accentColorForeground: 'white',
          borderRadius: 'small',
          fontStack: 'system',
          overlayBlur: 'small',
        })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default CustomRainbowKitProvider