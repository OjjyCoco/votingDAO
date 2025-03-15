import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  sepolia
} from 'wagmi/chains'; 

import { http } from 'viem';

export const configSepolia = getDefaultConfig({
  appName: 'Bank DApp',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    sepolia
  ],
  transports: {
    [sepolia.id]: http(process.env.SEPOLIA_RPC_URL),
  },
  ssr: true,
});