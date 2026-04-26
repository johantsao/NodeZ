/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'wgexrkgwdntnhkjcufcm.supabase.co' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  compiler: {
    styledComponents: true
  },
  // 這段是關鍵，讓 Vercel 能正確解析你的 alias
  webpack(config) {
    config.resolve.alias['@'] = require('path').resolve(__dirname, 'src');
    return config;
  }
}

module.exports = nextConfig;
