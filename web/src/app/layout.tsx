import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Strings from "@/constants/Strings"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: Strings.APP.TITLE,
  description: Strings.APP.DESCRIPTION,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
