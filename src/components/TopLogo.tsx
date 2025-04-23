'use client'

import Link from 'next/link'

export default function TopLogo() {
  return (
    <Link href="/">
      <img
        src="/logo-icon.png"
        alt="NodeZ Icon"
        className="w-8 h-8 md:w-10 md:h-10 cursor-pointer transition hover:opacity-80"
      />
    </Link>
  )
}
