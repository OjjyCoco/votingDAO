import { createPublicClient, http } from "viem";
import { hardhat } from 'viem/chains';

// const RPC = process.env.NEXT_PUBLIC_ALCHEMY_RPC || "";

export const publicClient = createPublicClient({
    chain: hardhat,
    transport: http("http://127.0.0.1:8545")
})