import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NodeZ',
  description: 'Next-level blockchain education',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-black text-white'}>{children}</body>
    </html>
  )
}