import { createPublicClient, http } from "viem";
import { sepolia } from 'viem/chains';

// const RPC = process.env.NEXT_PUBLIC_ALCHEMY_RPC || "";
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(SEPOLIA_RPC_URL)
})