'use client'

import BackgroundCanvas from '@/components/BackgroundCanvas'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import Link from 'next/link'

export default function NewsPage() {
  const navItems = [
    { name: '教學專區', path: '/education' },
    { name: '影音專區', path: '/video' },
    { name: '新聞專區', path: '/news' },
    { name: '社群專區', path: '/community' },
  ]

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
        <BackgroundCanvas particleCount={180} blurAmount={3} particleColor="#37a8ff88" />

        {/* Top Navigation */}
        <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 z-50">
          <TopLogo />
          <ul className="hidden md:flex gap-6 text-white font-medium">
            {navItems.map((item) => (
              <li key={item.path} className="hover:text-[#37a8ff] transition">
                <Link href={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Page Content */}
        <main className="pt-32 px-6 max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-8">新聞專區</h1>
          <p className="text-gray-400 leading-relaxed">
            本區會定期更新區塊鏈教育趨勢、NodeZ 活動消息、幣圈產業新聞與相關洞察，幫助你掌握最新資訊。
          </p>

          {/* 預留未來新聞資料區 */}
          <div className="mt-12 text-sm text-gray-500">
            目前尚未有最新新聞內容，敬請期待！
          </div>
        </main>
      </div>
    </ClientWrapper>
  )
}
