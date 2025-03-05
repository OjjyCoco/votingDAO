import CustomRainbowKitProvider from "./CutsomRainbowKitProvider"
import "./globals.css"
import Layout from "@/components/shared/Layout"
import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Voting",
  description: "First DApp with Tailwind / Shadcn-UI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <CustomRainbowKitProvider>
          <Layout>
            {children}
          </Layout>
        </CustomRainbowKitProvider>
      </body>
    </html>
  )
}